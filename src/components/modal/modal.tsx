import type { ComponentPropsWithoutRef } from "react";
import closeIcon from "@icons/close_icon.svg"; // 모달을 닫는 X 아이콘

interface ModalProps extends ComponentPropsWithoutRef<"div"> {
  onClick: () => void; // 모달 닫기를 수행하는 함수
}

export default function Modal({ children, onClick }: ModalProps) {
  return (
    // 블러 처리된 모달의 뒷 배경
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex h-full w-full cursor-default items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClick}
      aria-label="모달 뒷 배경"
    >
      {/* 모달 프레임 */}
      <section
        role="dialog"
        aria-modal="true"
        className={
          "relative rounded-xl bg-[#1b1b22] px-5 py-10 md:px-10 md:py-[60px] xl:rounded-2xl"
        }
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") e.stopPropagation();
        }}
      >
        {/* 모달 닫기 버튼(X 아이콘) */}
        <button
          className="absolute right-4 top-4 ml-auto md:right-5 md:top-5 md:w-9 xl:w-10"
          onClick={onClick}
        >
          <img
            className="md:w-9 xl:w-10"
            src={closeIcon}
            alt="닫기 아이콘"
            width={24}
            height={24}
          />
        </button>

        {/* 모달 안에 들어갈 내용(프롭스로 전달 받음) */}
        {children}
      </section>
    </div>
  );
}
