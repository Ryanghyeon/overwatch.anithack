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

    // 1. Access Token 요청
    const tokenResponse = await fetch(
      "https://discord.com/api/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(), // 🔥 확실한 문자열 변환을 위해 .toString() 추가
      }
    );

    const tokenData = await tokenResponse.json();

    // 🔥 토큰 발급 실패 시 Vercel 서버 로그에 상세 에러 기록
    if (!tokenData.access_token) {
      console.error("🚨 디스코드 토큰 에러:", tokenData);
      return res.status(400).json({
        message: "디스코드에서 토큰 발급을 거절했습니다.",
        discordError: tokenData
      });
    }

    // 2. 사용자 정보 조회
    const userResponse = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const user = await userResponse.json();

    // 💡 원래라면 여기서 Firebase Admin SDK를 사용해 Custom Token을 생성해야 합니다.
    // 예: const firebaseToken = await admin.auth().createCustomToken(user.id);
    // 그리고 프론트엔드로 firebaseToken을 전달해주어야 파이어베이스 로그인이 가능합니다.

    return res.redirect(
      `https://overwatch-anithack-otzm.vercel.app/login?user=${encodeURIComponent(
        JSON.stringify({
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        })
      )}`
    );

  } catch (err) {
    console.error("🚨 서버 내부 에러:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

//======================================================================================================

// import { getAdminAuth } from "../../firebaseAdmin.js";

// export default async function handler(req, res) {
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).send("No authorization code received.");
//   }

//   try {
//     const params = new URLSearchParams({
//       client_id: process.env.DISCORD_CLIENT_ID,
//       client_secret: process.env.DISCORD_CLIENT_SECRET,
//       grant_type: "authorization_code",
//       code,
//       redirect_uri: process.env.DISCORD_REDIRECT_URI,
//     });

//     const tokenResponse = await fetch(
//       "https://discord.com/api/oauth2/token",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: params.toString(),
//       }
//     );

//     const tokenData = await tokenResponse.json();

//     if (!tokenData.access_token) {
//       return res.status(400).json(tokenData);
//     }

//     const userResponse = await fetch(
//       "https://discord.com/api/users/@me",
//       {
//         headers: {
//           Authorization: `Bearer ${tokenData.access_token}`,
//         },
//       }
//     );

//     const user = await userResponse.json();

//     const auth = getAdminAuth();

//     const customToken = await auth.createCustomToken(user.id, {
//       username: user.username,
//       avatar: user.avatar,
//     });

//     return res.redirect(
//       `https://overwatch-anithack-otzm.vercel.app/login?token=${encodeURIComponent(customToken)}`
//     );

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// }
