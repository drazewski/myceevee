import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useCvStore } from '../store/cvStore';
import EditableText from './EditableText';
import './Experience.css';

export default function Experience() {
  const { t } = useTranslation();
  const {
    data: { experience, sectionTitles },
    setExperienceField, setSectionTitle,
    setExperienceBullet, addExperienceBullet, removeExperienceBullet,
    addExperience, removeExperience,
  } = useCvStore();

  return (
    <section className="experience">
      <h2 className="cv-section__title">
        <EditableText value={sectionTitles.experience} onChange={(value) => setSectionTitle('experience', value)} />
      </h2>
      <div className="experience__list">
        {experience.map((job, index) => (
          <article key={index} className="experience__entry">
            <div className="experience__header">
              <div className="experience__header-left">
                <h3 className="experience__role">
                  <EditableText value={job.role} onChange={(value) => setExperienceField(index, 'role', value)} />
                </h3>
                <p className="experience__company">
                  <EditableText value={job.company} onChange={(value) => setExperienceField(index, 'company', value)} />
                  {' · '}
                  <EditableText value={job.location} onChange={(value) => setExperienceField(index, 'location', value)} />
                </p>
              </div>
              <div className="experience__header-right">
                <span className="experience__period">
                  <EditableText value={job.period} onChange={(value) => setExperienceField(index, 'period', value)} />
                </span>
                <button type="button" className="btn-entry-remove" title={t('actions.removeEntry')} onClick={() => removeExperience(index)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            </div>

            <div className="experience__bullets">
              {job.bullets.map((bullet, bulletIndex) => (
                <div key={bullet.id} className={`experience__bullet-item experience__bullet-item--${bullet.type}`}>
                  <EditableText value={bullet.content} onChange={(value) => setExperienceBullet(index, bulletIndex, value)} multiline onRemove={() => removeExperienceBullet(index, bulletIndex)} />
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
          </article>
        ))}
      </div>
      <button type="button" className="btn-add" onClick={addExperience}>
        <FontAwesomeIcon icon={faPlus} /> {t('actions.addExperience')}
      </button>
    </section>
  );
}
