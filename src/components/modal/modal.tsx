import type { ComponentPropsWithoutRef } from "react";

interface ModalProps extends ComponentPropsWithoutRef<"div"> {
  onClick: () => void; // 모달 닫기를 수행하는 함수
}

export default function Modal({ children, onClick }: ModalProps) {
  return (
    // 블러 처리된 모달의 뒷 배경
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex h-full w-full cursor-default items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      onClick={onClick}
      aria-label="모달 뒷 배경"
    >
      {/* 모달 프레임 */}
      <section
        role="dialog"
        aria-modal="true"
        className="relative overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ minWidth: "360px" }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") e.stopPropagation();
        }}
      >
        {/* 상단 그린 액센트 바 */}
        <div
          style={{
            height: "5px",
            background: "linear-gradient(90deg, #166534 0%, #4ade80 100%)",
          }}
        />

        {/* 모달 콘텐츠 영역 */}
        <div className="px-8 py-8">
          {/* 모달 닫기 버튼 */}
          <button
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-green-50 hover:text-green-700"
            onClick={onClick}
            aria-label="모달 닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* 모달 안에 들어갈 내용(프롭스로 전달 받음) */}
          {children}
        </div>
      </section>
    </div>
  );
}
