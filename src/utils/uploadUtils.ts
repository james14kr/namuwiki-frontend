import axios from "axios";
import { fileApi } from "./axios";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const uploadImage = async (
  file: File,
  folder: string = "images",
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  if (!file) throw new Error("No file provided");
  if (file.size > MAX_FILE_SIZE)
    throw new Error("파일 크기가 5MB를 초과합니다");
  if (!ALLOWED_TYPES.includes(file.type))
    throw new Error("지원하지 않는 파일 형식입니다");

  const { data } = await fileApi.post<{
    presignedUrl: string;
    publicUrl: string;
  }>(
    "/upload/presigned",
    {
      folder,
      filename: file.name,
      contentType: file.type,
      fileSize: file.size,
    },
    { signal: abortSignal }
  );

  await axios.put(data.presignedUrl, file, {
    headers: { "Content-Type": file.type },
    signal: abortSignal,
    timeout: 60000,
    onUploadProgress: (e) => {
      if (e.total) {
        onProgress?.({ progress: Math.round((e.loaded / e.total) * 100) });
      }
    },
  });

  return data.publicUrl;
};
