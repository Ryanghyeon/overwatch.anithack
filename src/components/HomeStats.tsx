import { cn } from '@/utils/cn';

// 부모(Home)가 데이터를 패칭해서 내려주도록 Props 정의
// 통계 숫자는 포맷팅(예: "1,234")되어 넘어올 수 있으므로 string도 허용
interface HomeStatsProps {
  reportCount: number | string;
  battleTagCount: number | string;
}

export const HomeStats = ({
  reportCount = 0,
  battleTagCount = 0,
}: HomeStatsProps) => {
  return (
    // HomeMenu와 통일감 있는 Grid 레이아웃 적용
    <div className="mt-8 grid grid-cols-2 gap-3">
      {/* 누적 신고 (메인 지표) */}
      <div
        className={cn(
          'flex h-24 flex-col items-center justify-center rounded-lg',
          'border-border-main bg-bg-card hover:border-primary/50 border transition-all duration-300',
        )}
      >
        <span className="text-text-muted text-[13px] font-medium">
          누적 신고
        </span>
        {/* 핵심 지표이므로 오버워치 주황색(Primary)으로 묵직하게 포인트 */}
        <span className="text-primary mt-1 text-2xl font-black">
          {reportCount}
        </span>
      </div>

      {/* 누적 배틀태그 (서브 지표) */}
      <div
        className={cn(
          'flex h-24 flex-col items-center justify-center rounded-lg',
          'border-border-main bg-bg-card hover:border-text-muted/50 border transition-all duration-300',
        )}
      >
        <span className="text-text-muted text-[13px] font-medium">
          누적 배틀태그
        </span>
        <span className="text-text-main mt-1 text-2xl font-bold">
          {battleTagCount}
        </span>
      </div>
    </div>
  );
};
