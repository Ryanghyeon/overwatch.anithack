import admin from 'firebase-admin';

// Vercel(서버리스) 환경에서 파이어베이스 앱이 중복 초기화되는 것을 방지합니다.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // ⚠️ 중요: Vercel 환경변수에서 줄바꿈(\n) 문자가 제대로 인식되도록 처리합니다.
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("No authorization code received.");
  }

  try {
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    });

    // 1. 디스코드 Access Token 요청
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(), // 확실한 문자열 변환
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("🚨 디스코드 토큰 에러:", tokenData);
      return res.status(400).json({ message: "토큰 발급 거절", error: tokenData });
    }

    // 2. 디스코드 사용자 정보 조회
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const user = await userResponse.json();

    // 3. 🔥 파이어베이스 커스텀 토큰 생성 (디스코드 유저 ID 사용)
    const firebaseToken = await admin.auth().createCustomToken(user.id);

    // 4. 프론트엔드 로그인 페이지로 파이어베이스 토큰과 함께 리다이렉트
    return res.redirect(
      `https://overwatch-anithack-otzm.vercel.app/login?token=${firebaseToken}`
    );

  } catch (err) {
    console.error("🚨 서버 에러:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
