interface SpinnerProps {
  /** spinner 크기(px) */
  size?: number;
  /** 중앙에 표시할 텍스트 */
  label?: string;
  /** 화면 중앙 정렬 여부 */
  fullscreen?: boolean;
}

export default function Spinner({
  size = 32,
  label = "Loading...",
  fullscreen = false,
}: SpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className="animate-spin rounded-full border-4 border-muted border-t-foreground"
        style={{
          width: size,
          height: size,
        }}
      />
      {label && <div className="text-sm text-muted-foreground">{label}</div>}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
