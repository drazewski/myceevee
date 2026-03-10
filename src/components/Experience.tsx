import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useCvStore } from '../store/cvStore';
import EditableText from './EditableText';
import './Experience.css';

export default function Experience() {
  const {
    data: { experience },
    setExperienceField,
    setExperienceBullet, addExperienceBullet, removeExperienceBullet,
    addExperience, removeExperience,
  } = useCvStore();

  return (
    <section className="experience">
      <h2 className="cv-section__title">Experience</h2>
      <div className="experience__list">
        {experience.map((job, i) => (
          <article key={i} className="experience__entry">
            <div className="experience__header">
              <div className="experience__header-left">
                <h3 className="experience__role">
                  <EditableText value={job.role} onChange={(v) => setExperienceField(i, 'role', v)} />
                </h3>
                <p className="experience__company">
                  <EditableText value={job.company} onChange={(v) => setExperienceField(i, 'company', v)} />
                  {' · '}
                  <EditableText value={job.location} onChange={(v) => setExperienceField(i, 'location', v)} />
                </p>
              </div>
              <div className="experience__header-right">
                <span className="experience__period">
                  <EditableText value={job.period} onChange={(v) => setExperienceField(i, 'period', v)} />
                </span>
                <button type="button" className="btn-entry-remove" title="Remove entry" onClick={() => removeExperience(i)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            </div>

            <ul className="experience__bullets">
              {job.bullets.map((b, j) => (
                <li key={j} className="experience__bullet-item">
                  <EditableText value={b} onChange={(v) => setExperienceBullet(i, j, v)} multiline onRemove={() => removeExperienceBullet(i, j)} />
                </li>
              ))}
            </ul>
            <button type="button" className="btn-add btn-add--small" onClick={() => addExperienceBullet(i)}>
              <FontAwesomeIcon icon={faPlus} /> Add bullet
            </button>
          </article>
        ))}
      </div>
      <button type="button" className="btn-add" onClick={addExperience}>
        <FontAwesomeIcon icon={faPlus} /> Add experience
      </button>
    </section>
  );
}
