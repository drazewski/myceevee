import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TextPointItem } from '../data/cv';
import EditableText from './EditableText';
import './CustomSection.css';

interface CustomSectionProps {
  title: string;
  items: TextPointItem[];
  dark?: boolean;
  onChangeTitle: (value: string) => void;
  onAddItem: (type: 'text' | 'point') => void;
  onChangeItem: (index: number, value: string) => void;
  onRemoveItem: (index: number) => void;
  onRemove: () => void;
}

export default function CustomSection({
  title,
  items,
  dark = false,
  onChangeTitle,
  onAddItem,
  onChangeItem,
  onRemoveItem,
  onRemove,
}: CustomSectionProps) {
  const { t } = useTranslation();

  return (
    <div className={`custom-section${dark ? ' custom-section--dark' : ''}`}>
      <div className="custom-section__header">
        <h2 className={dark ? 'sidebar__section-title' : 'cv-section__title'}>
          <EditableText value={title} onChange={onChangeTitle} dark={dark} />
        </h2>
        <button
          type="button"
          className="custom-section__remove"
          title={t('actions.removeSection')}
          onClick={onRemove}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <div className="custom-section__content">
        <div className="custom-section__items">
          {items.map((item, index) => (
            <div key={item.id} className={`custom-section__item custom-section__item--${item.type}`}>
              <EditableText
                value={item.content}
                onChange={(value) => onChangeItem(index, value)}
                multiline
                dark={dark}
                onRemove={() => onRemoveItem(index)}
                placeholder={t('editable.customSectionPlaceholder')}
              />
            </div>
          ))}
        </div>
        <div className="btn-add-group">
          <button type="button" className="btn-add" onClick={() => onAddItem('text')}>
            <FontAwesomeIcon icon={faPlus} /> {t('actions.addText')}
          </button>
          <button type="button" className="btn-add" onClick={() => onAddItem('point')}>
            <FontAwesomeIcon icon={faPlus} /> {t('actions.addPoint')}
          </button>
        </div>
      </div>
    </div>
  );
}
