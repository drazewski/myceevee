import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './ResetModal.css';

interface Props {
  onResetLayout: () => void;
  onResetData: () => void;
  onResetAll: () => void;
  onClose: () => void;
}

export default function ResetModal({ onResetLayout, onResetData, onResetAll, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="reset-overlay" onMouseDown={onClose}>
      <div className="reset-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="reset-modal__close" onClick={onClose} title="Close">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="reset-modal__title">Reset</h2>
        <p className="reset-modal__subtitle">Choose what you want to reset. This cannot be undone.</p>

        <div className="reset-modal__options">
          <div className="reset-modal__option">
            <div className="reset-modal__option-text">
              <strong>Layout &amp; styling</strong>
              <span>Restore colors, fonts, sizes, element order and visibility to defaults. Your CV content is kept.</span>
            </div>
            <button className="reset-modal__btn reset-modal__btn--warn" onClick={onResetLayout}>
              Reset layout
            </button>
          </div>

          <div className="reset-modal__option">
            <div className="reset-modal__option-text">
              <strong>CV data</strong>
              <span>Replace all CV content (name, experience, education…) with placeholder data. Layout settings are kept.</span>
            </div>
            <button className="reset-modal__btn reset-modal__btn--warn" onClick={onResetData}>
              Reset data
            </button>
          </div>

          <div className="reset-modal__option reset-modal__option--danger">
            <div className="reset-modal__option-text">
              <strong>Everything</strong>
              <span>Full reset — both layout and CV content are restored to their original defaults.</span>
            </div>
            <button className="reset-modal__btn reset-modal__btn--danger" onClick={onResetAll}>
              Reset all
            </button>
          </div>
        </div>

        <button className="reset-modal__cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
