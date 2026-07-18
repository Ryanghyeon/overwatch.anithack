import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Turnstile } from 'react-turnstile';
import {
  cn,
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isValidBattletag,
} from '@/utils';
import { useRegisterMutation, useCheckDuplicate } from '@/hooks';

// 내부 재사용 컴포넌트: InputGroup
interface InputGroupProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  tip?: string;
  error?: string;
}

const InputGroup = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  tip,
  error,
}: InputGroupProps) => (
  <div className="mb-1">
    <label className="text-text-muted mb-2 block text-sm font-semibold">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'border-border-main bg-bg-main text-text-main mb-1 w-full rounded-lg border px-4 py-3 text-[15px] transition-all duration-200 outline-none',
        'placeholder:text-text-muted/70',
        'focus:border-primary focus:ring-primary/20 focus:ring-2',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
      )}
    />
    <div className="flex min-h-4.5 items-start">
      {error ? (
        <p className="m-0 text-xs font-bold text-red-500"> {error}</p>
      ) : (
        tip && <p className="m-0 text-xs text-sky-400">{tip}</p>
      )}
    </div>
  </div>
);

// 메인 페이지 컴포넌트: Register
export const Register = () => {
  const navigate = useNavigate();
  const { mutateAsync: executeRegister, isPending: isRegistering } =
    useRegisterMutation();
  // 중복 검사 훅 불러오기
  const { validateDuplicate, isChecking } = useCheckDuplicate();

  // 1. 폼 상태 관리
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [battletag, setBattletag] = useState('');

  // 2. 에러 상태 관리
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [battletagError, setBattletagError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasError = false;

    // 동기적 정규식/형식 검증

    if (!username.trim()) {
      setUsernameError('닉네임을 입력해 주세요.');
      hasError = true;
    } else if (!isValidUsername(username)) {
      setUsernameError('닉네임은 특수문자를 제외한 2~12자여야 합니다.');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('이메일을 입력해 주세요.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError('이메일 형식이 올바르지 않습니다.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('비밀번호를 입력해 주세요.');
      hasError = true;
    } else if (!isValidPassword(password)) {
      setPasswordError('비밀번호는 최소 6자리 이상이어야 합니다.');
      hasError = true;
    }

    if (battletag.trim() && !isValidBattletag(battletag)) {
      setBattletagError(
        'Battletag 형식이 올바르지 않습니다. (예: 트레이서#1234)',
      );
      hasError = true;
    }

    // 형식 검사에서 걸리면 바로 중단
    if (hasError) return;

    // 비동기 데이터베이스 중복 검사 (MyPage와 동일)
    try {
      // 닉네임 중복 검사
      const isNameDuplicated = await validateDuplicate({
        field: 'username',
        value: username.trim(),
      });
      if (isNameDuplicated) {
        setUsernameError('이미 누군가 사용 중인 닉네임입니다 😭');
        hasError = true;
      }

      // 배틀태그 중복 검사 (입력값이 있을 때만)
      if (battletag.trim()) {
        const isTagDuplicated = await validateDuplicate({
          field: 'battletag',
          value: battletag.trim(),
        });
        if (isTagDuplicated) {
          setBattletagError('이미 누군가 연동한 배틀태그입니다 😭');
          hasError = true;
        }
      }

      // 중복된 값이 있다면 진행 중단
      if (hasError) return;
    } catch (error) {
      console.error('중복 검사 중 오류 발생:', error);
      alert('서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 봇 방어 및 최종 가입 통신
    if (!captchaToken) {
      alert('로봇이 아님을 인증해 주세요!');
      return;
    }

    try {
      await executeRegister({
        email,
        password,
        username: username.trim(),
        battletag: battletag.trim(),
        captchaToken,
      });
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      const err = error as { code?: string; message?: string };
      console.error('회원가입 중 오류 발생:', error);
      if (err.code === 'auth/email-already-in-use') {
        setEmailError('이미 가입된 이메일입니다.');
      }
      // 💡 만약 앞선 검사를 뚫고 들어온 닉네임 중복 에러라면
      else if (err.message === 'already-in-use-username') {
        setUsernameError('이미 사용 중인 닉네임입니다 😭');
      }
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-5">
      <div className="border-border-main bg-bg-card text-text-main w-full max-w-105 rounded-2xl border p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <h1 className="mb-8 text-center text-[28px] font-extrabold tracking-tight">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <InputGroup
            label="닉네임"
            placeholder="특수문자 제외 2~12자"
            value={username}
            onChange={(val) => {
              setUsername(val);
              if (usernameError) setUsernameError('');
            }}
            error={usernameError}
          />

          <InputGroup
            label="이메일"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(val) => {
              setEmail(val);
              if (emailError) setEmailError('');
            }}
            error={emailError}
          />

          <InputGroup
            label="비밀번호"
            type="password"
            placeholder="최소 6자리 이상"
            value={password}
            onChange={(val) => {
              setPassword(val);
              if (passwordError) setPasswordError('');
            }}
            error={passwordError}
          />

          <InputGroup
            label="Battletag (선택)"
            placeholder="트레이서#1234"
            value={battletag}
            onChange={(val) => {
              setBattletag(val);
              if (battletagError) setBattletagError('');
            }}
            tip="💡 가입 후 마이페이지에서도 등록/수정할 수 있습니다."
            error={battletagError}
          />

          <div className="mt-4 mb-5 flex justify-center">
            <Turnstile
              sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onVerify={(token) => setCaptchaToken(token)}
            />
          </div>

          <button
            type="submit"
            // 중복 검사 중(isChecking)일 때도 버튼 비활성화
            disabled={isRegistering || isChecking}
            className={cn(
              'bg-primary mt-2.5 w-full rounded-lg p-3.5 text-base font-bold text-white shadow-[0_4px_12px_rgba(255,136,0,0.2)] transition-all duration-200',
              'hover:brightness-110 active:-translate-y-px',
              'disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:brightness-100 active:disabled:translate-y-0',
            )}
          >
            {isRegistering || isChecking ? '가입 처리 중...' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );
};
