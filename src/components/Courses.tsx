import { CourseEntry } from '../data/cv';
import './Courses.css';

interface CoursesProps {
  items: CourseEntry[];
}

export default function Courses({ items }: CoursesProps) {
  return (
    <section className="courses">
      <h2 className="cv-section__title">Courses &amp; Certifications</h2>
      <div className="courses__list">
        {items.map((course, i) => (
          <div key={i} className="courses__entry">
            <div className="courses__info">
              <h3 className="courses__name">{course.name}</h3>
              <p className="courses__provider">{course.provider}</p>
            </div>
            <span className="courses__year">{course.year}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
