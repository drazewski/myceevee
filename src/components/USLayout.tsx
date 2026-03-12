import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faLocationDot, faGlobe, faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useCvStore } from '../store/cvStore';
import { useSettingsStore } from '../store/settingsStore';
import EditableText from './EditableText';
import CustomSection from './CustomSection';
import PhotoUpload from './PhotoUpload';
import './USLayout.css';

export default function USLayout() {
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
  } = useCvStore();
  const { visibility, mainOrder, sidebarOrder, styling } = useSettingsStore();
  const { showContactIcons } = styling;

  const ALL_CONTACT_ITEMS = {
    email:    { icon: faEnvelope,    value: contact.email,    href: `mailto:${contact.email}`,    stripProtocol: false },
    location: { icon: faLocationDot, value: contact.location,  href: undefined,                    stripProtocol: false },
    position: { icon: null,          value: contact.position,  href: undefined,                    stripProtocol: false },
    webpage:  { icon: faGlobe,       value: contact.webpage,   href: contact.webpage,              stripProtocol: true  },
    github:   { icon: faGithub,      value: contact.github,    href: contact.github,               stripProtocol: true  },
    linkedin: { icon: faLinkedin,    value: contact.linkedin,  href: contact.linkedin,             stripProtocol: true  },
  } as const;

  type ContactKey = keyof typeof ALL_CONTACT_ITEMS;
  const CONTACT_KEY_SET = new Set<string>(['email', 'location', 'position', 'webpage', 'github', 'linkedin']);

  // Ordered by sidebarOrder, filtered to visible contact keys
  const visibleContact = sidebarOrder
    .filter((k): k is ContactKey => CONTACT_KEY_SET.has(k) && visibility[k] && !!ALL_CONTACT_ITEMS[k as ContactKey]?.value)
    .map((k) => ({ key: k, ...ALL_CONTACT_ITEMS[k as ContactKey] }));

  const renderSection = (key: string) => {
    if (!visibility[key as keyof typeof visibility]) return null;

    switch (key) {
      case 'aboutMe':
        return (
          <section key="aboutMe" className="us-section">
            <h2 className="us-section__title">
              <EditableText value={sectionTitles.aboutMe} onChange={(v) => setSectionTitle('aboutMe', v)} />
            </h2>
            <ul className="us-bullets">
              {aboutMe.map((item, i) => (
                <li key={i} className="us-bullets__item">
                  <EditableText
                    value={item}
                    onChange={(v) => setAboutMeItem(i, v)}
                    onRemove={() => removeAboutMeItem(i)}
                  />
                </li>
              ))}
            </ul>
            <button type="button" className="btn-add btn-add--small" onClick={addAboutMeItem}>
              <FontAwesomeIcon icon={faPlus} /> Add point
            </button>
          </section>
        );

      case 'experience':
        return (
          <section key="experience" className="us-section">
            <h2 className="us-section__title">
              <EditableText value={sectionTitles.experience} onChange={(v) => setSectionTitle('experience', v)} />
            </h2>
            {experience.map((exp, i) => (
              <div key={i} className="us-entry">
                <div className="us-entry__header">
                  <div className="us-entry__left">
                    <span className="us-entry__role">
                      <EditableText value={exp.role} onChange={(v) => setExperienceField(i, 'role', v)} />
                    </span>
                    <span className="us-entry__company">
                      <EditableText value={exp.company} onChange={(v) => setExperienceField(i, 'company', v)} />
                    </span>
                  </div>
                  <div className="us-entry__right">
                    <span className="us-entry__period">
                      <EditableText value={exp.period} onChange={(v) => setExperienceField(i, 'period', v)} fitLine />
                    </span>
                    <span className="us-entry__location">
                      <EditableText value={exp.location} onChange={(v) => setExperienceField(i, 'location', v)} fitLine />
                    </span>
                    <button type="button" className="btn-entry-remove" onClick={() => removeExperience(i)} title="Remove">×</button>
                  </div>
                </div>
                <ul className="us-bullets">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="us-bullets__item">
                      <EditableText
                        value={b}
                        onChange={(v) => setExperienceBullet(i, j, v)}
                        onRemove={() => removeExperienceBullet(i, j)}
                      />
                    </li>
                  ))}
                </ul>
                <button type="button" className="btn-add btn-add--small" onClick={() => addExperienceBullet(i)}>
                  <FontAwesomeIcon icon={faPlus} /> Add bullet
                </button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addExperience}>
              <FontAwesomeIcon icon={faPlus} /> Add experience
            </button>
          </section>
        );

      case 'education':
        return (
          <section key="education" className="us-section">
            <h2 className="us-section__title">
              <EditableText value={sectionTitles.education} onChange={(v) => setSectionTitle('education', v)} />
            </h2>
            {education.map((ed, i) => (
              <div key={i} className="us-entry">
                <div className="us-entry__header">
                  <div className="us-entry__left">
                    <span className="us-entry__role">
                      <EditableText value={ed.degree} onChange={(v) => setEducationField(i, 'degree', v)} />
                    </span>
                    <span className="us-entry__company">
                      <EditableText value={ed.institution} onChange={(v) => setEducationField(i, 'institution', v)} />
                    </span>
                  </div>
                  <div className="us-entry__right">
                    <span className="us-entry__period">
                      <EditableText value={ed.period} onChange={(v) => setEducationField(i, 'period', v)} fitLine />
                    </span>
                    <button type="button" className="btn-entry-remove" onClick={() => removeEducation(i)} title="Remove">×</button>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addEducation}>
              <FontAwesomeIcon icon={faPlus} /> Add education
            </button>
          </section>
        );

      case 'courses':
        return (
          <section key="courses" className="us-section">
            <h2 className="us-section__title">
              <EditableText value={sectionTitles.courses} onChange={(v) => setSectionTitle('courses', v)} />
            </h2>
            {courses.map((c, i) => (
              <div key={i} className="us-entry">
                <div className="us-entry__header">
                  <div className="us-entry__left">
                    <span className="us-entry__role">
                      <EditableText value={c.name} onChange={(v) => setCourseField(i, 'name', v)} />
                    </span>
                    <span className="us-entry__company">
                      <EditableText value={c.provider} onChange={(v) => setCourseField(i, 'provider', v)} />
                    </span>
                  </div>
                  <div className="us-entry__right">
                    <span className="us-entry__period">
                      <EditableText value={c.year} onChange={(v) => setCourseField(i, 'year', v)} fitLine />
                    </span>
                    <button type="button" className="btn-entry-remove" onClick={() => removeCourse(i)} title="Remove">×</button>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addCourse}>
              <FontAwesomeIcon icon={faPlus} /> Add course
            </button>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="us-layout">
      {/* Header */}
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
            {visibleContact.map((item, i) => (
              <span key={item.key} className="us-header__contact-item">
                {i > 0 && <span className="us-header__contact-sep">·</span>}
                {showContactIcons && item.icon && <FontAwesomeIcon icon={item.icon} className="us-header__contact-icon" />}
                <EditableText
                  value={item.value}
                  onChange={(v) => setContact(item.key as Parameters<typeof setContact>[0], v)}
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

      {/* Main sections ordered by mainOrder */}
      <main className="us-main">
        {mainOrder.map((key) => renderSection(key))}

        {/* Technologies */}
        {visibility.technologies && (
          <section className="us-section">
            <h2 className="us-section__title">
              <EditableText value={sectionTitles.technologies} onChange={(v) => setSectionTitle('technologies', v)} />
            </h2>
            <div className="us-tech-list">
              {technologies.map((tech, i) => (
                <span key={i} className="us-tech-badge">
                  <EditableText value={tech} onChange={(v) => setTechnology(i, v)} onRemove={() => removeTechnology(i)} />
                </span>
              ))}
              <button type="button" className="btn-add btn-add--small" onClick={addTechnology}>
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
            </div>
          </section>
        )}

        {/* Custom sections */}
        {mainCustom.map((sec) => (
          <section key={sec.id} className="us-section">
            <CustomSection
              title={sec.title}
              content={sec.content}
              onChangeTitle={(v) => setCustomSectionField('mainCustom', sec.id, 'title', v)}
              onChangeContent={(v) => setCustomSectionField('mainCustom', sec.id, 'content', v)}
              onRemove={() => removeCustomSection('mainCustom', sec.id)}
            />
          </section>
        ))}

        <button type="button" className="btn-add" onClick={() => addCustomSection('mainCustom')}>
          <FontAwesomeIcon icon={faPlus} /> Add section
        </button>
      </main>
    </div>
  );
}
