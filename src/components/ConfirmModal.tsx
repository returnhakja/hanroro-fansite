import Modal from "react-modal";
import {
  ConfirmActions,
  ConfirmBody,
  ConfirmButton,
  ConfirmDesc,
  ConfirmTitle,
} from "./ConfirmModal.styles";

const confirmModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    position: "relative",
    inset: "auto",
    border: "none",
    borderRadius: "12px",
    padding: "16px",
    maxWidth: "90vw",
    background: "white",
  },
} as const;

type Props = {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal = ({
  isOpen,
  title = "확인",
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  loading = false,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel} style={confirmModalStyles}>
      <ConfirmBody>
        <ConfirmTitle>{title}</ConfirmTitle>
        {description && <ConfirmDesc>{description}</ConfirmDesc>}
        <ConfirmActions>
          <ConfirmButton
            type="button"
            $variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </ConfirmButton>
          <ConfirmButton
            type="button"
            $variant="primary"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "처리중..." : confirmLabel}
          </ConfirmButton>
        </ConfirmActions>
      </ConfirmBody>
    </Modal>
  );
};

