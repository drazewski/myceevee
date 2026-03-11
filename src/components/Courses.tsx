import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useCvStore } from '../store/cvStore';
import EditableText from './EditableText';
import './Courses.css';

export default function Courses() {
  const { data: { courses, sectionTitles }, setCourseField, addCourse, removeCourse, setSectionTitle } = useCvStore();

  return (
    <section className="courses">
      <h2 className="cv-section__title">
        <EditableText value={sectionTitles.courses} onChange={(v) => setSectionTitle('courses', v)} />
      </h2>
      <div className="courses__list">
        {courses.map((course, i) => (
          <div key={i} className="courses__entry">
            <div className="courses__info">
              <h3 className="courses__name">
                <EditableText value={course.name} onChange={(v) => setCourseField(i, 'name', v)} />
              </h3>
              <p className="courses__provider">
                <EditableText value={course.provider} onChange={(v) => setCourseField(i, 'provider', v)} />
              </p>
            </div>
            <div className="courses__entry-right">
              <span className="courses__year">
                <EditableText value={course.year} onChange={(v) => setCourseField(i, 'year', v)} />
              </span>
              <button type="button" className="btn-entry-remove" title="Remove" onClick={() => removeCourse(i)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn-add" onClick={addCourse}>
        <FontAwesomeIcon icon={faPlus} /> Add course
      </button>
    </section>
  );
}
