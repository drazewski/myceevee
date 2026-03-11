import { useCvStore } from '../store/cvStore';
import { useSettingsStore, VisibilityKey } from '../store/settingsStore';
import { SectionTitles } from '../data/cv';
import EditableText from './EditableText';
import './ElementsDrawer.css';

interface ToggleItem {
  key: VisibilityKey;
  label: string;
  titleKey?: keyof SectionTitles;
}

const SIDEBAR_ITEMS: ToggleItem[] = [
  { key: 'photo',        label: 'Photo' },
  { key: 'title',        label: 'Title' },
  { key: 'position',     label: 'Position' },
  { key: 'location',     label: 'Location' },
  { key: 'email',        label: 'Email' },
  { key: 'webpage',      label: 'Website' },
  { key: 'github',       label: 'GitHub' },
  { key: 'linkedin',     label: 'LinkedIn' },
  { key: 'technologies', label: 'Technologies', titleKey: 'technologies' },
];

const MAIN_ITEMS: ToggleItem[] = [
  { key: 'aboutMe',    label: 'About Me',               titleKey: 'aboutMe' },
  { key: 'experience', label: 'Experience',              titleKey: 'experience' },
  { key: 'education',  label: 'Education',               titleKey: 'education' },
  { key: 'courses',    label: 'Courses & Certifications', titleKey: 'courses' },
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
  const { data: { sectionTitles }, setSectionTitle } = useCvStore();

  return (
    <div className="ed-section">
      <h3 className="ed-section__title">{title}</h3>
      <ul className="ed-list">
        {items.map(({ key, label, titleKey }) => (
          <li key={key} className="ed-item">
            {titleKey ? (
              <span className="ed-item__label ed-item__label--editable">
                <EditableText
                  value={sectionTitles[titleKey]}
                  onChange={(v) => setSectionTitle(titleKey, v)}
                />
              </span>
            ) : (
              <span className="ed-item__label">{label}</span>
            )}
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
