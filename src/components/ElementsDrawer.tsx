import { useSettingsStore, VisibilityKey } from '../store/settingsStore';
import './ElementsDrawer.css';

interface ToggleItem {
  key: VisibilityKey;
  label: string;
}

const SIDEBAR_ITEMS: ToggleItem[] = [
  { key: 'photo',        label: 'Photo' },
  { key: 'position',     label: 'Position' },
  { key: 'location',     label: 'Location' },
  { key: 'email',        label: 'Email' },
  { key: 'webpage',      label: 'Website' },
  { key: 'github',       label: 'GitHub' },
  { key: 'linkedin',     label: 'LinkedIn' },
  { key: 'technologies', label: 'Technologies' },
];

const MAIN_ITEMS: ToggleItem[] = [
  { key: 'aboutMe',    label: 'About Me' },
  { key: 'experience', label: 'Experience' },
  { key: 'education',  label: 'Education' },
  { key: 'courses',    label: 'Courses & Certifications' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`ed-toggle ${checked ? 'ed-toggle--on' : ''}`}
    >
      <span className="ed-toggle__thumb" />
    </button>
  );
}

function Section({ title, items }: { title: string; items: ToggleItem[] }) {
  const { visibility, setVisibility } = useSettingsStore();
  return (
    <div className="ed-section">
      <h3 className="ed-section__title">{title}</h3>
      <ul className="ed-list">
        {items.map(({ key, label }) => (
          <li key={key} className="ed-item">
            <span className="ed-item__label">{label}</span>
            <Toggle checked={visibility[key]} onChange={(v) => setVisibility(key, v)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ElementsDrawer() {
  return (
    <div className="elements-drawer">
      <Section title="Sidebar" items={SIDEBAR_ITEMS} />
      <div className="ed-divider" />
      <Section title="Main content" items={MAIN_ITEMS} />
    </div>
  );
}
