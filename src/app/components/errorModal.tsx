import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ErrorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
};

function ErrorModal({ isOpen, onClose, errorMessage }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Error</DialogTitle>
          </div>
        </DialogHeader>
        {errorMessage}
      </DialogContent>
    </Dialog>
  );
}

export default ErrorModal;
