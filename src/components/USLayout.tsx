import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot, faGlobe, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useCvStore } from '../store/cvStore';
import { DEFAULT_MAIN_ORDER, DEFAULT_SIDEBAR_ORDER, useSettingsStore, MainKey, SidebarKey } from '../store/settingsStore';
import { getCustomOrderItemId, isCustomOrderItem, resolveSectionOrder } from '../lib/sectionOrder';
import EditableText from './EditableText';
import CustomSection from './CustomSection';
import PhotoUpload from './PhotoUpload';
import './USLayout.css';

export default function USLayout() {
  const { t } = useTranslation();
  const {
    data: {
      name, title, contact, photo, technologies, sectionTitles,
      aboutMe, experience, education, courses, mainCustom,
    },
    setName, setTitle, setContact, setPhoto, setSectionTitle,
    setAboutMeItem, addAboutMeItem, removeAboutMeItem,
    setTechnology, addTechnology, removeTechnology,
    setExperienceField, setExperienceBullet, addExperienceBullet,
    removeExperienceBullet, addExperience, removeExperience,
    setEducationField, addEducation, removeEducation,
    setCourseField, addCourse, removeCourse,
    addCustomSection, removeCustomSection, setCustomSectionField,
    addCustomSectionItem, setCustomSectionItem, removeCustomSectionItem,
  } = useCvStore();
  const {
    visibility,
    mainOrder,
    sidebarOrder,
    styling,
    addMainCustomSection,
    removeMainCustomSection,
  } = useSettingsStore();
  const { showContactIcons } = styling;

  const allContactItems = {
    email: { icon: faEnvelope, value: contact.email, href: `mailto:${contact.email}`, stripProtocol: false },
    location: { icon: faLocationDot, value: contact.location, href: undefined, stripProtocol: false },
    position: { icon: null, value: contact.position, href: undefined, stripProtocol: false },
    webpage: { icon: faGlobe, value: contact.webpage, href: contact.webpage, stripProtocol: true },
    github: { icon: faGithub, value: contact.github, href: contact.github, stripProtocol: true },
    linkedin: { icon: faLinkedin, value: contact.linkedin, href: contact.linkedin, stripProtocol: true },
  } as const;

  type ContactKey = keyof typeof allContactItems;
  const contactKeySet = new Set<SidebarKey>(['email', 'location', 'position', 'webpage', 'github', 'linkedin']);

  const resolvedSidebarOrder = useMemo(
    () => resolveSectionOrder(sidebarOrder, DEFAULT_SIDEBAR_ORDER, []),
    [sidebarOrder],
  );

  const resolvedMainOrder = useMemo(
    () => resolveSectionOrder(mainOrder, DEFAULT_MAIN_ORDER, mainCustom.map((section) => section.id)),
    [mainCustom, mainOrder],
  );

  const mainCustomMap = useMemo(
    () => new Map(mainCustom.map((section) => [section.id, section])),
    [mainCustom],
  );

  const visibleContact = resolvedSidebarOrder
    .filter((key): key is ContactKey => !isCustomOrderItem(key) && contactKeySet.has(key) && visibility[key] && !!allContactItems[key]?.value)
    .map((key) => ({ key, ...allContactItems[key] }));

  const handleAddSection = () => {
    const id = addCustomSection('mainCustom');
    addMainCustomSection(id);
  };

  const handleRemoveSection = (id: string) => {
    removeCustomSection('mainCustom', id);
    removeMainCustomSection(id);
  };

  const renderBuiltInSection = (key: MainKey) => {
    if (!visibility[key]) return null;

    switch (key) {
      case 'aboutMe': {
        return (
          <section key="aboutMe" className="us-section">
            <h2 className="us-section__title">
              <EditableText value={sectionTitles.aboutMe} onChange={(value) => setSectionTitle('aboutMe', value)} />
            </h2>
            <div className="us-text-list">
              {aboutMe.map((item, index) => (
                <div key={item.id} className={`us-text-item us-text-item--${item.type}`}>
                  <EditableText
                    value={item.content}
                    onChange={(value) => setAboutMeItem(index, value)}
                    onRemove={() => removeAboutMeItem(index)}
                  />
                </div>
              ))}
            </div>
            <div className="btn-add-group btn-add-group--small">
              <button type="button" className="btn-add btn-add--small" onClick={() => addAboutMeItem('text')}>
                <FontAwesomeIcon icon={faPlus} /> {t('actions.addText')}
              </button>
              <button type="button" className="btn-add btn-add--small" onClick={() => addAboutMeItem('point')}>
                <FontAwesomeIcon icon={faPlus} /> {t('actions.addPoint')}
              </button>
            </div>
          </section>
        );
      }

      case 'experience': {
        return (
          <section key="experience" className="us-section">
            <h2 className="us-section__title">
              <EditableText value={sectionTitles.experience} onChange={(value) => setSectionTitle('experience', value)} />
            </h2>
            {experience.map((entry, index) => (
              <div key={index} className="us-entry">
                <div className="us-entry__header">
                  <div className="us-entry__left">
                    <span className="us-entry__role">
                      <EditableText value={entry.role} onChange={(value) => setExperienceField(index, 'role', value)} />
                    </span>
                    <span className="us-entry__company">
                      <EditableText value={entry.company} onChange={(value) => setExperienceField(index, 'company', value)} />
                    </span>
                  </div>
                  <div className="us-entry__right">
                    <span className="us-entry__period">
                      <EditableText value={entry.period} onChange={(value) => setExperienceField(index, 'period', value)} fitLine />
                    </span>
                    <span className="us-entry__location">
                      <EditableText value={entry.location} onChange={(value) => setExperienceField(index, 'location', value)} fitLine />
                    </span>
                    <button type="button" className="btn-entry-remove" onClick={() => removeExperience(index)} title={t('actions.remove')}>×</button>
                  </div>
                </div>
                <div className="us-text-list us-text-list--compact">
                  {entry.bullets.map((bullet, bulletIndex) => (
                    <div key={bullet.id} className={`us-text-item us-text-item--${bullet.type}`}>
                      <EditableText
                        value={bullet.content}
                        onChange={(value) => setExperienceBullet(index, bulletIndex, value)}
                        onRemove={() => removeExperienceBullet(index, bulletIndex)}
                      />
                    </div>
                  ))}
                </div>
                <div className="btn-add-group btn-add-group--small">
                  <button type="button" className="btn-add btn-add--small" onClick={() => addExperienceBullet(index, 'text')}>
                    <FontAwesomeIcon icon={faPlus} /> {t('actions.addText')}
                  </button>
                  <button type="button" className="btn-add btn-add--small" onClick={() => addExperienceBullet(index, 'point')}>
                    <FontAwesomeIcon icon={faPlus} /> {t('actions.addPoint')}
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addExperience}>
              <FontAwesomeIcon icon={faPlus} /> {t('actions.addExperience')}
            </button>
          </section>
        );
      }

      case 'education': {
        return (
          <section key="education" className="us-section">
            <h2 className="us-section__title">
              <EditableText value={sectionTitles.education} onChange={(value) => setSectionTitle('education', value)} />
            </h2>
            <div className="us-entry-list">
              {education.map((entry, index) => (
                <div key={entry.id} className={`us-entry us-entry--${entry.type}`}>
                  <div className="us-entry__header">
                    <div className="us-entry__left">
                      <span className="us-entry__role">
                        <EditableText value={entry.degree} onChange={(value) => setEducationField(index, 'degree', value)} />
                      </span>
                      <span className="us-entry__company">
                        <EditableText value={entry.institution} onChange={(value) => setEducationField(index, 'institution', value)} />
                      </span>
                    </div>
                    <div className="us-entry__right">
                      <span className="us-entry__period">
                        <EditableText value={entry.period} onChange={(value) => setEducationField(index, 'period', value)} fitLine />
                      </span>
                      <button type="button" className="btn-entry-remove" onClick={() => removeEducation(index)} title={t('actions.remove')}>×</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="btn-add-group">
              <button type="button" className="btn-add" onClick={() => addEducation('text')}>
                <FontAwesomeIcon icon={faPlus} /> {t('actions.addText')}
              </button>
              <button type="button" className="btn-add" onClick={() => addEducation('point')}>
                <FontAwesomeIcon icon={faPlus} /> {t('actions.addPoint')}
              </button>
            </div>
          </section>
        );
      }

      case 'courses': {
        return (
          <section key="courses" className="us-section">
            <h2 className="us-section__title">
              <EditableText value={sectionTitles.courses} onChange={(value) => setSectionTitle('courses', value)} />
            </h2>
            <div className="us-entry-list">
              {courses.map((entry, index) => (
                <div key={entry.id} className={`us-entry us-entry--${entry.type}`}>
                  <div className="us-entry__header">
                    <div className="us-entry__left">
                      <span className="us-entry__role">
                        <EditableText value={entry.name} onChange={(value) => setCourseField(index, 'name', value)} />
                      </span>
                      <span className="us-entry__company">
                        <EditableText value={entry.provider} onChange={(value) => setCourseField(index, 'provider', value)} />
                      </span>
                    </div>
                    <div className="us-entry__right">
                      <span className="us-entry__period">
                        <EditableText value={entry.year} onChange={(value) => setCourseField(index, 'year', value)} fitLine />
                      </span>
                      <button type="button" className="btn-entry-remove" onClick={() => removeCourse(index)} title={t('actions.remove')}>×</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="btn-add-group">
              <button type="button" className="btn-add" onClick={() => addCourse('text')}>
                <FontAwesomeIcon icon={faPlus} /> {t('actions.addText')}
              </button>
              <button type="button" className="btn-add" onClick={() => addCourse('point')}>
                <FontAwesomeIcon icon={faPlus} /> {t('actions.addPoint')}
              </button>
            </div>
          </section>
        );
      }
    }
  };

  return (
    <div className="us-layout">
      <header className="us-header">
        {visibility.photo && (
          <div className="us-header__photo">
            <PhotoUpload photo={photo} name={name} onUpload={setPhoto} onRemove={() => setPhoto(null)} />
          </div>
        )}
        <h1 className="us-header__name">
          <EditableText value={name} onChange={setName} />
        </h1>
        {visibility.title && (
          <p className="us-header__title">
            <EditableText value={title} onChange={setTitle} />
          </p>
        )}
        {visibleContact.length > 0 && (
          <div className="us-header__contact">
            {visibleContact.map((item, index) => (
              <span key={item.key} className="us-header__contact-item">
                {index > 0 && <span className="us-header__contact-sep">·</span>}
                {showContactIcons && item.icon && <FontAwesomeIcon icon={item.icon} className="us-header__contact-icon" />}
                <EditableText
                  value={item.value}
                  onChange={(value) => setContact(item.key, value)}
                  href={item.href}
                  hrefTarget={item.key !== 'email' && item.key !== 'location' && item.key !== 'position' ? '_blank' : undefined}
                  stripProtocol={item.stripProtocol}
                  fitLine
                />
              </span>
            ))}
          </div>
        )}
      </header>

      <main className="us-main">
        {resolvedMainOrder.map((item) => {
          if (isCustomOrderItem(item)) {
            const section = mainCustomMap.get(getCustomOrderItemId(item));
            if (!section) return null;

            return (
              <section key={section.id} className="us-section">
                <CustomSection
                  title={section.title}
                  items={section.items}
                  onChangeTitle={(value) => setCustomSectionField('mainCustom', section.id, 'title', value)}
                  onAddItem={(type) => addCustomSectionItem('mainCustom', section.id, type)}
                  onChangeItem={(index, value) => setCustomSectionItem('mainCustom', section.id, index, value)}
                  onRemoveItem={(index) => removeCustomSectionItem('mainCustom', section.id, index)}
                  onRemove={() => handleRemoveSection(section.id)}
                />
              </section>
            );
          }

          return renderBuiltInSection(item);
        })}

        {visibility.technologies && (
          <section className="us-section">
            <h2 className="us-section__title">
              <EditableText value={sectionTitles.technologies} onChange={(value) => setSectionTitle('technologies', value)} />
            </h2>
            <div className="us-tech-list">
              {technologies.map((technology, index) => (
                <span key={index} className="us-tech-badge">
                  <EditableText value={technology} onChange={(value) => setTechnology(index, value)} onRemove={() => removeTechnology(index)} />
                </span>
              ))}
              <button type="button" className="btn-add btn-add--small" onClick={addTechnology}>
                <FontAwesomeIcon icon={faPlus} /> {t('actions.add')}
              </button>
            </div>
          </section>
        )}

        <button type="button" className="btn-add" onClick={handleAddSection}>
          <FontAwesomeIcon icon={faPlus} /> {t('actions.addSection')}
        </button>
      </main>
    </div>
  );
}
