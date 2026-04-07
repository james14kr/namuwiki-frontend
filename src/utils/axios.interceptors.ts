import type {
  AxiosError,
  AxiosResponse,
} from "axios";
import { api } from "./axios";

interface NormalizedError {
  status: number;
  message: string;
}

const extractErrorMessage = (data: unknown): string | undefined => {
  if (typeof data !== "object" || data === null) return undefined;
  if (!("message" in data)) return undefined;
  if (typeof (data as any).message !== "string") return undefined;

  return (data as any).message;
};

export const setupInterceptors = () => {
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const message =
        extractErrorMessage(error.response?.data) ??
        error.message ??
        "Unknown error";

      const normalizedError: NormalizedError = {
        status: error.response?.status ?? 500,
        message,
      };

      return Promise.reject(normalizedError);
    },
  );
};