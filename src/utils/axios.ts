import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL + "/api" || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: true,
});

export const fileApi = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL + "/api" || "http://localhost:8080/api",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// 요청 인터셉터
// 첫번째 매개변수 : 요청 시 작업할 내용
// 두번째 매개변수 : 요청 중 오류 발생 시 내용
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    console.error("axios 요청 오류 : ", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
// 첫번째 매개변수 : 응답 시 작업할 내용
// 두번째 매개변수 : 응답 중 오류 발생 시 내용
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("axios 오류 : ", error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);
