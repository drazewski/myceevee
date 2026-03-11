import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontKey = 'system' | 'inter' | 'lato' | 'merriweather' | 'playfair';

export const FONTS: Record<FontKey, { label: string; css: string }> = {
  system:      { label: 'System UI',        css: "'Segoe UI', system-ui, sans-serif" },
  inter:       { label: 'Inter',            css: "'Inter', sans-serif" },
  lato:        { label: 'Lato',             css: "'Lato', sans-serif" },
  merriweather:{ label: 'Merriweather',     css: "'Merriweather', serif" },
  playfair:    { label: 'Playfair Display', css: "'Playfair Display', serif" },
};

export interface Styling {
  primaryColor: string;
  accentColor: string;
  font: FontKey;
  fontSizeSidebar: number;    // px
  fontSizeTitle: number;      // px
  fontSizeBody: number;       // px
  lineHeightSidebar: number;
  lineHeightBody: number;
}

export type VisibilityKey =
  | 'photo' | 'position' | 'location' | 'email' | 'webpage'
  | 'github' | 'linkedin' | 'technologies'
  | 'aboutMe' | 'experience' | 'education' | 'courses';

export type Visibility = Record<VisibilityKey, boolean>;

interface SettingsStore {
  styling: Styling;
  visibility: Visibility;
  setStyling: <K extends keyof Styling>(key: K, value: Styling[K]) => void;
  setVisibility: (key: VisibilityKey, value: boolean) => void;
}

const defaultStyling: Styling = {
  primaryColor: '#1e2a3a',
  accentColor: '#4a90d9',
  font: 'system',
  fontSizeSidebar: 13,
  fontSizeTitle: 11,
  fontSizeBody: 14,
  lineHeightSidebar: 1.4,
  lineHeightBody: 1.55,
};

const defaultVisibility: Visibility = {
  photo: true, position: true, location: true, email: true, webpage: true,
  github: true, linkedin: true, technologies: true,
  aboutMe: true, experience: true, education: true, courses: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      styling: defaultStyling,
      visibility: defaultVisibility,
      setStyling: (key, value) =>
        set((s) => ({ styling: { ...s.styling, [key]: value } })),
      setVisibility: (key, value) =>
        set((s) => ({ visibility: { ...s.visibility, [key]: value } })),
    }),
    {
      name: 'cv-settings',
      version: 2,
      migrate: (_state, _version) => ({
        styling: defaultStyling,
        visibility: defaultVisibility,
      }),
    }
  )
);
