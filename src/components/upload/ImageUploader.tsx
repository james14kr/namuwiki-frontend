import { useEffect, useRef, useState } from "react";

interface ImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  usePreview?: boolean;
  multiple?: boolean;
}

const ImageUploader = ({
  files,
  onChange,
  multiple = true,
  usePreview = true,
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then(setPreviews);
  }, [files]);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );
    if (newFiles.length === 0) return;
    onChange(multiple ? [...files, ...newFiles] : [newFiles[0]]);
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        <p className="text-sm text-muted-foreground">
          클릭하거나 이미지를 드래그하세요{multiple ? " (여러 장 가능)" : ""}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {previews.length > 0 && usePreview && (
        <div className="flex flex-wrap gap-3">
          {previews.map((src, idx) => (
            <div key={idx} className="group relative">
              <img
                src={src}
                alt={`이미지 ${idx + 1}`}
                className="h-24 w-24 rounded-lg border object-cover"
              />
              <button
                onClick={() => removeFile(idx)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <span className="text-sm text-muted-foreground">
        {files.length > 0 ? `${files.length}장 선택됨` : "선택된 이미지 없음"}
      </span>
    </div>
  );
};

export default ImageUploader;
