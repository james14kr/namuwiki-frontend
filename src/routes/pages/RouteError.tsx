import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RouteError() {
  const err = useRouteError();

  let title = "페이지를 불러올 수 없습니다";
  let message = "알 수 없는 오류가 발생했습니다.";

  if (isRouteErrorResponse(err)) {
    title = `${err.status} ${err.statusText}`;
    message = typeof err.data === "string" ? err.data : message;
  } else if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === "string") {
    message = err;
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{message}</p>

      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          onClick={() => window.location.reload()}
        >
          새로고침
        </button>

        <Link
          to="/"
          className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
