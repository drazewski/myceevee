export interface Contact {
  position: string;
  location: string;
  email: string;
  webpage: string;
  github: string;
  linkedin: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
}

export interface CourseEntry {
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

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface CvData {
  photo: string | null;
  name: string;
  title: string;
  contact: Contact;
  technologies: string[];
  sectionTitles: SectionTitles;
  aboutMe: string[];
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
    'Passionate about building scalable and maintainable web applications.',
    '8+ years of experience across full-stack development and cloud architecture.',
    'Strong communicator who thrives in cross-functional agile teams.',
    'Open-source contributor and continuous learner.',
  ],

  experience: [
    {
      company: 'Acme Corp',
      role: 'Senior Software Engineer',
      period: '2021 – Present',
      location: 'Warsaw, Poland',
      bullets: [
        'Led migration of monolithic backend to microservices, reducing deployment time by 60%.',
        'Architected React component library adopted across 4 product teams.',
        'Mentored 3 junior developers through pair programming and code reviews.',
      ],
    },
    {
      company: 'Beta Tech',
      role: 'Software Engineer',
      period: '2018 – 2021',
      location: 'Kraków, Poland',
      bullets: [
        'Built RESTful APIs consumed by 200k+ monthly active users.',
        'Introduced TypeScript across the frontend codebase, cutting runtime errors by 40%.',
      ],
    },
    {
      company: 'Startup XYZ',
      role: 'Junior Developer',
      period: '2016 – 2018',
      location: 'Remote',
      bullets: [
        'Developed features for an e-commerce platform using React and Node.js.',
        'Improved CI pipeline scripts, cutting build times in half.',
      ],
    },
  ],

  education: [
    {
      institution: 'Warsaw University of Technology',
      degree: 'M.Sc. Computer Science',
      period: '2014 – 2016',
    },
    {
      institution: 'Warsaw University of Technology',
      degree: 'B.Sc. Computer Science',
      period: '2010 – 2014',
    },
  ],

  courses: [
    {
      name: 'AWS Certified Solutions Architect – Associate',
      provider: 'Amazon Web Services',
      year: '2023',
    },
    {
      name: 'Advanced React Patterns',
      provider: 'Frontend Masters',
      year: '2022',
    },
    {
      name: 'Docker & Kubernetes: The Practical Guide',
      provider: 'Udemy',
      year: '2021',
    },
  ],

  sidebarCustom: [],
  mainCustom: [],
};
