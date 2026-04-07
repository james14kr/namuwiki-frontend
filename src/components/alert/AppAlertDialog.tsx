import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AppAlertDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;

  title: string;
  description?: string;

  confirmText?: string;
  cancelText?: string;

  variant?: "default" | "destructive";

  onConfirm?: () => Promise<void> | void;
}

export default function AppAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  variant = "default",
  onConfirm,
}: AppAlertDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) {
      if(onOpenChange) onOpenChange(false);
      return;
    }

    try {
      setLoading(true);
      await onConfirm();
      if (onOpenChange) onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          {description && (
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={handleConfirm}
            className={
              variant === "destructive"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : ""
            }
          >
            {loading ? "처리중..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}