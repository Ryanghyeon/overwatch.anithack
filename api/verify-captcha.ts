/* api/verify-captcha.ts */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// 브라우저가 아닌 백엔드에서 실행
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // POST 요청만 받도록 세팅
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '잘못된 요청 방식입니다.' });
  }

  // 리액트(useRegister)에서 보낸 토큰을 받음
  const { captchaToken } = req.body;

  // 버셀 환경 변수 호출
  const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

  if (!captchaToken) {
    return res
      .status(400)
      .json({ success: false, message: '통행증이 없습니다.' });
  }

  try {
    // 클라우드플레어 서버 호출 및 검증
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${SECRET_KEY}&response=${captchaToken}`,
      },
    );

    // TS 타입 단언
    interface TurnstileResponse {
      success: boolean;
    }
    const verifyData = (await response.json()) as TurnstileResponse;

    // 검증 결과 보내주기
    if (verifyData.success) {
      // 통과된 경우 200(OK) 신호를 보냅니다.
      return res.status(200).json({ success: true });
    } else {
      // 봇으로 판정된 경우 403(차단) 신호를 보냅니다.
      return res
        .status(403)
        .json({ success: false, message: '봇으로 의심됩니다.' });
    }
  } catch (error) {
    console.error('캡챠 서버 에러:', error);
    return res
      .status(500)
      .json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
}
