interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner = ({
  text = '데이터를 불러오는 중...',
}: LoadingSpinnerProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {/* 
        테일윈드 변환 포인트: 
        1. animate-spin 으로 회전
        2. border-primary/20 으로 전체 링 투명도 20%
        3. border-t-primary 로 상단만 진한 오렌지색
      */}
      <div className="border-primary/20 border-t-primary mb-5 h-15 w-15 animate-spin rounded-full border-[6px]" />

      {text && (
        <h2 className="text-primary m-0 text-center text-lg font-bold">
          {text}
        </h2>
      )}
    </div>
  );
};
