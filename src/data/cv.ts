export interface Contact {
  position: string;
  location: string;
  email: string;
  webpage: string;
  github: string;
  linkedin: string;
}

export type MainSectionItemType = 'text' | 'point';

export interface TextPointItem {
  id: string;
  type: MainSectionItemType;
  content: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: TextPointItem[];
}

export interface EducationEntry {
  id: string;
  type: MainSectionItemType;
  institution: string;
  degree: string;
  period: string;
}

export interface CourseEntry {
  id: string;
  type: MainSectionItemType;
  name: string;
  provider: string;
  year: string;
}

export interface SectionTitles {
  technologies: string;
  aboutMe: string;
  experience: string;
  education: string;
  courses: string;
}

export type CvLanguage = 'en' | 'pl' | 'de' | 'es' | 'fr' | 'it' | 'pt';

export const SECTION_TITLE_DEFAULTS: Record<CvLanguage, SectionTitles> = {
  en: { technologies: 'Technologies',    aboutMe: 'About Me',     experience: 'Experience',          education: 'Education',      courses: 'Courses & Certifications' },
  pl: { technologies: 'Technologie',     aboutMe: 'O mnie',       experience: 'Doświadczenie',       education: 'Wykształcenie',  courses: 'Kursy i certyfikaty'      },
  de: { technologies: 'Technologien',    aboutMe: 'Über mich',    experience: 'Berufserfahrung',     education: 'Ausbildung',     courses: 'Kurse & Zertifikate'      },
  es: { technologies: 'Tecnologías',     aboutMe: 'Sobre mí',     experience: 'Experiencia',         education: 'Educación',      courses: 'Cursos y certificaciones' },
  fr: { technologies: 'Technologies',    aboutMe: 'À propos',     experience: 'Expérience',          education: 'Formation',      courses: 'Cours et certifications'  },
  it: { technologies: 'Tecnologie',      aboutMe: 'Chi sono',     experience: 'Esperienza',          education: 'Formazione',     courses: 'Corsi e certificazioni'   },
  pt: { technologies: 'Tecnologias',     aboutMe: 'Sobre mim',    experience: 'Experiência',         education: 'Educação',       courses: 'Cursos e certificações'   },
};

export interface CustomSection {
  id: string;
  title: string;
  items: TextPointItem[];
}

export interface CvData {
  photo: string | null;
  name: string;
  title: string;
  contact: Contact;
  technologies: string[];
  sectionTitles: SectionTitles;
  aboutMe: TextPointItem[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  courses: CourseEntry[];
  sidebarCustom: CustomSection[];
  mainCustom: CustomSection[];
}

export const cvData: CvData = {
  photo: null,
  name: 'John Doe',
  title: 'Senior Software Engineer',

  contact: {
    position: 'Software Engineer at Acme Corp',
    location: 'Warsaw, Poland',
    email: 'john.doe@example.com',
    webpage: 'https://johndoe.dev',
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
  },

  technologies: [
    'JavaScript', 'TypeScript', 'React', 'Node.js',
    'Python', 'Docker', 'PostgreSQL', 'GraphQL',
  ],

  sectionTitles: {
    technologies: 'Technologies',
    aboutMe: 'About Me',
    experience: 'Experience',
    education: 'Education',
    courses: 'Courses & Certifications',
  },

  aboutMe: [
    { id: 'about-1', type: 'text', content: 'Passionate about building scalable and maintainable web applications.' },
    { id: 'about-2', type: 'text', content: '8+ years of experience across full-stack development and cloud architecture.' },
    { id: 'about-3', type: 'text', content: 'Strong communicator who thrives in cross-functional agile teams.' },
    { id: 'about-4', type: 'text', content: 'Open-source contributor and continuous learner.' },
  ],

  experience: [
    {
      id: 'experience-1',
      company: 'Acme Corp',
      role: 'Senior Software Engineer',
      period: '2021 – Present',
      location: 'Warsaw, Poland',
      bullets: [
        { id: 'experience-1-bullet-1', type: 'point', content: 'Led migration of monolithic backend to microservices, reducing deployment time by 60%.' },
        { id: 'experience-1-bullet-2', type: 'point', content: 'Architected React component library adopted across 4 product teams.' },
        { id: 'experience-1-bullet-3', type: 'point', content: 'Mentored 3 junior developers through pair programming and code reviews.' },
      ],
    },
    {
      id: 'experience-2',
      company: 'Beta Tech',
      role: 'Software Engineer',
      period: '2018 – 2021',
      location: 'Kraków, Poland',
      bullets: [
        { id: 'experience-2-bullet-1', type: 'point', content: 'Built RESTful APIs consumed by 200k+ monthly active users.' },
        { id: 'experience-2-bullet-2', type: 'point', content: 'Introduced TypeScript across the frontend codebase, cutting runtime errors by 40%.' },
      ],
    },
    {
      id: 'experience-3',
      company: 'Startup XYZ',
      role: 'Junior Developer',
      period: '2016 – 2018',
      location: 'Remote',
      bullets: [
        { id: 'experience-3-bullet-1', type: 'point', content: 'Developed features for an e-commerce platform using React and Node.js.' },
        { id: 'experience-3-bullet-2', type: 'point', content: 'Improved CI pipeline scripts, cutting build times in half.' },
      ],
    },
  ],

  education: [
    {
      id: 'education-1',
      type: 'text',
      institution: 'Warsaw University of Technology',
      degree: 'M.Sc. Computer Science',
      period: '2014 – 2016',
    },
    {
      id: 'education-2',
      type: 'text',
      institution: 'Warsaw University of Technology',
      degree: 'B.Sc. Computer Science',
      period: '2010 – 2014',
    },
  ],

  courses: [
    {
      id: 'course-1',
      type: 'text',
      name: 'AWS Certified Solutions Architect – Associate',
      provider: 'Amazon Web Services',
      year: '2023',
    },
    {
      id: 'course-2',
      type: 'text',
      name: 'Advanced React Patterns',
      provider: 'Frontend Masters',
      year: '2022',
    },
    {
      id: 'course-3',
      type: 'text',
      name: 'Docker & Kubernetes: The Practical Guide',
      provider: 'Udemy',
      year: '2021',
    },
  ],

  sidebarCustom: [],
  mainCustom: [],
};
