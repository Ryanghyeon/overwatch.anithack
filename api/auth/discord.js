export default function handler(req, res) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  const url =
    `https://discord.com/oauth2/authorize` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&scope=identify email` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  res.send(url);
}
