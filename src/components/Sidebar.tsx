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
import { useSettingsStore, SidebarKey } from '../store/settingsStore';
import EditableText from './EditableText';
import PhotoUpload from './PhotoUpload';
import CustomSection from './CustomSection';
import './Sidebar.css';

export default function Sidebar() {
  const {
    data: { photo, name, title, contact, technologies, sectionTitles, sidebarCustom },
    setName, setTitle, setContact, setPhoto, setSectionTitle,
    setTechnology, addTechnology, removeTechnology, reorderTechnologies,
    addCustomSection, removeCustomSection, setCustomSectionField,
  } = useCvStore();
  const { visibility, sidebarOrder } = useSettingsStore();

  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const renderItem = (key: SidebarKey) => {
    if (!visibility[key]) return null;

    switch (key) {
      case 'photo':
        return (
          <div key="photo" className="sidebar__photo-wrapper">
            <PhotoUpload photo={photo} name={name} onUpload={setPhoto} onRemove={() => setPhoto(null)} />
          </div>
        );
      case 'name':
        return (
          <h1 key="name" className="sidebar__name">
            <EditableText value={name} onChange={setName} dark />
          </h1>
        );
      case 'title':
        return (
          <p key="title" className="sidebar__title">
            <EditableText value={title} onChange={setTitle} dark />
          </p>
        );
      case 'position':
        return (
          <div key="position" className="sidebar__contact-item">
            <FontAwesomeIcon icon={faBriefcase} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.position} onChange={(v) => setContact('position', v)} dark />
          </div>
        );
      case 'location':
        return (
          <div key="location" className="sidebar__contact-item">
            <FontAwesomeIcon icon={faLocationDot} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.location} onChange={(v) => setContact('location', v)} dark />
          </div>
        );
      case 'email':
        return (
          <div key="email" className="sidebar__contact-item">
            <FontAwesomeIcon icon={faEnvelope} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.email} onChange={(v) => setContact('email', v)} dark href={`mailto:${contact.email}`} fitLine />
          </div>
        );
      case 'webpage':
        return (
          <div key="webpage" className="sidebar__contact-item">
            <FontAwesomeIcon icon={faGlobe} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.webpage} onChange={(v) => setContact('webpage', v)} dark href={contact.webpage} hrefTarget="_blank" stripProtocol fitLine />
          </div>
        );
      case 'github':
        return (
          <div key="github" className="sidebar__contact-item">
            <FontAwesomeIcon icon={faGithub} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.github} onChange={(v) => setContact('github', v)} dark href={contact.github} hrefTarget="_blank" stripProtocol fitLine />
          </div>
        );
      case 'linkedin':
        return (
          <div key="linkedin" className="sidebar__contact-item">
            <FontAwesomeIcon icon={faLinkedin} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.linkedin} onChange={(v) => setContact('linkedin', v)} dark href={contact.linkedin} hrefTarget="_blank" stripProtocol fitLine />
          </div>
        );
      case 'technologies':
        return (
          <div key="technologies" className="sidebar__technologies">
            <div className="sidebar__divider" />
            <h2 className="sidebar__section-title">
              <EditableText value={sectionTitles.technologies} onChange={(v) => setSectionTitle('technologies', v)} dark />
            </h2>
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="sidebar">
      {(() => {
        const CONTACT_KEYS = ['position', 'location', 'email', 'webpage', 'github', 'linkedin'];
        const visibleItems = sidebarOrder
          .map((key) => ({ key, item: renderItem(key) }))
          .filter(({ item }) => item !== null);

        return visibleItems.map(({ key, item }, idx) => {
          const isContact = CONTACT_KEYS.includes(key);
          const prevKey = idx > 0 ? visibleItems[idx - 1].key : null;
          const prevIsContact = prevKey ? CONTACT_KEYS.includes(prevKey) : false;
          const needsDivider = isContact && !prevIsContact && idx > 0;

          return (
            <div key={key} className={isContact ? 'sidebar__contact-item-wrapper' : undefined}>
              {needsDivider && <div className="sidebar__divider" />}
              {item}
            </div>
          );
        });
      })()}

      {sidebarCustom.map((sec) => (
        <div key={sec.id}>
          <div className="sidebar__divider" />
          <CustomSection
            title={sec.title}
            content={sec.content}
            dark
            onChangeTitle={(v) => setCustomSectionField('sidebarCustom', sec.id, 'title', v)}
            onChangeContent={(v) => setCustomSectionField('sidebarCustom', sec.id, 'content', v)}
            onRemove={() => removeCustomSection('sidebarCustom', sec.id)}
          />
        </div>
      ))}

      <button
        type="button"
        className="sidebar__add-section btn-add btn-add--small"
        onClick={() => addCustomSection('sidebarCustom')}
      >
        <FontAwesomeIcon icon={faPlus} /> Add section
      </button>
    </aside>
  );
}

