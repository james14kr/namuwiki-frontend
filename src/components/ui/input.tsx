import * as React from "react";

import { cn } from "@/utils/tw.utils";
export interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", icon, iconPosition = "left", ...props },
    ref
  ) => {
    const hasLeftIcon = icon && iconPosition === "left";
    const hasRightIcon = icon && iconPosition === "right";

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "peer text-primary/1300 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground read-only:bg-primary/10 focus:border-primary read-only:focus:border-none focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            hasLeftIcon && "pl-9",
            hasRightIcon && "pr-9",
            props.value && "border-primary",
            className
          )}
          ref={ref}
          {...props}
        />{icon && (
            <span
              className={cn(
                "pointer-events-none opacity-50 absolute top-1/2 -translate-y-1/2 text-muted-foreground",
                props.value && "opacity-100 text-primary",
                hasLeftIcon && "left-3",
                hasRightIcon && "right-3"
              )}
            >
              {icon}
            </span>
          )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
