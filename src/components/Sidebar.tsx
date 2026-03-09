import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,
  faLocationDot,
  faEnvelope,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { CvData } from '../data/cv';
import './Sidebar.css';

interface ContactItem {
  icon: IconDefinition;
  label: string;
  href: string | null;
}

function buildContactItems(contact: CvData['contact']): ContactItem[] {
  return [
    { icon: faBriefcase, label: contact.position, href: null },
    { icon: faLocationDot, label: contact.location, href: null },
    { icon: faEnvelope, label: contact.email, href: `mailto:${contact.email}` },
    { icon: faGlobe, label: 'Website', href: contact.webpage },
    { icon: faGithub, label: 'GitHub', href: contact.github },
    { icon: faLinkedin, label: 'LinkedIn', href: contact.linkedin },
  ];
}

interface SidebarProps {
  data: CvData;
}

export default function Sidebar({ data }: SidebarProps) {
  const { photo, name, title, contact, technologies } = data;

  return (
    <aside className="sidebar">
      <div className="sidebar__photo-wrapper">
        {photo ? (
          <img src={photo} alt={name} className="sidebar__photo" />
        ) : (
          <div className="sidebar__photo sidebar__photo--placeholder">
            {name.charAt(0)}
          </div>
        )}
      </div>

      <h1 className="sidebar__name">{name}</h1>
      <p className="sidebar__title">{title}</p>

      <div className="sidebar__divider" />

      <ul className="sidebar__contact">
        {buildContactItems(contact).map(({ icon, label, href }) => (
          <li key={label} className="sidebar__contact-item">
            <FontAwesomeIcon icon={icon} className="sidebar__contact-icon" fixedWidth />
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="sidebar__contact-link">
                {label}
              </a>
            ) : (
              <span>{label}</span>
            )}
          </li>
        ))}
      </ul>

      <div className="sidebar__divider" />

      <h2 className="sidebar__section-title">Technologies</h2>
      <ul className="sidebar__tech-list">
        {technologies.map((tech) => (
          <li key={tech} className="sidebar__tech-badge">{tech}</li>
        ))}
      </ul>
    </aside>
  );
}
