import "./i18n";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import "./index.css";
import "./reset.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/utils";
import { setupInterceptors } from "@/utils";
import { setupGridGlobalOption } from "./utils/gridUtil";

setupInterceptors();
setupGridGlobalOption();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: {
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);

window.addEventListener("load", () => {
  document.documentElement.classList.remove("preload");
});
