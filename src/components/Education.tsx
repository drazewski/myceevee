import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useCvStore } from '../store/cvStore';
import EditableText from './EditableText';
import './Education.css';

export default function Education() {
  const { data: { education, sectionTitles }, setEducationField, addEducation, removeEducation, setSectionTitle } = useCvStore();

  return (
    <section className="education">
      <h2 className="cv-section__title">
        <EditableText value={sectionTitles.education} onChange={(v) => setSectionTitle('education', v)} />
      </h2>
      <div className="education__list">
        {education.map((edu, i) => (
          <div key={i} className="education__entry">
            <div className="education__header">
              <div>
                <h3 className="education__degree">
                  <EditableText value={edu.degree} onChange={(v) => setEducationField(i, 'degree', v)} />
                </h3>
                <p className="education__institution">
                  <EditableText value={edu.institution} onChange={(v) => setEducationField(i, 'institution', v)} />
                </p>
              </div>
              <div className="education__header-right">
                <span className="education__period">
                  <EditableText value={edu.period} onChange={(v) => setEducationField(i, 'period', v)} />
                </span>
                <button type="button" className="btn-entry-remove" title="Remove" onClick={() => removeEducation(i)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn-add" onClick={addEducation}>
        <FontAwesomeIcon icon={faPlus} /> Add education
      </button>
    </section>
  );
}
