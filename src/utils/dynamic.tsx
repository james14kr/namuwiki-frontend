import React, { lazy, Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import ErrorFallback from "@/components/feedback/ErrorFallback";
import Spinner from "@/components/feedback/Spinner";

interface DynamicOptions {
  error?: (props: FallbackProps) => React.ReactNode;
  loading?: React.ReactNode;
}

export function dynamic<P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  options: DynamicOptions = {}
) {
  const LazyComponent = lazy(importFn);

  function DynamicComponent(props: P) {
    return (
      <ErrorBoundary
        fallbackRender={options.error ?? ((p) => <ErrorFallback {...p} />)}
      >
        <Suspense
          fallback={
            options.loading ?? (
              <Spinner fullscreen label="페이지를 불러오는 중..." />
            )
          }
        >
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return DynamicComponent;
}
