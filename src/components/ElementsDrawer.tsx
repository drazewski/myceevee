import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { useCvStore } from '../store/cvStore';
import {
  DEFAULT_MAIN_ORDER,
  DEFAULT_SIDEBAR_ORDER,
  useSettingsStore,
  VisibilityKey,
  SidebarKey,
  MainKey,
} from '../store/settingsStore';
import { SectionTitles } from '../data/cv';
import { getCustomOrderItemId, isCustomOrderItem, resolveSectionOrder } from '../lib/sectionOrder';
import EditableText from './EditableText';
import './ElementsDrawer.css';

const SIDEBAR_TITLE_KEYS: Partial<Record<SidebarKey, keyof SectionTitles>> = {
  technologies: 'technologies',
};

const MAIN_TITLE_KEYS: Record<MainKey, keyof SectionTitles> = {
  aboutMe: 'aboutMe',
  experience: 'experience',
  education: 'education',
  courses: 'courses',
};

type BuiltInDrawerItem<K extends VisibilityKey> = {
  kind: 'builtin';
  id: K;
  label: string;
  titleKey?: keyof SectionTitles;
  checked: boolean;
  onToggle: (value: boolean) => void;
};

type CustomDrawerItem = {
  kind: 'custom';
  id: string;
  label: string;
  onChangeLabel: (value: string) => void;
};

type DrawerItem<K extends VisibilityKey> = BuiltInDrawerItem<K> | CustomDrawerItem;

function reorderItems<T>(items: readonly T[], from: number, to: number): T[] {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
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

function DraggableSection<K extends VisibilityKey>({
  title,
  items,
  onReorder,
}: {
  title: string;
  items: DrawerItem<K>[];
  onReorder: (from: number, to: number) => void;
}) {
  const { data: { sectionTitles }, setSectionTitle } = useCvStore();
  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  return (
    <div className="ed-section">
      <h3 className="ed-section__title">{title}</h3>
      <ul className="ed-list">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={`ed-item${dragOver === index ? ' ed-item--drag-over' : ''}`}
            draggable
            onDragStart={() => { dragIndex.current = index; }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(index); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => {
              if (dragIndex.current !== null && dragIndex.current !== index) {
                onReorder(dragIndex.current, index);
              }
              dragIndex.current = null;
              setDragOver(null);
            }}
            onDragEnd={() => { dragIndex.current = null; setDragOver(null); }}
          >
            <FontAwesomeIcon icon={faGripVertical} className="ed-item__grip" />
            <span className="ed-item__label">
              {item.kind === 'builtin' ? (
                item.titleKey ? (
                  <EditableText
                    value={sectionTitles[item.titleKey]}
                    onChange={(value) => setSectionTitle(item.titleKey!, value)}
                  />
                ) : (
                  item.label
                )
              ) : (
                <EditableText value={item.label} onChange={item.onChangeLabel} />
              )}
            </span>
            {item.kind === 'builtin' ? (
              <Toggle checked={item.checked} onChange={item.onToggle} />
            ) : (
              <span className="ed-item__toggle-spacer" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const US_HEADER_FIXED: SidebarKey[] = ['photo', 'title'];
const US_CONTACT_KEY_SET = new Set<SidebarKey>(['position', 'location', 'email', 'webpage', 'github', 'linkedin']);

function StaticSection({ title, keys, labels }: {
  title: string;
  keys: SidebarKey[];
  labels: Record<SidebarKey, string>;
}) {
  const { visibility, setVisibility } = useSettingsStore();

  return (
    <div className="ed-section">
      <h3 className="ed-section__title">{title}</h3>
      <ul className="ed-list">
        {keys.map((key) => (
          <li key={key} className="ed-item">
            <span className="ed-item__grip ed-item__grip--spacer" />
            <span className="ed-item__label">{labels[key]}</span>
            <Toggle
              checked={visibility[key]}
              onChange={(value) => setVisibility(key, value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ElementsDrawer() {
  const { t } = useTranslation();
  const {
    sidebarOrder,
    mainOrder,
    setSidebarOrder,
    setMainOrder,
    layoutId,
    visibility,
    setVisibility,
  } = useSettingsStore();
  const {
    data: { sidebarCustom, mainCustom },
    setCustomSectionField,
  } = useCvStore();

  const sidebarLabels: Record<SidebarKey, string> = {
    photo: t('elements.photo'),
    name: t('elements.name'),
    title: t('elements.title'),
    position: t('elements.position'),
    location: t('elements.location'),
    email: t('elements.email'),
    webpage: t('elements.website'),
    github: t('elements.github'),
    linkedin: t('elements.linkedin'),
    technologies: t('elements.technologies'),
  };

  const resolvedSidebarOrder = useMemo(
    () => resolveSectionOrder(sidebarOrder, DEFAULT_SIDEBAR_ORDER, sidebarCustom.map((section) => section.id)),
    [sidebarCustom, sidebarOrder],
  );

  const resolvedMainOrder = useMemo(
    () => resolveSectionOrder(mainOrder, DEFAULT_MAIN_ORDER, mainCustom.map((section) => section.id)),
    [mainCustom, mainOrder],
  );

  const sidebarCustomMap = useMemo(
    () => new Map(sidebarCustom.map((section) => [section.id, section])),
    [sidebarCustom],
  );

  const mainCustomMap = useMemo(
    () => new Map(mainCustom.map((section) => [section.id, section])),
    [mainCustom],
  );

  const classicSidebarItems: DrawerItem<SidebarKey>[] = resolvedSidebarOrder.flatMap((item) => {
    if (isCustomOrderItem(item)) {
      const section = sidebarCustomMap.get(getCustomOrderItemId(item));
      if (!section) return [];

      return [{
        kind: 'custom' as const,
        id: section.id,
        label: section.title,
        onChangeLabel: (value: string) => setCustomSectionField('sidebarCustom', section.id, 'title', value),
      }];
    }

    return [{
      kind: 'builtin' as const,
      id: item,
      label: sidebarLabels[item],
      titleKey: SIDEBAR_TITLE_KEYS[item],
      checked: visibility[item],
      onToggle: (value: boolean) => setVisibility(item, value),
    }];
  });

  const mainItems: DrawerItem<MainKey>[] = resolvedMainOrder.flatMap((item) => {
    if (isCustomOrderItem(item)) {
      const section = mainCustomMap.get(getCustomOrderItemId(item));
      if (!section) return [];

      return [{
        kind: 'custom' as const,
        id: section.id,
        label: section.title,
        onChangeLabel: (value: string) => setCustomSectionField('mainCustom', section.id, 'title', value),
      }];
    }

    return [{
      kind: 'builtin' as const,
      id: item,
      label: t('elements.mainContent'),
      titleKey: MAIN_TITLE_KEYS[item],
      checked: visibility[item],
      onToggle: (value: boolean) => setVisibility(item, value),
    }];
  });

  const contactItems: DrawerItem<SidebarKey>[] = resolvedSidebarOrder.flatMap((item) => {
    if (isCustomOrderItem(item) || !US_CONTACT_KEY_SET.has(item)) return [];

    return [{
      kind: 'builtin' as const,
      id: item,
      label: sidebarLabels[item],
      titleKey: SIDEBAR_TITLE_KEYS[item],
      checked: visibility[item],
      onToggle: (value: boolean) => setVisibility(item, value),
    }];
  });

  const reorderContact = (from: number, to: number) => {
    const contactOrder = resolvedSidebarOrder.filter(
      (item): item is SidebarKey => !isCustomOrderItem(item) && US_CONTACT_KEY_SET.has(item),
    );
    const fromKey = contactOrder[from];
    const toKey = contactOrder[to];
    const fromIndex = resolvedSidebarOrder.indexOf(fromKey);
    const toIndex = resolvedSidebarOrder.indexOf(toKey);

    if (fromIndex === -1 || toIndex === -1) return;
    setSidebarOrder(reorderItems(resolvedSidebarOrder, fromIndex, toIndex));
  };

  return (
    <div className="elements-drawer">
      {layoutId === 'us-single' ? (
        <>
          <StaticSection
            title={t('elements.header')}
            keys={US_HEADER_FIXED}
            labels={sidebarLabels}
          />
          <div className="ed-divider" />
          <DraggableSection
            title={t('elements.contact')}
            items={contactItems}
            onReorder={reorderContact}
          />
          <div className="ed-divider" />
          <DraggableSection
            title={t('elements.mainContent')}
            items={mainItems}
            onReorder={(from, to) => setMainOrder(reorderItems(resolvedMainOrder, from, to))}
          />
          <div className="ed-divider" />
          <div className="ed-section">
            <h3 className="ed-section__title">{t('elements.technologies')}</h3>
            <ul className="ed-list">
              <li className="ed-item">
                <span className="ed-item__grip ed-item__grip--spacer" />
                <span className="ed-item__label">{sidebarLabels.technologies}</span>
                <Toggle
                  checked={visibility.technologies}
                  onChange={(value) => setVisibility('technologies', value)}
                />
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <DraggableSection
            title={t('elements.sidebar')}
            items={classicSidebarItems}
            onReorder={(from, to) => setSidebarOrder(reorderItems(resolvedSidebarOrder, from, to))}
          />
          <div className="ed-divider" />
          <DraggableSection
            title={t('elements.mainContent')}
            items={mainItems}
            onReorder={(from, to) => setMainOrder(reorderItems(resolvedMainOrder, from, to))}
          />
        </>
      )}
    </div>
  );
}
