/* src/pages/Login.tsx */

import { cn } from '@/utils/cn';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { Turnstile } from 'react-turnstile'; // 나중에 npm install react-turnstile 후 주석 해제
import { useEmailLoginMutation, handleDiscordLogin } from '@/hooks';

export const Login = () => {
  const { mutate: login, isPending, error } = useEmailLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [localError, setLocalError] = useState('');

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password)
      return setLocalError('이메일과 비밀번호를 입력해주세요.');

    setLocalError('');
    login(
      { email, password, keepLoggedIn },
      { onError: () => setFailedAttempts((prev) => prev + 1) },
    );
  };

  const handlePasswordReset = () => {
    if (!resetEmail) return alert('가입하신 이메일을 입력해 주세요.');

    setIsResetting(true);
    setTimeout(() => {
      alert(
        '비밀번호 재설정 링크가 이메일로 발송되었습니다!\n메일함을 확인해 주세요.',
      );
      setShowForgotModal(false);
      setIsResetting(false);
      setResetEmail('');
    }, 1000);
  };

  return (
    <div className="flex grow items-center justify-center p-5">
      {/* 메인 로그인 카드 */}
      <div
        className={cn(
          // 1. 레이아웃 & 크기
          'w-full max-w-105 p-10',
          // 2. 배경 & 테두리 & 그림자
          'border-border-main bg-bg-card rounded-2xl border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]',
          // 3. 텍스트
          'text-text-main',
        )}
      >
        <h1 className="mb-8 text-center text-[28px] font-extrabold tracking-tight">
          로그인
        </h1>

        <form onSubmit={onSubmit} noValidate>
          {/* 📧 이메일 입력 */}
          <div className="mb-5">
            <label className="text-text-muted mb-2 block text-[14px] font-semibold">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLocalError('');
              }}
              placeholder="example@email.com"
              disabled={isPending}
              className={cn(
                'text-text-main w-full rounded-lg px-4 py-3 text-[15px] transition-all outline-none',
                'border-border-main bg-bg-main border',
                'focus:border-primary focus:bg-bg-card focus:ring-primary focus:ring-2',
              )}
            />
          </div>

          {/* 🔑 비밀번호 입력 */}
          <div className="mb-5">
            <label className="text-text-muted mb-2 block text-[14px] font-semibold">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLocalError('');
              }}
              placeholder="비밀번호 입력"
              disabled={isPending}
              className={cn(
                'text-text-main w-full rounded-lg px-4 py-3 text-[15px] transition-all outline-none',
                'border-border-main bg-bg-main border',
                'focus:border-primary focus:bg-bg-card focus:ring-primary focus:ring-2',
              )}
            />
          </div>

          {/* 체크박스 그룹 */}
          <div className="mb-5 flex items-center justify-between">
            <label className="group flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="border-border-main text-primary accent-primary focus:ring-primary h-4 w-4 cursor-pointer rounded"
              />
              <span className="text-text-muted group-hover:text-text-main ml-2 text-[13px] select-none">
                로그인 상태 유지
              </span>
            </label>
            <label className="group flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="border-border-main text-primary accent-primary focus:ring-primary h-4 w-4 cursor-pointer rounded"
              />
              <span className="text-text-muted group-hover:text-text-main ml-2 text-[13px] select-none">
                이메일 저장
              </span>
            </label>
          </div>

          {/* 캡챠 영역 */}
          {failedAttempts >= 5 && (
            <div className="mb-4 flex min-h-16.25 justify-center">
              <div className="border-border-main bg-bg-main text-text-muted flex h-16.25 w-full items-center justify-center rounded-lg border text-sm">
                [ Turnstile 캡챠 영역 ]
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {(error || localError) && (
            <p className="mb-4 animate-bounce text-center text-[13px] font-medium text-[#ff4757]">
              {localError || error?.message}
            </p>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              'mt-1 w-full rounded-lg py-3.5 text-[16px] font-bold transition-all duration-200',
              'bg-bg-main border-border-main text-text-muted border',
              'hover:border-primary hover:text-primary hover:-translate-y-px',
              'active:scale-[0.98]', // 👈 클릭 시 살짝 들어가는 물리적 타격감 추가
              'disabled:transform-none disabled:bg-gray-400 disabled:text-white',
            )}
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>

          {/* 디스코드 로그인 */}
          <button
            type="button"
            onClick={handleDiscordLogin}
            className={cn(
              'mt-4 mb-6 w-full rounded-lg py-3.5 text-[15px] font-bold text-white transition-all duration-200',
              'bg-discord shadow-[0_4px_12px_rgba(88,101,242,0.2)]',
              'hover:-translate-y-px hover:brightness-90',
              'active:scale-[0.98]', // 👈 역시 클릭 타격감 추가
            )}
          >
            Discord 소셜 로그인
          </button>

          {/* 하단 링크 */}
          <div className="text-text-muted mt-5 flex items-center justify-center gap-3 text-[13px] font-medium">
            <Link
              to="/register"
              className="hover:text-primary transition-colors hover:underline"
            >
              회원가입
            </Link>
            <span className="text-border-main">|</span>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="hover:text-primary transition-colors hover:underline"
            >
              비밀번호 찾기
            </button>
            <span className="text-border-main">|</span>
            <Link
              to="/"
              className="hover:text-primary transition-colors hover:underline"
            >
              홈으로
            </Link>
          </div>
        </form>
      </div>

      {/* ✨ 비밀번호 찾기 모달창 */}
      {showForgotModal && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center p-4',
            'bg-black/60 backdrop-blur-sm',
          )}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className={cn(
              'flex w-full max-w-100 flex-col rounded-2xl p-8',
              'border-border-main bg-bg-card text-text-main border shadow-[0_10px_40px_rgba(0,0,0,0.5)]',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-[20px] font-bold">비밀번호 찾기</h2>
            <p className="text-text-muted mb-6 text-[13px] leading-relaxed">
              가입하신 이메일 주소를 입력하시면,
              <br />
              비밀번호 재설정 링크를 보내드립니다.
            </p>

            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="가입한 이메일 입력"
              className={cn(
                'mb-4 w-full rounded-lg px-4 py-3 text-[15px] transition-all outline-none',
                'border-border-main bg-bg-main border',
                'focus:border-primary focus:bg-bg-card focus:ring-primary focus:ring-2',
              )}
            />

            <div className="mb-4 flex min-h-16.25 justify-center">
              <div className="border-border-main bg-bg-main text-text-muted flex h-16.25 w-full items-center justify-center rounded-lg border text-sm">
                [ Turnstile 캡챠 영역 ]
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePasswordReset}
                disabled={isResetting}
                className={cn(
                  'flex-1 rounded-lg py-3 font-bold text-white transition-all',
                  'bg-primary hover:bg-primary-hover',
                )}
              >
                {isResetting ? '발송 중...' : '이메일 받기'}
              </button>
              <button
                onClick={() => setShowForgotModal(false)}
                className={cn(
                  'border-border-main flex-1 rounded-lg border py-3 font-bold transition-all',
                  'text-text-muted hover:bg-bg-main bg-transparent',
                )}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
