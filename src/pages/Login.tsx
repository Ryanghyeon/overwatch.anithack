/* src/pages/Login.tsx */

import { cn, isValidEmail } from '@/utils';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Turnstile } from 'react-turnstile';
import { useEmailLoginMutation, handleDiscordLogin } from '@/hooks';

export const Login = () => {
  const { mutate: login, isPending, error } = useEmailLoginMutation();

  // 메인 폼 유저 입력 데이터 묶기
  const [formData, setFormData] = useState(() => ({
    email: localStorage.getItem('savedEmail') || '', // 처음 마운트될 때 한번만 실행됨
    password: '',
    keepLoggedIn: false,
    rememberEmail: !!localStorage.getItem('savedEmail'),
  }));

  // 메인 폼 에러 & 검증 상태 묶기
  const [uiState, setUiState] = useState({
    failedAttempts: 0,
    localError: '',
    turnstileToken: null as string | null,
  });

  // 비밀번호 찾기(모달) 전용 상태 묶기
  const [modalState, setModalState] = useState({
    isOpen: false,
    email: '',
    isResetting: false,
    error: '',
  });

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (uiState.failedAttempts >= 5 && !uiState.turnstileToken) {
      return setUiState((prev) => ({
        ...prev,
        localError: '안전한 환경인지 확인 중입니다..',
      }));
    }

    if (!formData.email || !formData.password) {
      return setUiState((prev) => ({
        ...prev,
        localError: '이메일과 비밀번호를 모두 입력해주세요.',
      }));
    }
    if (!isValidEmail(formData.email)) {
      return setUiState((prev) => ({
        ...prev,
        localError: '올바른 이메일 형식을 입력해 주세요.',
      }));
    }

    setUiState((prev) => ({ ...prev, localError: '' }));
    // 로컬스토리지 이메일 저장
    if (formData.rememberEmail) {
      localStorage.setItem('savedEmail', formData.email);
    } else {
      localStorage.removeItem('savedEmail');
    }

    // 로그인 실행
    login(
      {
        email: formData.email,
        password: formData.password,
        keepLoggedIn: formData.keepLoggedIn,
      },
      {
        onError: () =>
          setUiState((prev) => ({
            ...prev,
            failedAttempts: prev.failedAttempts + 1,
          })),
      },
    );
  };

  const handlePasswordReset = () => {
    if (!modalState.email)
      return setModalState((prev) => ({
        ...prev,
        error: '가입하신 이메일 주소를 입력해 주세요.',
      }));
    if (!isValidEmail(modalState.email)) {
      return setModalState((prev) => ({
        ...prev,
        error: '올바른 이메일 형식을 입력해 주세요.',
      }));
    }

    setModalState((prev) => ({ ...prev, isResetting: true }));
    setTimeout(() => {
      alert(
        '비밀번호 재설정 링크가 이메일로 발송되었습니다!\n메일함을 확인해 주세요.',
      );
      setModalState({
        isOpen: false,
        email: '',
        isResetting: false,
        error: '',
      }); // 전체 초기화
    }, 1000);
  };

  return (
    <div className="flex grow items-center justify-center p-5">
      <div
        className={cn(
          'w-full max-w-105 p-10',
          'border-border-main bg-bg-card rounded-2xl border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]',
          'text-text-main',
        )}
      >
        <h1 className="mb-8 text-center text-[28px] font-extrabold tracking-tight">
          로그인
        </h1>

        <form onSubmit={onSubmit} noValidate>
          <div className="mb-5">
            <label className="text-text-muted mb-2 block text-[14px] font-semibold">
              이메일
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                setUiState((prev) => ({ ...prev, localError: '' }));
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

          <div className="mb-5">
            <label className="text-text-muted mb-2 block text-[14px] font-semibold">
              비밀번호
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, password: e.target.value }));
                setUiState((prev) => ({ ...prev, localError: '' }));
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

          <div className="mb-5 flex items-center justify-between">
            <label className="group flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={formData.keepLoggedIn}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    keepLoggedIn: e.target.checked,
                  }))
                }
                className="border-border-main text-primary accent-primary focus:ring-primary h-4 w-4 cursor-pointer rounded"
              />
              <span className="text-text-muted group-hover:text-text-main ml-2 text-[13px] select-none">
                로그인 상태 유지
              </span>
            </label>
            <label className="group flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={formData.rememberEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberEmail: e.target.checked,
                  }))
                }
                className="border-border-main text-primary accent-primary focus:ring-primary h-4 w-4 cursor-pointer rounded"
              />
              <span className="text-text-muted group-hover:text-text-main ml-2 text-[13px] select-none">
                이메일 저장
              </span>
            </label>
          </div>

          {uiState.failedAttempts >= 5 && (
            <div className="mb-4 flex min-h-16.25 justify-center">
              <Turnstile
                sitekey="0x4AAAAAADwlrxyiGsogdlgW"
                onVerify={(token) => {
                  setUiState((prev) => ({
                    ...prev,
                    turnstileToken: token,
                    localError: '',
                  }));
                }}
              />
            </div>
          )}

          {(error || uiState.localError) && (
            <p className="mb-4 text-center text-[13px] font-medium text-[#ff4757]">
              {uiState.localError
                ? uiState.localError
                : '이메일 또는 비밀번호가 일치하지 않습니다.'}
            </p>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={
              isPending ||
              (uiState.failedAttempts >= 5 && !uiState.turnstileToken)
            }
            className={cn(
              'mt-1 w-full rounded-lg py-3.5 text-[16px] font-bold transition-all duration-200',
              'bg-bg-main border-border-main text-text-muted border',
              'hover:border-primary hover:text-primary hover:-translate-y-px',
              'active:scale-[0.98]',
              'disabled:transform-none disabled:bg-gray-400 disabled:text-white',
            )}
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>

          {/*  디스코드 버튼 */}
          <button
            type="button"
            disabled={isPending}
            onClick={handleDiscordLogin}
            className={cn(
              'mt-4 mb-6 w-full rounded-lg py-3.5 text-[15px] font-bold text-white transition-all duration-200',
              'bg-discord shadow-[0_4px_12px_rgba(88,101,242,0.2)]',
              'hover:-translate-y-px hover:brightness-90',
              'active:scale-[0.98]',
            )}
          >
            Discord 소셜 로그인
          </button>

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
              onClick={() =>
                setModalState((prev) => ({ ...prev, isOpen: true }))
              }
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

      {/* 비밀번호 찾기 모달창 */}
      {modalState.isOpen && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm',
          )}
          onClick={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
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
              value={modalState.email}
              onChange={(e) =>
                setModalState((prev) => ({
                  ...prev,
                  email: e.target.value,
                  error: '',
                }))
              }
              placeholder="가입한 이메일 입력"
              className={cn(
                'mb-4 w-full rounded-lg px-4 py-3 text-[15px] transition-all outline-none',
                'border-border-main bg-bg-main border',
                'focus:border-primary focus:bg-bg-card focus:ring-primary focus:ring-2',
              )}
            />
            {modalState.error && (
              <p className="mb-4 text-center text-[13px] font-medium text-[#ff4757]">
                {modalState.error}
              </p>
            )}

            <div className="mb-4 flex min-h-16.25 justify-center">
              <Turnstile
                sitekey="0x4AAAAAADwlrxyiGsogdlgW"
                onVerify={(token) => {
                  setUiState((prev) => ({ ...prev, turnstileToken: token }));
                  setModalState((prev) => ({ ...prev, error: '' }));
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePasswordReset}
                disabled={modalState.isResetting}
                className={cn(
                  'bg-primary hover:bg-primary-hover flex-1 rounded-lg py-3 font-bold text-white transition-all',
                )}
              >
                {modalState.isResetting ? '발송 중...' : '이메일 받기'}
              </button>
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, isOpen: false }))
                }
                className={cn(
                  'border-border-main text-text-muted hover:bg-bg-main flex-1 rounded-lg border bg-transparent py-3 font-bold transition-all',
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
