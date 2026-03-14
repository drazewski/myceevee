import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,
  faLocationDot,
  faEnvelope,
  faGlobe,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useCvStore } from '../store/cvStore';
import { DEFAULT_SIDEBAR_ORDER, useSettingsStore, SidebarKey } from '../store/settingsStore';
import { getCustomOrderItemId, isCustomOrderItem, resolveSectionOrder } from '../lib/sectionOrder';
import EditableText from './EditableText';
import PhotoUpload from './PhotoUpload';
import CustomSection from './CustomSection';
import './Sidebar.css';

export default function Sidebar() {
  const { t } = useTranslation();
  const {
    data: { photo, name, title, contact, technologies, sectionTitles, sidebarCustom },
    setName, setTitle, setContact, setPhoto, setSectionTitle,
    setTechnology, addTechnology, removeTechnology, reorderTechnologies,
    addCustomSection, removeCustomSection, setCustomSectionField,
    addCustomSectionItem, setCustomSectionItem, removeCustomSectionItem,
  } = useCvStore();
  const { visibility, sidebarOrder, addSidebarCustomSection, removeSidebarCustomSection } = useSettingsStore();

  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const resolvedSidebarOrder = useMemo(
    () => resolveSectionOrder(sidebarOrder, DEFAULT_SIDEBAR_ORDER, sidebarCustom.map((section) => section.id)),
    [sidebarCustom, sidebarOrder],
  );

  const sidebarCustomMap = useMemo(
    () => new Map(sidebarCustom.map((section) => [section.id, section])),
    [sidebarCustom],
  );

  const handleAddSection = () => {
    const id = addCustomSection('sidebarCustom');
    addSidebarCustomSection(id);
  };

  const handleRemoveSection = (id: string) => {
    removeCustomSection('sidebarCustom', id);
    removeSidebarCustomSection(id);
  };

  const renderBuiltInItem = (key: SidebarKey) => {
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
            <EditableText value={contact.position} onChange={(value) => setContact('position', value)} dark />
          </div>
        );
      case 'location':
        return (
          <div key="location" className="sidebar__contact-item">
            <FontAwesomeIcon icon={faLocationDot} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.location} onChange={(value) => setContact('location', value)} dark />
          </div>
        );
      case 'email':
        return (
          <div key="email" className="sidebar__contact-item">
            <FontAwesomeIcon icon={faEnvelope} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.email} onChange={(value) => setContact('email', value)} dark href={`mailto:${contact.email}`} fitLine />
          </div>
        );
      case 'webpage':
        return (
          <div key="webpage" className="sidebar__contact-item">
            <FontAwesomeIcon icon={faGlobe} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.webpage} onChange={(value) => setContact('webpage', value)} dark href={contact.webpage} hrefTarget="_blank" stripProtocol fitLine />
          </div>
        );
      case 'github':
        return (
          <div key="github" className="sidebar__contact-item">
            <FontAwesomeIcon icon={faGithub} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.github} onChange={(value) => setContact('github', value)} dark href={contact.github} hrefTarget="_blank" stripProtocol fitLine />
          </div>
        );
      case 'linkedin':
        return (
          <div key="linkedin" className="sidebar__contact-item">
            <FontAwesomeIcon icon={faLinkedin} className="sidebar__contact-icon" fixedWidth />
            <EditableText value={contact.linkedin} onChange={(value) => setContact('linkedin', value)} dark href={contact.linkedin} hrefTarget="_blank" stripProtocol fitLine />
          </div>
        );
      case 'technologies':
        return (
          <div key="technologies" className="sidebar__technologies">
            <div className="sidebar__divider" />
            <h2 className="sidebar__section-title">
              <EditableText value={sectionTitles.technologies} onChange={(value) => setSectionTitle('technologies', value)} dark />
            </h2>
            <ul className="sidebar__tech-list">
              {technologies.map((technology, index) => (
                <li
                  key={index}
                  className={[
                    'sidebar__tech-badge',
                    dragOver === index ? 'sidebar__tech-badge--drag-over' : '',
                    dragging === index ? 'sidebar__tech-badge--dragging' : '',
                  ].filter(Boolean).join(' ')}
                  draggable
                  onDragStart={() => { dragIndex.current = index; setDragging(index); }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(index); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => {
                    if (dragIndex.current !== null && dragIndex.current !== index) {
                      reorderTechnologies(dragIndex.current, index);
                    }
                    dragIndex.current = null;
                    setDragOver(null);
                    setDragging(null);
                  }}
                  onDragEnd={() => { dragIndex.current = null; setDragOver(null); setDragging(null); }}
                >
                  <EditableText value={technology} onChange={(value) => setTechnology(index, value)} dark onRemove={() => removeTechnology(index)} />
                </li>
              ))}
              <li>
                <button type="button" className="sidebar__tech-add" onClick={addTechnology}>
                  <FontAwesomeIcon icon={faPlus} /> {t('actions.add')}
                </button>
              </li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  const visibleEntries = resolvedSidebarOrder.flatMap((item) => {
    if (isCustomOrderItem(item)) {
      const section = sidebarCustomMap.get(getCustomOrderItemId(item));
      if (!section) return [];

      return [{
        key: section.id,
        kind: 'custom' as const,
        node: (
          <CustomSection
            title={section.title}
            items={section.items}
            dark
            onChangeTitle={(value) => setCustomSectionField('sidebarCustom', section.id, 'title', value)}
            onAddItem={(type) => addCustomSectionItem('sidebarCustom', section.id, type)}
            onChangeItem={(index, value) => setCustomSectionItem('sidebarCustom', section.id, index, value)}
            onRemoveItem={(index) => removeCustomSectionItem('sidebarCustom', section.id, index)}
            onRemove={() => handleRemoveSection(section.id)}
          />
        ),
      }];
    }

    const node = renderBuiltInItem(item);
    if (!node) return [];

    return [{
      key: item,
      kind: ['position', 'location', 'email', 'webpage', 'github', 'linkedin'].includes(item) ? 'contact' as const : 'regular' as const,
      node,
    }];
  });

  return (
    <aside className="sidebar">
      {visibleEntries.map((entry, index) => {
        const previous = index > 0 ? visibleEntries[index - 1] : null;
        const needsDivider = entry.kind === 'custom'
          ? index > 0
          : entry.kind === 'contact' && previous?.kind !== 'contact';

        return (
          <div key={entry.key} className={entry.kind === 'contact' ? 'sidebar__contact-item-wrapper' : undefined}>
            {needsDivider && <div className="sidebar__divider" />}
            {entry.node}
          </div>
        );
      })}

      <button
        type="button"
        className="sidebar__add-section btn-add btn-add--small"
        onClick={handleAddSection}
      >
        <FontAwesomeIcon icon={faPlus} /> {t('actions.addSection')}
      </button>
    </aside>
  );
}
