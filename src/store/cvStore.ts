import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  cvData as defaultData,
  CvData,
  CvLanguage,
  Contact,
  SectionTitles,
  SECTION_TITLE_DEFAULTS,
  CustomSection,
  ExperienceEntry,
  EducationEntry,
  CourseEntry,
  MainSectionItemType,
  TextPointItem,
} from '../data/cv';

interface CvStore {
  data: CvData;
  cvLanguage: CvLanguage;

  setName: (value: string) => void;
  setTitle: (value: string) => void;
  setPhoto: (value: string | null) => void;

  setContact: (field: keyof Contact, value: string) => void;

  setSectionTitle: (section: keyof SectionTitles, value: string) => void;
  setCvLanguage: (lang: CvLanguage) => void;

  setAboutMeItem: (index: number, value: string) => void;
  addAboutMeItem: (type: MainSectionItemType) => void;
  removeAboutMeItem: (index: number) => void;

  setTechnology: (index: number, value: string) => void;
  addTechnology: () => void;
  removeTechnology: (index: number) => void;
  reorderTechnologies: (from: number, to: number) => void;

  setExperienceField: (index: number, field: keyof Omit<ExperienceEntry, 'id' | 'bullets'>, value: string) => void;
  setExperienceBullet: (expIndex: number, bulletIndex: number, value: string) => void;
  addExperienceBullet: (expIndex: number, type: MainSectionItemType) => void;
  removeExperienceBullet: (expIndex: number, bulletIndex: number) => void;
  addExperience: () => void;
  removeExperience: (index: number) => void;

  setEducationField: (index: number, field: keyof Omit<EducationEntry, 'id' | 'type'>, value: string) => void;
  addEducation: (type: MainSectionItemType) => void;
  removeEducation: (index: number) => void;

  setCourseField: (index: number, field: keyof Omit<CourseEntry, 'id' | 'type'>, value: string) => void;
  addCourse: (type: MainSectionItemType) => void;
  removeCourse: (index: number) => void;

  addCustomSection: (area: 'sidebarCustom' | 'mainCustom') => string;
  removeCustomSection: (area: 'sidebarCustom' | 'mainCustom', id: string) => void;
  setCustomSectionField: (area: 'sidebarCustom' | 'mainCustom', id: string, field: 'title', value: string) => void;
  addCustomSectionItem: (area: 'sidebarCustom' | 'mainCustom', id: string, type: MainSectionItemType) => void;
  setCustomSectionItem: (area: 'sidebarCustom' | 'mainCustom', id: string, itemIndex: number, value: string) => void;
  removeCustomSectionItem: (area: 'sidebarCustom' | 'mainCustom', id: string, itemIndex: number) => void;

  resetData: () => void;
}

function createTextPointItem(type: MainSectionItemType): TextPointItem {
  return {
    id: crypto.randomUUID(),
    type,
    content: '',
  };
}

function createExperienceEntry(): ExperienceEntry {
  return {
    id: crypto.randomUUID(),
    company: 'Company',
    role: 'Role',
    period: 'Year – Year',
    location: 'Location',
    bullets: [createTextPointItem('point')],
  };
}

function createEducationEntry(type: MainSectionItemType): EducationEntry {
  return {
    id: crypto.randomUUID(),
    type,
    institution: 'Institution',
    degree: 'Degree',
    period: 'Year – Year',
  };
}

function createCourseEntry(type: MainSectionItemType): CourseEntry {
  return {
    id: crypto.randomUUID(),
    type,
    name: 'Course name',
    provider: 'Provider',
    year: 'Year',
  };
}

function updateAt<T>(arr: T[], index: number, updater: (item: T) => T): T[] {
  return arr.map((item, i) => (i === index ? updater(item) : item));
}

export const useCvStore = create<CvStore>()(
  persist(
    (set) => ({
      data: defaultData,
      cvLanguage: 'en' as CvLanguage,

      setName: (value) => set((s) => ({ data: { ...s.data, name: value } })),
      setTitle: (value) => set((s) => ({ data: { ...s.data, title: value } })),
      setPhoto: (value) => set((s) => ({ data: { ...s.data, photo: value } })),

      setContact: (field, value) =>
        set((s) => ({ data: { ...s.data, contact: { ...s.data.contact, [field]: value } } })),

      setSectionTitle: (section, value) =>
        set((s) => ({ data: { ...s.data, sectionTitles: { ...s.data.sectionTitles, [section]: value } } })),

      setCvLanguage: (lang) =>
        set((s) => ({
          cvLanguage: lang,
          data: { ...s.data, sectionTitles: SECTION_TITLE_DEFAULTS[lang] },
        })),

      setAboutMeItem: (index, value) =>
        set((s) => ({ data: { ...s.data, aboutMe: updateAt(s.data.aboutMe, index, (item) => ({ ...item, content: value })) } })),
      addAboutMeItem: (type) =>
        set((s) => ({ data: { ...s.data, aboutMe: [...s.data.aboutMe, createTextPointItem(type)] } })),
      removeAboutMeItem: (index) =>
        set((s) => ({ data: { ...s.data, aboutMe: s.data.aboutMe.filter((_, i) => i !== index) } })),

      setTechnology: (index, value) =>
        set((s) => ({ data: { ...s.data, technologies: updateAt(s.data.technologies, index, () => value) } })),
      addTechnology: () =>
        set((s) => ({ data: { ...s.data, technologies: [...s.data.technologies, ''] } })),
      removeTechnology: (index) =>
        set((s) => ({ data: { ...s.data, technologies: s.data.technologies.filter((_, i) => i !== index) } })),
      reorderTechnologies: (from, to) =>
        set((s) => {
          const list = [...s.data.technologies];
          const [item] = list.splice(from, 1);
          list.splice(to, 0, item);
          return { data: { ...s.data, technologies: list } };
        }),

      setExperienceField: (index, field, value) =>
        set((s) => ({ data: { ...s.data, experience: updateAt(s.data.experience, index, (e) => ({ ...e, [field]: value })) } })),
      setExperienceBullet: (expIndex, bulletIndex, value) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: updateAt(s.data.experience, expIndex, (e) => ({
              ...e,
              bullets: updateAt(e.bullets, bulletIndex, (bullet) => ({ ...bullet, content: value })),
            })),
          },
        })),
      addExperienceBullet: (expIndex, type) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: updateAt(s.data.experience, expIndex, (e) => ({
              ...e,
              bullets: [...e.bullets, createTextPointItem(type)],
            })),
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
        set((s) => ({ data: { ...s.data, experience: [...s.data.experience, createExperienceEntry()] } })),
      removeExperience: (index) =>
        set((s) => ({ data: { ...s.data, experience: s.data.experience.filter((_, i) => i !== index) } })),

      setEducationField: (index, field, value) =>
        set((s) => ({ data: { ...s.data, education: updateAt(s.data.education, index, (e) => ({ ...e, [field]: value })) } })),
      addEducation: (type) =>
        set((s) => ({ data: { ...s.data, education: [...s.data.education, createEducationEntry(type)] } })),
      removeEducation: (index) =>
        set((s) => ({ data: { ...s.data, education: s.data.education.filter((_, i) => i !== index) } })),

      setCourseField: (index, field, value) =>
        set((s) => ({ data: { ...s.data, courses: updateAt(s.data.courses, index, (c) => ({ ...c, [field]: value })) } })),
      addCourse: (type) =>
        set((s) => ({ data: { ...s.data, courses: [...s.data.courses, createCourseEntry(type)] } })),
      removeCourse: (index) =>
        set((s) => ({ data: { ...s.data, courses: s.data.courses.filter((_, i) => i !== index) } })),

      addCustomSection: (area) => {
        const id = crypto.randomUUID();
        set((s) => ({
          data: {
            ...s.data,
            [area]: [...s.data[area], { id, title: 'Section Title', items: [] }],
          },
        }));
        return id;
      },
      removeCustomSection: (area, id) =>
        set((s) => ({ data: { ...s.data, [area]: s.data[area].filter((sec) => sec.id !== id) } })),
      setCustomSectionField: (area, id, field, value) =>
        set((s) => ({
          data: {
            ...s.data,
            [area]: s.data[area].map((sec) => sec.id === id ? { ...sec, [field]: value } : sec),
          },
        })),
      addCustomSectionItem: (area, id, type) =>
        set((s) => ({
          data: {
            ...s.data,
            [area]: s.data[area].map((sec) => sec.id === id ? { ...sec, items: [...sec.items, createTextPointItem(type)] } : sec),
          },
        })),
      setCustomSectionItem: (area, id, itemIndex, value) =>
        set((s) => ({
          data: {
            ...s.data,
            [area]: s.data[area].map((sec) => sec.id === id
              ? { ...sec, items: updateAt(sec.items, itemIndex, (item) => ({ ...item, content: value })) }
              : sec),
          },
        })),
      removeCustomSectionItem: (area, id, itemIndex) =>
        set((s) => ({
          data: {
            ...s.data,
            [area]: s.data[area].map((sec) => sec.id === id
              ? { ...sec, items: sec.items.filter((_, index) => index !== itemIndex) }
              : sec),
          },
        })),

      resetData: () => set({ data: defaultData, cvLanguage: 'en' as CvLanguage }),
    }),
    {
      name: 'cv-data',
      version: 5,
      migrate: (stored: unknown, _version: number) => {
        const s = stored as { data?: Partial<CvData> };

        const aboutMe = (s?.data?.aboutMe ?? defaultData.aboutMe).map((item, index) => {
          if (typeof item === 'string') {
            return { id: `about-${index + 1}`, type: 'text' as const, content: item };
          }

          return {
            id: item.id ?? crypto.randomUUID(),
            type: item.type === 'point' ? 'point' : 'text',
            content: item.content ?? '',
          };
        });

        const experience = (s?.data?.experience ?? defaultData.experience).map((entry, index) => ({
          ...entry,
          id: entry.id ?? `experience-${index + 1}`,
          bullets: (entry.bullets ?? []).map((bullet, bulletIndex) => {
            if (typeof bullet === 'string') {
              return {
                id: `experience-${index + 1}-bullet-${bulletIndex + 1}`,
                type: 'point' as const,
                content: bullet,
              };
            }

            return {
              id: bullet.id ?? crypto.randomUUID(),
              type: bullet.type === 'text' ? 'text' : 'point',
              content: bullet.content ?? '',
            };
          }),
        }));

        const education = (s?.data?.education ?? defaultData.education).map((entry, index) => ({
          ...entry,
          id: entry.id ?? `education-${index + 1}`,
          type: entry.type === 'point' ? 'point' : 'text',
        }));

        const courses = (s?.data?.courses ?? defaultData.courses).map((entry, index) => ({
          ...entry,
          id: entry.id ?? `course-${index + 1}`,
          type: entry.type === 'point' ? 'point' : 'text',
        }));

        const mapCustomSections = (sections: CvData['mainCustom'] | CvData['sidebarCustom']) =>
          (sections ?? []).map((section, index) => {
            const legacyContent = (section as CustomSection & { content?: string }).content;
            const items = Array.isArray(section.items)
              ? section.items.map((item) => ({
                id: item.id ?? crypto.randomUUID(),
                type: item.type === 'point' ? 'point' : 'text',
                content: item.content ?? '',
              }))
              : legacyContent && legacyContent.trim()
                ? [{
                  id: `custom-${index + 1}-item-1`,
                  type: 'text' as const,
                  content: legacyContent,
                }]
                : [];

            return {
              id: section.id ?? crypto.randomUUID(),
              title: section.title ?? 'Section Title',
              items,
            };
          });

        return {
          data: {
            ...defaultData,
            ...(s?.data ?? {}),
            aboutMe,
            experience,
            education,
            courses,
            sectionTitles: {
              ...defaultData.sectionTitles,
              ...(s?.data?.sectionTitles ?? {}),
            },
            sidebarCustom: mapCustomSections(s?.data?.sidebarCustom ?? defaultData.sidebarCustom),
            mainCustom: mapCustomSections(s?.data?.mainCustom ?? defaultData.mainCustom),
          },
        };
      },
    }
  )
);
