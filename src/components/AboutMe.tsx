import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCvStore } from '../store/cvStore';
import EditableText from './EditableText';
import './AboutMe.css';

export default function AboutMe() {
  const { data: { aboutMe, sectionTitles }, setAboutMeItem, addAboutMeItem, removeAboutMeItem, setSectionTitle } = useCvStore();

  return (
    <section className="about-me">
      <h2 className="cv-section__title">
        <EditableText value={sectionTitles.aboutMe} onChange={(v) => setSectionTitle('aboutMe', v)} />
      </h2>
      <div className="about-me__list">
        {aboutMe.map((point, i) => (
          <div key={i} className="about-me__item">
            <EditableText value={point} onChange={(v) => setAboutMeItem(i, v)} multiline onRemove={() => removeAboutMeItem(i)} />
          </div>
        ))}
      </div>
      <button type="button" className="btn-add" onClick={addAboutMeItem}>
        <FontAwesomeIcon icon={faPlus} /> Add point
      </button>
    </section>
  );
}
