/* src/pages/Register/hooks/useRegisterForm.ts */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation, useCheckDuplicate } from '@/hooks';
import {
  checkFormatErrors,
  checkDuplicateErrors,
  type RegisterFormData,
} from './useRegisterValidation';

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { mutateAsync: executeRegister, isPending: isRegistering } =
    useRegisterMutation();
  const { validateDuplicate, isChecking } = useCheckDuplicate();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // 폼 상태 관리 (타입 지정)
  const [formData, setFormData] = useState<RegisterFormData>({
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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 관문 1: 동기적 정규식/형식 검증
    const formatResult = checkFormatErrors(formData);
    setErrors(formatResult.newErrors);
    if (formatResult.hasError) return;

    // 관문 2: 중복 검사 (비동기)
    const duplicateResult = await checkDuplicateErrors(
      formData,
      validateDuplicate,
    );
    setErrors(duplicateResult.newErrors);
    if (duplicateResult.hasError) return;

    // 관문 3: 봇 검사
    if (!captchaToken) {
      alert('로봇이 아님을 인증해 주세요!');
      return;
    }

    // 관문 4: 최종 회원가입 진행
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

      // 통과했던 에러 바구니를 복사해와서 API 에러 메시지만 추가
      const finalErrors = { ...duplicateResult.newErrors };

      if (err.code === 'auth/email-already-in-use') {
        finalErrors.email = '이미 가입된 이메일입니다.';
      } else if (err.message === 'already-in-use-username') {
        finalErrors.username = '이미 사용 중인 닉네임입니다 😭';
      }
      setErrors(finalErrors);
    }
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
