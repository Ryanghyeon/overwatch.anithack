/* api/auth/discord/discord.js */

// ESLint 에러 방지용: 서버 환경(Node.js) 변수인 process를 쓰기 위해 강제 선언
/* global process */
export default function handler(req, res) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  const url =
    `https://discord.com/oauth2/authorize` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&scope=identify%20email` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  res.writeHead(302, {
    Location: url,
  });

  res.end();
}
