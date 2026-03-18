import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/db/models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24시간
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          await connectDB();
          await User.findOneAndUpdate(
            { googleId: profile.sub },
            {
              $set: {
                name: profile.name || '',
                email: profile.email || '',
                image: (profile as { picture?: string }).picture || '',
                googleId: profile.sub,
                lastLogin: new Date(),
              },
              $setOnInsert: {
                nickname: null,
              },
            },
            { upsert: true, new: true }
          );
          return true;
        } catch (error) {
          const err = error as { code?: number; message?: string };
          console.error('User upsert error:', JSON.stringify({ code: err.code, message: err.message, email: profile.email, googleId: profile.sub }));
          // DB 에러가 있어도 로그인은 허용 (사용자 차단 방지)
          return true;
        }
      }
      return true;
    },
    async jwt({ token, account, profile, trigger }) {
      if (account && profile) {
        token.googleId = profile.sub;
        try {
          await connectDB();
          // upsert: signIn에서 실패했을 경우를 대비해 여기서도 보장
          const dbUser = await User.findOneAndUpdate(
            { googleId: profile.sub },
            {
              $set: {
                name: profile.name || '',
                email: profile.email || '',
                image: (profile as { picture?: string }).picture || '',
                googleId: profile.sub,
                lastLogin: new Date(),
              },
              $setOnInsert: {
                nickname: null,
              },
            },
            { upsert: true, new: true }
          );
          if (dbUser) {
            token.userId = dbUser._id.toString();
            token.nickname = dbUser.nickname || '';
            console.log('JWT upsert success:', { userId: token.userId, email: profile.email });
          } else {
            console.error('JWT upsert returned null:', { email: profile.email, googleId: profile.sub });
          }
        } catch (error) {
          const err = error as { code?: number; message?: string };
          console.error('JWT callback error:', JSON.stringify({ code: err.code, message: err.message, email: profile.email, googleId: profile.sub }));
        }
      }

      // update() 호출 시 DB에서 최신 닉네임 반영
      if (trigger === 'update' && token.userId) {
        try {
          await connectDB();
          const dbUser = await User.findById(token.userId);
          if (dbUser) {
            token.nickname = dbUser.nickname || '';
          }
        } catch (error) {
          console.error('JWT update error:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.googleId = token.googleId as string;
        session.user.nickname = (token.nickname as string) || '';
      }
      return session;
    },
  },
});
