import './Experience.css';

export default function Experience({ items }) {
  return (
    <section className="experience">
      <h2 className="cv-section__title">Experience</h2>
      <div className="experience__list">
        {items.map((job, i) => (
          <article key={i} className="experience__entry">
            <div className="experience__header">
              <div>
                <h3 className="experience__role">{job.role}</h3>
                <p className="experience__company">{job.company} · {job.location}</p>
              </div>
              <span className="experience__period">{job.period}</span>
            </div>
            <ul className="experience__bullets">
              {job.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
