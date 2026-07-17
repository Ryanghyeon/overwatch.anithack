/* api/auth/discord/index.ts */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Method Guard: 브라우저 이동(GET)만 허용하여 무의미한 POST 공격 차단
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    console.error('[Discord API] 환경 변수 누락');
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  const url =
    `https://discord.com/oauth2/authorize` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&scope=identify%20email` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  // Vercel 권장 리다이렉트 (302 Found)
  res.redirect(302, url);
}
