import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faXmark } from '@fortawesome/free-solid-svg-icons';
import './PhotoUpload.css';

interface PhotoUploadProps {
  photo: string | null;
  name: string;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
}

export default function PhotoUpload({ photo, name, onUpload, onRemove }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="photo-upload">
      <button
        type="button"
        className="photo-upload__trigger"
        title={photo ? 'Change photo' : 'Upload photo'}
        onClick={() => inputRef.current?.click()}
      >
        {photo ? (
          <img src={photo} alt={name} className="photo-upload__img" />
        ) : (
          <div className="photo-upload__placeholder">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="photo-upload__overlay">
          <FontAwesomeIcon icon={faCamera} className="photo-upload__overlay-icon" />
        </span>
      </button>

      {photo && (
        <button
          type="button"
          className="photo-upload__remove"
          title="Remove photo"
          onClick={onRemove}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="photo-upload__input"
        onChange={handleFileChange}
      />
    </div>
  );
}
