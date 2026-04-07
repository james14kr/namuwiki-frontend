import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import { toast } from "sonner";

export const successToast = (message: string) => {
  toast.success(message, {
    classNames: {
      toast: "!bg-green-500 !text-white !border-green-600",
    },
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    className: "!bg-red-500 !text-white !border-red-600",
  });
};

export const infoToast = (message: string) => {
  toast.info(message, {
    className: "!bg-blue-500 !text-white !border-blue-600",
  });
};

export const defaultToast = (message: string) => {
  toast.info(message, {
    className:
      "!bg-sidebar !dark:bg-primary-foreground !text-foreground !border-border",
  });
};

interface ToastMutationOptions<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export async function toastMutation<TData, TError, TVariables, TContext>(
  mutation: UseMutateAsyncFunction<TData, TError, TVariables, TContext>,
  variables: TVariables,
  loadingMessage: string = "Loading...",
  successMessage: string | ((data: TData) => string) = "Success",
  errorMessage: string | ((error: TError) => string) = "Error",
  options?: ToastMutationOptions<TData, TError>
): Promise<{ data: TData; error: null } | { data: null; error: TError }> {
  const toastId = toast.loading(loadingMessage, {
    classNames: {
      toast:
        "!bg-sidebar !dark:bg-primary-foreground !text-foreground !border-border",
    },
  });

  try {
    const data = await mutation(variables);
    toast.success(
      typeof successMessage === "function"
        ? successMessage(data)
        : successMessage,
      {
        id: toastId,
        classNames: { toast: "!bg-green-500 !text-white !border-green-600" },
      }
    );
    options?.onSuccess?.(data);
    return { data, error: null };
  } catch (error) {
    toast.error(
      typeof errorMessage === "function"
        ? errorMessage(error as TError)
        : errorMessage,
      {
        id: toastId,
        classNames: {toast : "!bg-red-500 !text-white !border-red-600"},
      }
    );
    options?.onError?.(error as TError);
    return { data: null, error: error as TError };
  }
}
