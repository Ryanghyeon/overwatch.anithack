/* src/pages/MyPage/hooks/useSettingsForm.ts */

import { useState } from 'react';
import { useUpdateProfileMutation, useCheckDuplicate } from '@/hooks';

// 훅에서 넘겨받을 인자들 타입 정의
interface UseSettingsFormProps {
  initialProfile: {
    username: string;
    battletag?: string | null;
  };
  onSuccess: () => void;
}

export const useSettingsForm = ({
  initialProfile,
  onSuccess,
}: UseSettingsFormProps) => {
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();
  const { validateDuplicate, isChecking } = useCheckDuplicate();

  const [username, setUsername] = useState(initialProfile.username || '');
  const [battletag, setBattletag] = useState(initialProfile.battletag || '');
  const [usernameError, setUsernameError] = useState('');
  const [battletagError, setBattletagError] = useState('');

  const isUsernameChanged = username !== initialProfile.username;
  const isBattletagChanged = battletag !== (initialProfile.battletag || '');
  const hasChanges = isUsernameChanged || isBattletagChanged;

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!hasChanges) return;

    setUsernameError('');
    setBattletagError('');
    let hasError = false;

    try {
      if (isUsernameChanged) {
        const isNameDuplicated = await validateDuplicate({
          field: 'username',
          value: username.trim(),
        });

        if (isNameDuplicated) {
          setUsernameError('이미 사용 중인 닉네임입니다 😭');
          hasError = true;
        }
      }

      if (isBattletagChanged && battletag.trim()) {
        const isTagDuplicated = await validateDuplicate({
          field: 'battletag',
          value: battletag.trim(),
        });

        if (isTagDuplicated) {
          setBattletagError('이미 연동된 배틀태그입니다 😭');
          hasError = true;
        }
      }

      if (hasError) return;

      updateProfile(
        { username: username.trim(), battletag: battletag.trim() },
        { onSuccess },
      );
    } catch (error) {
      console.error('중복 검사 중 오류 발생:', error);
      alert('서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 컴포넌트(UI)에서 쓸 수 있도록 필요한 것들만 밖으로 내보내기
  return {
    username,
    battletag,
    usernameError,
    battletagError,
    isPending,
    isChecking,
    hasChanges,
    setUsername,
    setBattletag,
    setUsernameError,
    setBattletagError,
    handleSave,
  };
};
