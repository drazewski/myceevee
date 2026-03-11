import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faTableCells, faPalette, faListCheck,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import StylingDrawer from './StylingDrawer';
import ElementsDrawer from './ElementsDrawer';
import './DrawerTabs.css';

type TabId = 'account' | 'layouts' | 'styling' | 'elements';

interface TabDef {
  id: TabId;
  label: string;
  icon: IconDefinition;
  enabled: boolean;
}

const TABS: TabDef[] = [
  { id: 'account',  label: 'Account',  icon: faUser,       enabled: false },
  { id: 'layouts',  label: 'Layouts',  icon: faTableCells, enabled: false },
  { id: 'styling',  label: 'Styling',  icon: faPalette,    enabled: true  },
  { id: 'elements', label: 'Elements', icon: faListCheck,  enabled: true  },
];

export default function DrawerTabs() {
  const [open, setOpen] = useState<TabId | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleClick = (tab: TabDef) => {
    if (!tab.enabled) return;
    setOpen((prev) => (prev === tab.id ? null : tab.id));
  };

  return (
    <div className="drawer-root" ref={rootRef}>
      <div className={`drawer-panel ${open ? 'drawer-panel--open' : ''}`}>
        <div className="drawer-panel__inner">
          {open === 'styling'  && <StylingDrawer />}
          {open === 'elements' && <ElementsDrawer />}
        </div>
      </div>

      <div className="drawer-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={[
              'drawer-tab',
              tab.enabled ? 'drawer-tab--enabled' : 'drawer-tab--disabled',
              open === tab.id ? 'drawer-tab--active' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => handleClick(tab)}
            title={tab.enabled ? tab.label : `${tab.label} (coming soon)`}
          >
            <FontAwesomeIcon icon={tab.icon} className="drawer-tab__icon" />
            <span className="drawer-tab__label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
