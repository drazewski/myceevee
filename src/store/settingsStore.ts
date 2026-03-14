import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomOrderItem, createCustomOrderItem, isCustomOrderItem } from '../lib/sectionOrder';

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
  fontSizeUSName: number;
  fontSizeUSTitle: number;
  fontSizeUSContact: number;
  lineHeightUSHeader: number;
  showContactIcons: boolean;
  photoSizeClassic: number;
  photoSizeUS: number;
}

export type SidebarKey = 'photo' | 'name' | 'title' | 'position' | 'location' | 'email' | 'webpage' | 'github' | 'linkedin' | 'technologies';
export type MainKey = 'aboutMe' | 'experience' | 'education' | 'courses';
export type VisibilityKey = SidebarKey | MainKey;
export type Visibility = Record<VisibilityKey, boolean>;
export type SidebarOrderItem = SidebarKey | CustomOrderItem;
export type MainOrderItem = MainKey | CustomOrderItem;

interface SettingsStore {
  layoutId: LayoutId;
  styling: Styling;
  visibility: Visibility;
  sidebarOrder: SidebarOrderItem[];
  mainOrder: MainOrderItem[];
  setSidebarOrder: (order: SidebarOrderItem[]) => void;
  setMainOrder: (order: MainOrderItem[]) => void;
  setStyling: <K extends keyof Styling>(key: K, value: Styling[K]) => void;
  setVisibility: (key: VisibilityKey, value: boolean) => void;
  reorderSidebar: (from: number, to: number) => void;
  reorderMain: (from: number, to: number) => void;
  addSidebarCustomSection: (id: string) => void;
  addMainCustomSection: (id: string) => void;
  removeSidebarCustomSection: (id: string) => void;
  removeMainCustomSection: (id: string) => void;
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

export const DEFAULT_SIDEBAR_ORDER: SidebarKey[] = ['photo', 'name', 'title', 'position', 'location', 'email', 'webpage', 'github', 'linkedin', 'technologies'];
export const DEFAULT_MAIN_ORDER: MainKey[] = ['aboutMe', 'experience', 'education', 'courses'];

function reorder<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function appendIfMissing<T extends string>(order: T[], item: T): T[] {
  return order.includes(item) ? order : [...order, item];
}

function removeIfPresent<T extends string>(order: T[], item: T): T[] {
  return order.filter((entry) => entry !== item);
}

function isMobileScreen() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

function sanitizeOrder<TBuiltIn extends string>(order: unknown, builtInItems: readonly TBuiltIn[]): Array<TBuiltIn | CustomOrderItem> {
  if (!Array.isArray(order)) return [...builtInItems];

  const builtInSet = new Set<string>(builtInItems);
  const sanitized: Array<TBuiltIn | CustomOrderItem> = [];
  const seen = new Set<string>();

  for (const item of order) {
    if (typeof item !== 'string' || seen.has(item)) continue;
    if (builtInSet.has(item) || isCustomOrderItem(item)) {
      sanitized.push(item as TBuiltIn | CustomOrderItem);
      seen.add(item);
    }
  }

  for (const item of builtInItems) {
    if (!seen.has(item)) {
      sanitized.push(item);
    }
  }

  return sanitized;
}

type PersistedSettings = Partial<{
  layoutId: LayoutId;
  styling: Partial<Styling>;
  visibility: Partial<Visibility>;
  sidebarOrder: SidebarOrderItem[];
  mainOrder: MainOrderItem[];
}>;

function migrateSettings(stored: unknown) {
  const state = (stored as PersistedSettings | undefined) ?? {};

  return {
    layoutId: state.layoutId === 'us-single' ? 'us-single' : 'classic',
    styling: { ...defaultStyling, ...(state.styling ?? {}) },
    visibility: { ...defaultVisibility, ...(state.visibility ?? {}) },
    sidebarOrder: sanitizeOrder(state.sidebarOrder, DEFAULT_SIDEBAR_ORDER),
    mainOrder: sanitizeOrder(state.mainOrder, DEFAULT_MAIN_ORDER),
  };
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      layoutId: isMobileScreen() ? 'us-single' : 'classic',
      styling: defaultStyling,
      visibility: defaultVisibility,
      sidebarOrder: DEFAULT_SIDEBAR_ORDER,
      mainOrder: DEFAULT_MAIN_ORDER,
      setSidebarOrder: (order) => set({ sidebarOrder: order }),
      setMainOrder: (order) => set({ mainOrder: order }),
      setStyling: (key, value) =>
        set((s) => ({ styling: { ...s.styling, [key]: value } })),
      setVisibility: (key, value) =>
        set((s) => ({ visibility: { ...s.visibility, [key]: value } })),
      reorderSidebar: (from, to) =>
        set((s) => ({ sidebarOrder: reorder(s.sidebarOrder, from, to) })),
      reorderMain: (from, to) =>
        set((s) => ({ mainOrder: reorder(s.mainOrder, from, to) })),
      addSidebarCustomSection: (id) =>
        set((s) => ({ sidebarOrder: appendIfMissing(s.sidebarOrder, createCustomOrderItem(id)) })),
      addMainCustomSection: (id) =>
        set((s) => ({ mainOrder: appendIfMissing(s.mainOrder, createCustomOrderItem(id)) })),
      removeSidebarCustomSection: (id) =>
        set((s) => ({ sidebarOrder: removeIfPresent(s.sidebarOrder, createCustomOrderItem(id)) })),
      removeMainCustomSection: (id) =>
        set((s) => ({ mainOrder: removeIfPresent(s.mainOrder, createCustomOrderItem(id)) })),
      resetLayout: () =>
        set({
          layoutId: isMobileScreen() ? 'us-single' : 'classic',
          styling: defaultStyling,
          visibility: defaultVisibility,
          sidebarOrder: DEFAULT_SIDEBAR_ORDER,
          mainOrder: DEFAULT_MAIN_ORDER,
        }),
      setLayout: (id) => set({ layoutId: id }),
    }),
    {
      name: 'cv-settings',
      version: 11,
      migrate: (stored) => migrateSettings(stored),
    },
  ),
);
