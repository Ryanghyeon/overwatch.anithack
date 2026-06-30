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
        body: params,
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(400).json(tokenData);
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
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
