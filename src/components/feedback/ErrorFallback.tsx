import type { FallbackProps } from "react-error-boundary";

type ErrorFallbackProps = FallbackProps & {
  title?: string;
  showDetails?: boolean;
};

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "문제가 발생했어요",
  showDetails = true,
}: ErrorFallbackProps) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 text-lg font-semibold">{title}</div>

      <div className="text-sm text-muted-foreground">
        잠시 후 다시 시도해 주세요.
      </div>

      {showDetails && (
        <div className="mt-3 rounded bg-muted p-3 text-sm">
          <span className="font-medium">Details:</span> {message}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm"
          onClick={resetErrorBoundary}
        >
          다시 시도
        </button>

        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm"
          onClick={() => window.location.reload()}
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
