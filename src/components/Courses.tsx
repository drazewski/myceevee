import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useCvStore } from '../store/cvStore';
import EditableText from './EditableText';
import './Courses.css';

export default function Courses() {
  const { t } = useTranslation();
  const { data: { courses, sectionTitles }, setCourseField, addCourse, removeCourse, setSectionTitle } = useCvStore();

  return (
    <section className="courses">
      <h2 className="cv-section__title">
        <EditableText value={sectionTitles.courses} onChange={(value) => setSectionTitle('courses', value)} />
      </h2>
      <div className="courses__list">
        {courses.map((course, index) => (
          <div key={course.id} className={`courses__entry courses__entry--${course.type}`}>
            <div className="courses__info">
              <h3 className="courses__name">
                <EditableText value={course.name} onChange={(value) => setCourseField(index, 'name', value)} />
              </h3>
              <p className="courses__provider">
                <EditableText value={course.provider} onChange={(value) => setCourseField(index, 'provider', value)} />
              </p>
            </div>
            <div className="courses__entry-right">
              <span className="courses__year">
                <EditableText value={course.year} onChange={(value) => setCourseField(index, 'year', value)} />
              </span>
              <button type="button" className="btn-entry-remove" title={t('actions.remove')} onClick={() => removeCourse(index)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
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
