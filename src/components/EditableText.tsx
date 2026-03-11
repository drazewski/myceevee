import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useFitText } from '../hooks/useFitText';
import './EditableText.css';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  dark?: boolean;
  href?: string;
  hrefTarget?: '_blank' | '_self';
  stripProtocol?: boolean;
  fitLine?: boolean;
  onRemove?: () => void;
}

export default function EditableText({
  value,
  onChange,
  placeholder = 'Edit...',
  multiline = false,
  dark = false,
  href,
  hrefTarget,
  stripProtocol = false,
  fitLine = false,
  onRemove,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const displayValue = stripProtocol ? value.replace(/^https?:\/\//, '') : value;
  const { ref: fitRef, fontSize: fitFontSize } = useFitText(displayValue, fitLine && !editing);

  useEffect(() => { setDraft(value); }, [value]);

  useEffect(() => {
    if (!editing) return;
    const el = multiline ? textareaRef.current : inputRef.current;
    if (el) {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }
  }, [editing, multiline]);

  const confirm = () => {
    const trimmed = draft.trim();
    if (trimmed) onChange(trimmed);
    setEditing(false);
  };

  const cancel = () => setEditing(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) { e.preventDefault(); confirm(); }
    if (e.key === 'Escape') cancel();
  };

  const inputCls = `editable-text__input${multiline ? ' editable-text__input--multiline' : ''}${dark ? ' editable-text__input--dark' : ''}`;

  if (editing) {
    return multiline ? (
      <textarea
        ref={textareaRef}
        className={inputCls}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={confirm}
        placeholder={placeholder}
        rows={2}
      />
    ) : (
      <input
        ref={inputRef}
        type="text"
        className={inputCls}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={confirm}
        placeholder={placeholder}
      />
    );
  }

  const valueContent = displayValue || <em className="editable-text__empty">{placeholder}</em>;

  const wrapperCls = [
    'editable-text',
    dark ? 'editable-text--dark' : '',
    fitLine ? 'editable-text--fit-line' : '',
  ].filter(Boolean).join(' ');

  const enterEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraft(value);
    setEditing(true);
  };

  return (
    <span ref={fitLine ? fitRef : undefined} className={wrapperCls} style={fitLine && fitFontSize ? { fontSize: fitFontSize } : undefined}>
      {href ? (
        <a
          href={href}
          target={hrefTarget}
          rel={hrefTarget === '_blank' ? 'noopener noreferrer' : undefined}
          className="editable-text__link"
          onClick={enterEdit}
        >
          <span className="editable-text__value">{valueContent}</span>
        </a>
      ) : (
        <span className="editable-text__value" onClick={enterEdit}>{valueContent}</span>
      )}
      {onRemove && (
        <span className="editable-text__actions">
          <button
            type="button"
            className="editable-text__btn editable-text__btn--remove"
            title="Remove"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </span>
      )}
    </span>
  );
}
