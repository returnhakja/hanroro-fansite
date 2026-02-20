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
          console.error('User upsert error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, profile, trigger }) {
      if (account && profile) {
        token.googleId = profile.sub;
        try {
          await connectDB();
          const dbUser = await User.findOne({ googleId: profile.sub });
          if (dbUser) {
            token.userId = dbUser._id.toString();
            token.nickname = dbUser.nickname || '';
          }
        } catch (error) {
          console.error('JWT callback error:', error);
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
