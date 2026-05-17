import { useEffect, useState } from 'react';
import './ErrorModal.css';

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
        <h2 className="error-modal__title">Something went wrong</h2>
        <div className="error-modal__body">
          <pre className="error-modal__message">{message}</pre>
        </div>
        {onClose && (
          <button className="error-modal__close" onClick={handleClose}>
            Close
          </button>
        )}
      </div>
    </div>
  );
}