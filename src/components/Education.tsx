import { EducationEntry } from '../data/cv';
import './Education.css';

interface EducationProps {
  items: EducationEntry[];
}

export default function Education({ items }: EducationProps) {
  return (
    <section className="education">
      <h2 className="cv-section__title">Education</h2>
      <div className="education__list">
        {items.map((edu, i) => (
          <div key={i} className="education__entry">
            <div className="education__header">
              <div>
                <h3 className="education__degree">{edu.degree}</h3>
                <p className="education__institution">{edu.institution}</p>
              </div>
              <span className="education__period">{edu.period}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
