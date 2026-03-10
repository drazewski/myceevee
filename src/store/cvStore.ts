import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  cvData as defaultData,
  CvData,
  Contact,
  ExperienceEntry,
  EducationEntry,
  CourseEntry,
} from '../data/cv';

interface CvStore {
  data: CvData;

  setName: (value: string) => void;
  setTitle: (value: string) => void;
  setPhoto: (value: string | null) => void;

  setContact: (field: keyof Contact, value: string) => void;

  setAboutMeItem: (index: number, value: string) => void;
  addAboutMeItem: () => void;
  removeAboutMeItem: (index: number) => void;

  setTechnology: (index: number, value: string) => void;
  addTechnology: () => void;
  removeTechnology: (index: number) => void;

  setExperienceField: (index: number, field: keyof Omit<ExperienceEntry, 'bullets'>, value: string) => void;
  setExperienceBullet: (expIndex: number, bulletIndex: number, value: string) => void;
  addExperienceBullet: (expIndex: number) => void;
  removeExperienceBullet: (expIndex: number, bulletIndex: number) => void;
  addExperience: () => void;
  removeExperience: (index: number) => void;

  setEducationField: (index: number, field: keyof EducationEntry, value: string) => void;
  addEducation: () => void;
  removeEducation: (index: number) => void;

  setCourseField: (index: number, field: keyof CourseEntry, value: string) => void;
  addCourse: () => void;
  removeCourse: (index: number) => void;
}

const emptyExperience: ExperienceEntry = {
  company: 'Company',
  role: 'Role',
  period: 'Year – Year',
  location: 'Location',
  bullets: [''],
};

const emptyEducation: EducationEntry = {
  institution: 'Institution',
  degree: 'Degree',
  period: 'Year – Year',
};

const emptyCourse: CourseEntry = {
  name: 'Course name',
  provider: 'Provider',
  year: 'Year',
};

function updateAt<T>(arr: T[], index: number, updater: (item: T) => T): T[] {
  return arr.map((item, i) => (i === index ? updater(item) : item));
}

export const useCvStore = create<CvStore>()(
  persist(
    (set) => ({
      data: defaultData,

      setName: (value) => set((s) => ({ data: { ...s.data, name: value } })),
      setTitle: (value) => set((s) => ({ data: { ...s.data, title: value } })),
      setPhoto: (value) => set((s) => ({ data: { ...s.data, photo: value } })),

      setContact: (field, value) =>
        set((s) => ({ data: { ...s.data, contact: { ...s.data.contact, [field]: value } } })),

      setAboutMeItem: (index, value) =>
        set((s) => ({ data: { ...s.data, aboutMe: updateAt(s.data.aboutMe, index, () => value) } })),
      addAboutMeItem: () =>
        set((s) => ({ data: { ...s.data, aboutMe: [...s.data.aboutMe, ''] } })),
      removeAboutMeItem: (index) =>
        set((s) => ({ data: { ...s.data, aboutMe: s.data.aboutMe.filter((_, i) => i !== index) } })),

      setTechnology: (index, value) =>
        set((s) => ({ data: { ...s.data, technologies: updateAt(s.data.technologies, index, () => value) } })),
      addTechnology: () =>
        set((s) => ({ data: { ...s.data, technologies: [...s.data.technologies, ''] } })),
      removeTechnology: (index) =>
        set((s) => ({ data: { ...s.data, technologies: s.data.technologies.filter((_, i) => i !== index) } })),

      setExperienceField: (index, field, value) =>
        set((s) => ({ data: { ...s.data, experience: updateAt(s.data.experience, index, (e) => ({ ...e, [field]: value })) } })),
      setExperienceBullet: (expIndex, bulletIndex, value) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: updateAt(s.data.experience, expIndex, (e) => ({
              ...e,
              bullets: updateAt(e.bullets, bulletIndex, () => value),
            })),
          },
        })),
      addExperienceBullet: (expIndex) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: updateAt(s.data.experience, expIndex, (e) => ({ ...e, bullets: [...e.bullets, ''] })),
          },
        })),
      removeExperienceBullet: (expIndex, bulletIndex) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: updateAt(s.data.experience, expIndex, (e) => ({
              ...e,
              bullets: e.bullets.filter((_, j) => j !== bulletIndex),
            })),
          },
        })),
      addExperience: () =>
        set((s) => ({ data: { ...s.data, experience: [...s.data.experience, { ...emptyExperience }] } })),
      removeExperience: (index) =>
        set((s) => ({ data: { ...s.data, experience: s.data.experience.filter((_, i) => i !== index) } })),

      setEducationField: (index, field, value) =>
        set((s) => ({ data: { ...s.data, education: updateAt(s.data.education, index, (e) => ({ ...e, [field]: value })) } })),
      addEducation: () =>
        set((s) => ({ data: { ...s.data, education: [...s.data.education, { ...emptyEducation }] } })),
      removeEducation: (index) =>
        set((s) => ({ data: { ...s.data, education: s.data.education.filter((_, i) => i !== index) } })),

      setCourseField: (index, field, value) =>
        set((s) => ({ data: { ...s.data, courses: updateAt(s.data.courses, index, (c) => ({ ...c, [field]: value })) } })),
      addCourse: () =>
        set((s) => ({ data: { ...s.data, courses: [...s.data.courses, { ...emptyCourse }] } })),
      removeCourse: (index) =>
        set((s) => ({ data: { ...s.data, courses: s.data.courses.filter((_, i) => i !== index) } })),
    }),
    { name: 'cv-data' }
  )
);
