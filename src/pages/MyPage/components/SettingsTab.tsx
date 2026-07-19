/* src/pages/MyPage/components/SettingsTab.tsx */

import { useState } from 'react';
import { cn } from '@/utils';
import { useUser, useUpdateProfileMutation, useCheckDuplicate } from '@/hooks';

export const SettingsTab = ({
  onNavigateDashboard,
}: {
  onNavigateDashboard: () => void;
}) => {
  const { data: profile, isLoading } = useUser();

  if (isLoading || !profile) {
    return (
      <div className="text-text-muted py-20 text-center">
        설정 정보를 불러오는 중...
      </div>
    );
  }

  // 데이터가 모두 준비되었을 때만 하위 폼 컴포넌트를 렌더링하고 데이터를 넘깁니다.
  return (
    <SettingsForm
      initialProfile={profile}
      onNavigateDashboard={onNavigateDashboard}
    />
  );
};

// 설정 폼 알맹이 (상태 관리 담당)
interface SettingsFormProps {
  initialProfile: {
    username: string;
    battletag?: string | null;
  };
  onNavigateDashboard: () => void;
}

const SettingsForm = ({
  initialProfile,
  onNavigateDashboard,
}: SettingsFormProps) => {
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();
  const { validateDuplicate, isChecking } = useCheckDuplicate();

  const [username, setUsername] = useState(initialProfile.username || '');
  const [battletag, setBattletag] = useState(initialProfile.battletag || '');

  const [usernameError, setUsernameError] = useState('');
  const [battletagError, setBattletagError] = useState('');

  // 변경 사항이 있는지 체크하는 변수
  const isUsernameChanged = username !== initialProfile.username;
  const isBattletagChanged = battletag !== (initialProfile.battletag || '');
  const hasChanges = isUsernameChanged || isBattletagChanged;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // 변경 사항이 없으면 아예 실행 차단
    if (!hasChanges) return;

    setUsernameError('');
    setBattletagError('');
    let hasError = false;

    // 통신 중 에러로 인해 함수가 멈추는 것을 방지하기 위해 try-catch 추가
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

      // 중복 에러가 하나라도 잡혔다면 업데이트 중단 (UI에 에러 메시지 렌더링됨)
      if (hasError) return;

      // 검사 무사 통과 시 업데이트 실행
      updateProfile(
        { username: username.trim(), battletag: battletag.trim() },
        {
          onSuccess: () => {
            onNavigateDashboard();
          },
        },
      );
    } catch (error) {
      console.error('중복 검사 중 오류 발생:', error);
      alert('서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };
  return (
    <form
      onSubmit={handleSave}
      className="mx-auto flex max-w-112.5 flex-col gap-5"
    >
      <div>
        <label className="text-text-muted mb-2 block text-sm font-bold">
          유저네임
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (usernameError) setUsernameError('');
          }}
          className={cn(
            'bg-bg-input text-text-main w-full rounded-lg border p-4 transition-colors outline-none',
            usernameError
              ? 'border-red-500 focus:border-red-500'
              : 'border-border-main focus:border-primary',
          )}
        />
        {usernameError && (
          <p className="mt-2 text-xs font-bold text-red-500">
            {' '}
            {usernameError}
          </p>
        )}
      </div>

      <div>
        <label className="text-text-muted mb-2 block text-sm font-bold">
          오버워치 배틀태그
        </label>
        <input
          type="text"
          value={battletag}
          onChange={(e) => {
            setBattletag(e.target.value);
            if (battletagError) setBattletagError('');
          }}
          placeholder="예) Justice#1234"
          className={cn(
            'bg-bg-input text-text-main w-full rounded-lg border p-4 transition-colors outline-none',
            battletagError
              ? 'border-red-500 focus:border-red-500'
              : 'border-border-main focus:border-primary',
          )}
        />
        {battletagError && (
          <p className="mt-2 text-xs font-bold text-red-500">
            {' '}
            {battletagError}
          </p>
        )}
      </div>

      <button
        type="submit"
        // 변경사항이 없으면(!hasChanges) 버튼 비활성화
        disabled={!hasChanges || isPending || isChecking}
        className="bg-primary mt-4 rounded-lg py-4 font-bold text-white transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-50"
      >
        {isPending || isChecking ? '저장 중...' : '변경사항 저장'}
      </button>
    </form>
  );
};
