import './AboutMe.css';

interface AboutMeProps {
  items: string[];
}

export default function AboutMe({ items }: AboutMeProps) {
  return (
    <section className="about-me">
      <h2 className="cv-section__title">About Me</h2>
      <ul className="about-me__list">
        {items.map((point, i) => (
          <li key={i} className="about-me__item">{point}</li>
        ))}
      </ul>
    </section>
  );
}
