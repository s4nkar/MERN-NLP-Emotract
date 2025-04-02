import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ModelTypeProps } from "@/types";

type TAlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type?: ModelTypeProps) => void;
  loading: boolean;
  title?: string;
  description?: string;
  type?: ModelTypeProps;
};

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = "Are you sure?",
  description = "Are you sure you want to continue?",
  type,
}: TAlertModalProps) => {
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="destructive"
          className={type === "unblock" ? "bg-green-600 hover:bg-green-800" : ""}
          onClick={() => onConfirm(type)}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};