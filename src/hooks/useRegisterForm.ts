/* src/hooks/useRegisterForm.ts */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation, useCheckDuplicate } from '@/hooks';
import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isValidBattletag,
} from '@/utils';

// 에러 판독기 헬퍼 함수
const validateField = (
  value: string,
  emptyMsg: string | null, // 필수가 아니면 null을 넣을 수 있게 허용
  validator: (val: string) => boolean, // 함수 자체를 인자로 타입
  invalidMsg: string,
) => {
  // 빈 값인데 필수 항목(emptyMsg가 있음)일 때
  if (emptyMsg && !value) {
    return emptyMsg;
  }

  // 값이 입력되긴 했는데 유효성 검사를 통과 못 했을 때
  if (value && !validator(value)) {
    return invalidMsg;
  }

  // 통과
  return '';
};

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { mutateAsync: executeRegister, isPending: isRegistering } =
    useRegisterMutation();
  const { validateDuplicate, isChecking } = useCheckDuplicate();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    battletag: '',
  });

  // 에러 상태 관리
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    battletag: '',
  });

  // username, email, password 한번에 처리하는 함수
  const handleChange = (field: string, value: string) => {
    // 입력값 업데이트
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 입력하는 순간 해당 필드의 에러 메시지 지워주기
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = { username: '', email: '', password: '', battletag: '' };

    // 동기적 정규식/형식 검증
    newErrors.username = validateField(
      formData.username.trim(),
      '닉네임을 입력해 주세요.',
      isValidUsername,
      '닉네임은 특수문자를 제외한 2~12자여야 합니다.',
    );
    newErrors.email = validateField(
      formData.email.trim(),
      '이메일을 입력해 주세요.',
      isValidEmail,
      '이메일 형식이 올바르지 않습니다.',
    );
    newErrors.password = validateField(
      formData.password,
      '비밀번호를 입력해 주세요.',
      isValidPassword,
      '비밀번호는 최소 6자리 이상이어야 합니다.',
    );

    // 배틀태그는 선택: 2번째 인자에 null을 넣어서 빈 값 검사 패스
    newErrors.battletag = validateField(
      formData.battletag.trim(),
      null,
      isValidBattletag,
      'Battletag 형식이 올바르지 않습니다. (예: 트레이서#1234)',
    );
    setErrors(newErrors);

    // 중복 검사 영역
    let hasError = Object.values(newErrors).some((msg) => msg !== '');
    if (hasError) return;
    try {
      // 닉네임 중복 검사
      const isNameDuplicated = await validateDuplicate({
        field: 'username',
        value: formData.username.trim(),
      });

      if (isNameDuplicated) {
        newErrors.username = '이미 누군가 사용 중인 닉네임입니다 😭';
        hasError = true;
      }

      // 배틀태그 중복 검사
      if (formData.battletag.trim()) {
        const isTagDuplicated = await validateDuplicate({
          field: 'battletag',
          value: formData.battletag.trim(),
        });

        if (isTagDuplicated) {
          newErrors.battletag = '이미 누군가 연동한 배틀태그입니다 😭';
          hasError = true;
        }
      }

      // 비동기 에러도 바구니에 담아서 상태 업데이트
      setErrors(newErrors);
      if (hasError) return;
    } catch (error) {
      console.error('중복 검사 중 오류 발생:', error);
      alert('서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 봇 검사
    if (!captchaToken) {
      alert('로봇이 아님을 인증해 주세요!');
      return;
    }

    // 최종 회원가입 진행
    try {
      await executeRegister({
        email: formData.email,
        password: formData.password,
        username: formData.username.trim(),
        battletag: formData.battletag.trim(),
        captchaToken,
      });
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      const err = error as { code?: string; message?: string };
      console.error('회원가입 중 오류 발생:', error);
      if (err.code === 'auth/email-already-in-use') {
        newErrors.email = '이미 가입된 이메일입니다.';
      }
      // 만약 앞선 검사를 뚫고 들어온 닉네임 중복 에러라면
      else if (err.message === 'already-in-use-username') {
        newErrors.username = '이미 사용 중인 닉네임입니다 😭';
      }
    }
    setErrors(newErrors);
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    captchaToken,
    setCaptchaToken,
    isRegistering,
    isChecking,
  };
};
