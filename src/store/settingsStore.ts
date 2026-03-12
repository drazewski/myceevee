import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LayoutId = 'classic' | 'us-single';

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
  fontSizeSidebar: number;
  fontSizeTitle: number;
  fontSizeBody: number;
  lineHeightSidebar: number;
  lineHeightBody: number;
  // US single-column layout
  fontSizeUSName: number;
  fontSizeUSTitle: number;
  fontSizeUSContact: number;
  lineHeightUSHeader: number;
  showContactIcons: boolean;
  // Photo size (per layout)
  photoSizeClassic: number;
  photoSizeUS: number;
}

export type SidebarKey = 'photo' | 'name' | 'title' | 'position' | 'location' | 'email' | 'webpage' | 'github' | 'linkedin' | 'technologies';
export type MainKey = 'aboutMe' | 'experience' | 'education' | 'courses';
export type VisibilityKey = SidebarKey | MainKey;
export type Visibility = Record<VisibilityKey, boolean>;

interface SettingsStore {
  layoutId: LayoutId;
  styling: Styling;
  visibility: Visibility;
  sidebarOrder: SidebarKey[];
  mainOrder: MainKey[];
  setStyling: <K extends keyof Styling>(key: K, value: Styling[K]) => void;
  setVisibility: (key: VisibilityKey, value: boolean) => void;
  reorderSidebar: (from: number, to: number) => void;
  reorderMain: (from: number, to: number) => void;
  resetLayout: () => void;
  setLayout: (id: LayoutId) => void;
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
  fontSizeUSName: 28,
  fontSizeUSTitle: 14,
  fontSizeUSContact: 12,
  lineHeightUSHeader: 1.5,
  showContactIcons: true,
  photoSizeClassic: 120,
  photoSizeUS: 80,
};

const defaultVisibility: Visibility = {
  photo: true, name: true, title: true, position: true, location: true, email: true, webpage: true,
  github: true, linkedin: true, technologies: true,
  aboutMe: true, experience: true, education: true, courses: true,
};

const defaultSidebarOrder: SidebarKey[] = ['photo', 'name', 'title', 'position', 'location', 'email', 'webpage', 'github', 'linkedin', 'technologies'];
const defaultMainOrder: MainKey[] = ['aboutMe', 'experience', 'education', 'courses'];

function reorder<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

const isMobileScreen = () =>
  typeof window !== 'undefined' && window.innerWidth < 768;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      layoutId: isMobileScreen() ? 'us-single' : 'classic',
      styling: defaultStyling,
      visibility: defaultVisibility,
      sidebarOrder: defaultSidebarOrder,
      mainOrder: defaultMainOrder,
      setStyling: (key, value) =>
        set((s) => ({ styling: { ...s.styling, [key]: value } })),
      setVisibility: (key, value) =>
        set((s) => ({ visibility: { ...s.visibility, [key]: value } })),
      reorderSidebar: (from, to) =>
        set((s) => ({ sidebarOrder: reorder(s.sidebarOrder, from, to) })),
      reorderMain: (from, to) =>
        set((s) => ({ mainOrder: reorder(s.mainOrder, from, to) })),
      resetLayout: () =>
        set({
          layoutId: isMobileScreen() ? 'us-single' : 'classic',
          styling: defaultStyling,
          visibility: defaultVisibility,
          sidebarOrder: defaultSidebarOrder,
          mainOrder: defaultMainOrder,
        }),
      setLayout: (id) => set({ layoutId: id }),
    }),
    {
      name: 'cv-settings',
      version: 8,
      migrate: (_state, _version) => ({
        layoutId: isMobileScreen() ? 'us-single' : 'classic',
        styling: defaultStyling,
        visibility: defaultVisibility,
        sidebarOrder: defaultSidebarOrder,
        mainOrder: defaultMainOrder,
      }),
    }
  )
);
