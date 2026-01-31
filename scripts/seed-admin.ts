// .env.local 파일 먼저 로드
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// 환경 변수 로드 후 import
import Admin from '../src/lib/db/models/Admin';
import connectDB from '../src/lib/db/mongoose';

async function seedAdmin() {
  try {
    await connectDB();
    console.log('✅ MongoDB 연결 성공\n');

    // 환경 변수에서 관리자 정보 가져오기
    const adminEmail = process.env.ADMIN_EMAIL || '';
    const adminPassword = process.env.ADMIN_PASSWORD|| '';
    const adminName = process.env.ADMIN_NAME || '관리자';

    // 기존 관리자 확인
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  관리자 계정이 이미 존재합니다');
      console.log(`   이메일: ${existingAdmin.email}`);
      console.log(`   이름: ${existingAdmin.name}`);
      console.log(`   역할: ${existingAdmin.role}\n`);

      // 비밀번호 재설정 여부 확인
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      readline.question('비밀번호를 재설정하시겠습니까? (y/n): ', async (answer: string) => {
        if (answer.toLowerCase() === 'y') {
          existingAdmin.password = adminPassword; // pre-save hook에서 자동 해싱
          await existingAdmin.save();
          console.log(`✅ 비밀번호가 재설정되었습니다\n`);
          console.log('⚠️  보안을 위해 로그인 후 비밀번호를 변경하세요!');
        }
        readline.close();
        process.exit(0);
      });

      return;
    }

    // 새 관리자 생성
    const admin = await Admin.create({
      email: adminEmail,
      password: adminPassword,
      name: adminName,
      role: 'super',
    });

    console.log('✅ 관리자 계정 생성 완료');
    console.log(`   이메일: ${admin.email}`);
    console.log(`   이름: ${admin.name}`);
    console.log(`   역할: ${admin.role}\n`);
    console.log('⚠️  보안을 위해 로그인 후 비밀번호를 반드시 변경하세요!');

    process.exit(0);
  } catch (error) {
    console.error('❌ 시드 스크립트 오류:', error);
    process.exit(1);
  }
}

seedAdmin();
