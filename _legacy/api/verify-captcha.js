/* api/verify-captcha.js */

// 이 코드는 유저의 브라우저가 아닌 '버셀 서버'에서만 몰래 실행됩니다!
// ESLint 에러 방지용: 서버 환경(Node.js) 변수인 process를 쓰기 위해 강제 선언
/* global process */

export default async function handler(req, res) {
  // POST 요청만 받도록 세팅
  if (req.method !== "POST") {
    return res.status(405).json({ message: "잘못된 요청 방식입니다." });
  }

  // 1. 리액트(useRegister)에서 보낸 통행증(Token)을 받습니다.
  const { captchaToken } = req.body;

  // 2. ✨ 금고 열기! 버셀 환경 변수에 숨겨둔 비밀키를 여기서 꺼냅니다.
  const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

  if (!captchaToken) {
    return res
      .status(400)
      .json({ success: false, message: "통행증이 없습니다." });
  }

  try {
    // 3. 클라우드플레어 본사에 "이 통행증 진짜야?" 하고 비밀키와 함께 물어봅니다.
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${SECRET_KEY}&response=${captchaToken}`,
      },
    );

    const verifyData = await response.json();

    // 4. 검증 결과 보내주기
    if (verifyData.success) {
      // 통과! 리액트에게 200(OK) 신호를 보냅니다.
      return res.status(200).json({ success: true });
    } else {
      // 봇으로 판정됨! 리액트에게 403(차단) 신호를 보냅니다.
      return res
        .status(403)
        .json({ success: false, message: "봇으로 의심됩니다." });
    }
  } catch (error) {
    console.error("캡챠 서버 에러:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 에러가 발생했습니다." });
  }
}
