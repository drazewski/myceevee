import { useSettingsStore, LayoutId } from '../store/settingsStore';
import LanguageSelector from './LanguageSelector';
import { Analytics } from '../lib/analytics';
import './LayoutsDrawer.css';

interface LayoutCard {
  id: LayoutId;
  label: string;
  description: string;
  preview: React.ReactNode;
}

function ClassicPreview() {
  return (
    <svg viewBox="0 0 80 106" className="layout-card__svg" aria-hidden="true">
      <rect width="80" height="106" fill="#fff" rx="2" />
      {/* Sidebar */}
      <rect x="0" y="0" width="26" height="106" fill="#1e2a3a" rx="2" />
      <rect x="3" y="6" width="20" height="8" rx="1" fill="#fff" opacity="0.5" />
      <rect x="3" y="17" width="14" height="2" rx="1" fill="#fff" opacity="0.3" />
      <rect x="3" y="21" width="16" height="2" rx="1" fill="#fff" opacity="0.3" />
      <rect x="3" y="25" width="12" height="2" rx="1" fill="#fff" opacity="0.3" />
      <rect x="3" y="32" width="20" height="1" rx="1" fill="#4a90d9" opacity="0.6" />
      <rect x="3" y="35" width="18" height="2" rx="1" fill="#fff" opacity="0.2" />
      <rect x="3" y="39" width="16" height="2" rx="1" fill="#fff" opacity="0.2" />
      {/* Main */}
      <rect x="30" y="6" width="26" height="3" rx="1" fill="#1e2a3a" opacity="0.7" />
      <rect x="30" y="11" width="16" height="2" rx="1" fill="#aaa" />
      <rect x="30" y="18" width="44" height="1.5" rx="1" fill="#4a90d9" opacity="0.4" />
      <rect x="30" y="21" width="40" height="2" rx="1" fill="#ccc" />
      <rect x="30" y="25" width="36" height="2" rx="1" fill="#ccc" />
      <rect x="30" y="29" width="42" height="2" rx="1" fill="#ccc" />
      <rect x="30" y="36" width="44" height="1.5" rx="1" fill="#4a90d9" opacity="0.4" />
      <rect x="30" y="39" width="38" height="2" rx="1" fill="#ccc" />
      <rect x="30" y="43" width="34" height="2" rx="1" fill="#ccc" />
    </svg>
  );
}

function USSinglePreview() {
  return (
    <svg viewBox="0 0 80 106" className="layout-card__svg" aria-hidden="true">
      <rect width="80" height="106" fill="#fff" rx="2" />
      {/* Header */}
      <rect x="10" y="6" width="60" height="4" rx="1" fill="#1e2a3a" opacity="0.8" />
      <rect x="20" y="12" width="40" height="2" rx="1" fill="#aaa" />
      <rect x="15" y="16" width="50" height="1" rx="1" fill="#4a90d9" opacity="0.4" />
      <rect x="8" y="19" width="64" height="1" rx="1" fill="#1e2a3a" opacity="0.6" />
      {/* Sections */}
      <rect x="8" y="24" width="30" height="1.5" rx="1" fill="#1e2a3a" opacity="0.5" />
      <rect x="8" y="27" width="64" height="1" rx="1" fill="#ddd" />
      <rect x="12" y="29" width="56" height="1.5" rx="1" fill="#ccc" />
      <rect x="12" y="32" width="48" height="1.5" rx="1" fill="#ccc" />
      <rect x="8" y="38" width="30" height="1.5" rx="1" fill="#1e2a3a" opacity="0.5" />
      <rect x="8" y="41" width="64" height="1" rx="1" fill="#ddd" />
      <rect x="12" y="43" width="56" height="1.5" rx="1" fill="#ccc" />
      <rect x="12" y="46" width="42" height="1.5" rx="1" fill="#ccc" />
      <rect x="12" y="49" width="50" height="1.5" rx="1" fill="#ccc" />
      <rect x="8" y="55" width="30" height="1.5" rx="1" fill="#1e2a3a" opacity="0.5" />
      <rect x="8" y="58" width="64" height="1" rx="1" fill="#ddd" />
      <rect x="12" y="61" width="40" height="1.5" rx="1" fill="#ccc" />
    </svg>
  );
}

const LAYOUTS: LayoutCard[] = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Two-column with dark sidebar. European style.',
    preview: <ClassicPreview />,
  },
  {
    id: 'us-single',
    label: 'US Resume',
    description: 'Single column, ATS-friendly. US & Canada style.',
    preview: <USSinglePreview />,
  },
];

export default function LayoutsDrawer() {
  const { layoutId, setLayout } = useSettingsStore();

  return (
    <div className="layouts-drawer">
      <p className="layouts-drawer__hint">Choose a layout for your CV.</p>
      <div className="layouts-drawer__grid">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            type="button"
            className={`layout-card${layoutId === layout.id ? ' layout-card--active' : ''}`}
            onClick={() => { Analytics.layoutChanged(layout.id); setLayout(layout.id); }}
          >
            <div className="layout-card__preview">{layout.preview}</div>
            <div className="layout-card__info">
              <span className="layout-card__label">{layout.label}</span>
              <span className="layout-card__desc">{layout.description}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="layouts-drawer__divider" />
      <LanguageSelector />
    </div>
  );
}
