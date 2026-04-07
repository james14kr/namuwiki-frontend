export interface PostRequest {
  title: string;
  content: string;
}

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
