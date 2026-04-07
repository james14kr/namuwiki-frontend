export const queryKeys = {
  예시: {
    입니다: ["이렇게 키 입력하세요"],
  },
  post: {
    all: ["posts"] as const,
    detail: (id: string) => ["posts", id] as const,
  },
};
