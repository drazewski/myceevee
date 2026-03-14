import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCvStore } from '../store/cvStore';
import { DEFAULT_MAIN_ORDER, useSettingsStore, MainKey } from '../store/settingsStore';
import { getCustomOrderItemId, isCustomOrderItem, resolveSectionOrder } from '../lib/sectionOrder';
import './MainContent.css';
import AboutMe from './AboutMe';
import Experience from './Experience';
import Education from './Education';
import Courses from './Courses';
import CustomSection from './CustomSection';

const SECTION_MAP: Record<MainKey, React.ComponentType> = {
  aboutMe: AboutMe,
  experience: Experience,
  education: Education,
  courses: Courses,
};

export default function MainContent() {
  const { t } = useTranslation();
  const { visibility, mainOrder, addMainCustomSection, removeMainCustomSection } = useSettingsStore();
  const {
    data: { mainCustom },
    addCustomSection,
    removeCustomSection,
    setCustomSectionField,
    addCustomSectionItem,
    setCustomSectionItem,
    removeCustomSectionItem,
  } = useCvStore();

  const resolvedMainOrder = useMemo(
    () => resolveSectionOrder(mainOrder, DEFAULT_MAIN_ORDER, mainCustom.map((section) => section.id)),
    [mainCustom, mainOrder],
  );

  const mainCustomMap = useMemo(
    () => new Map(mainCustom.map((section) => [section.id, section])),
    [mainCustom],
  );

  const handleAddSection = () => {
    const id = addCustomSection('mainCustom');
    addMainCustomSection(id);
  };

  const handleRemoveSection = (id: string) => {
    removeCustomSection('mainCustom', id);
    removeMainCustomSection(id);
  };

  return (
    <main className="main-content">
      {resolvedMainOrder.map((item) => {
        if (isCustomOrderItem(item)) {
          const section = mainCustomMap.get(getCustomOrderItemId(item));
          if (!section) return null;

          return (
            <CustomSection
              key={section.id}
              title={section.title}
              items={section.items}
              onChangeTitle={(value) => setCustomSectionField('mainCustom', section.id, 'title', value)}
              onAddItem={(type) => addCustomSectionItem('mainCustom', section.id, type)}
              onChangeItem={(index, value) => setCustomSectionItem('mainCustom', section.id, index, value)}
              onRemoveItem={(index) => removeCustomSectionItem('mainCustom', section.id, index)}
              onRemove={() => handleRemoveSection(section.id)}
            />
          );
        }

        if (!visibility[item]) return null;
        const Section = SECTION_MAP[item];
        return <Section key={item} />;
      })}

      <button
        type="button"
        className="btn-add"
        onClick={handleAddSection}
      >
        <FontAwesomeIcon icon={faPlus} /> {t('actions.addSection')}
      </button>
    </main>
  );
}
