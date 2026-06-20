import { useEffect, useState } from "react";
import "./ErrorModal.css";

interface ErrorModalProps {
  message: string;
  onClose?: () => void;
}

export function ErrorModal({ message, onClose }: ErrorModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation on next frame
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 250);
  };

  return (
    <div
      className="error-modal-overlay"
      data-visible={visible}
      onClick={handleClose}
    >
      <div className="error-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="error-modal-title">Something went wrong</h2>
        <div className="error-modal-body">
          <pre className="error-modal-message">{message}</pre>
        </div>
        {onClose && (
          <button className="error-modal-close" onClick={handleClose}>
            Close
          </button>
        )}
      </div>
    </div>
  );
}
