import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,
  faLocationDot,
  faEnvelope,
  faGlobe,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useRef, useState } from 'react';
import { useCvStore } from '../store/cvStore';
import { useSettingsStore } from '../store/settingsStore';
import EditableText from './EditableText';
import PhotoUpload from './PhotoUpload';
import './Sidebar.css';

export default function Sidebar() {
  const {
    data: { photo, name, title, contact, technologies },
    setName, setTitle, setContact, setPhoto,
    setTechnology, addTechnology, removeTechnology, reorderTechnologies,
  } = useCvStore();
  const { visibility } = useSettingsStore();

  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  return (
    <aside className="sidebar">
      {visibility.photo && (
        <div className="sidebar__photo-wrapper">
          <PhotoUpload photo={photo} name={name} onUpload={setPhoto} onRemove={() => setPhoto(null)} />
        </div>
      )}

      <h1 className="sidebar__name">
        <EditableText value={name} onChange={setName} dark />
      </h1>
      <p className="sidebar__title">
        <EditableText value={title} onChange={setTitle} dark />
      </p>

      <div className="sidebar__divider" />

      <ul className="sidebar__contact">
        {visibility.position && (
          <li className="sidebar__contact-item">
            <FontAwesomeIcon icon={faBriefcase} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.position} onChange={(v) => setContact('position', v)} dark />
          </li>
        )}
        {visibility.location && (
          <li className="sidebar__contact-item">
            <FontAwesomeIcon icon={faLocationDot} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.location} onChange={(v) => setContact('location', v)} dark />
          </li>
        )}
        {visibility.email && (
          <li className="sidebar__contact-item">
            <FontAwesomeIcon icon={faEnvelope} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.email} onChange={(v) => setContact('email', v)} dark href={`mailto:${contact.email}`} fitLine />
          </li>
        )}
        {visibility.webpage && (
          <li className="sidebar__contact-item">
            <FontAwesomeIcon icon={faGlobe} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.webpage} onChange={(v) => setContact('webpage', v)} dark href={contact.webpage} hrefTarget="_blank" stripProtocol fitLine />
          </li>
        )}
        {visibility.github && (
          <li className="sidebar__contact-item">
            <FontAwesomeIcon icon={faGithub} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.github} onChange={(v) => setContact('github', v)} dark href={contact.github} hrefTarget="_blank" stripProtocol fitLine />
          </li>
        )}
        {visibility.linkedin && (
          <li className="sidebar__contact-item">
            <FontAwesomeIcon icon={faLinkedin} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.linkedin} onChange={(v) => setContact('linkedin', v)} dark href={contact.linkedin} hrefTarget="_blank" stripProtocol fitLine />
          </li>
        )}
      </ul>

      {visibility.technologies && (
        <>
          <div className="sidebar__divider" />
          <h2 className="sidebar__section-title">Technologies</h2>
          <ul className="sidebar__tech-list">
            {technologies.map((tech, i) => (
              <li
                key={i}
                className={[
                  'sidebar__tech-badge',
                  dragOver === i ? 'sidebar__tech-badge--drag-over' : '',
                  dragging === i ? 'sidebar__tech-badge--dragging' : '',
                ].filter(Boolean).join(' ')}
                draggable
                onDragStart={() => { dragIndex.current = i; setDragging(i); }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => {
                  if (dragIndex.current !== null && dragIndex.current !== i) {
                    reorderTechnologies(dragIndex.current, i);
                  }
                  dragIndex.current = null;
                  setDragOver(null);
                  setDragging(null);
                }}
                onDragEnd={() => { dragIndex.current = null; setDragOver(null); setDragging(null); }}
              >
                <EditableText value={tech} onChange={(v) => setTechnology(i, v)} dark onRemove={() => removeTechnology(i)} />
              </li>
            ))}
            <li>
              <button type="button" className="sidebar__tech-add" onClick={addTechnology}>
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
            </li>
          </ul>
        </>
      )}
    </aside>
  );
}
