import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCvStore } from '../store/cvStore';
import { useSettingsStore } from '../store/settingsStore';
import './MainContent.css';
import AboutMe from './AboutMe';
import Experience from './Experience';
import Education from './Education';
import Courses from './Courses';
import CustomSection from './CustomSection';

export default function MainContent() {
  const { visibility } = useSettingsStore();
  const { data: { mainCustom }, addCustomSection, removeCustomSection, setCustomSectionField } = useCvStore();

  return (
    <main className="main-content">
      {visibility.aboutMe    && <AboutMe />}
      {visibility.experience && <Experience />}
      {visibility.education  && <Education />}
      {visibility.courses    && <Courses />}

      {mainCustom.map((sec) => (
        <CustomSection
          key={sec.id}
          title={sec.title}
          content={sec.content}
          onChangeTitle={(v) => setCustomSectionField('mainCustom', sec.id, 'title', v)}
          onChangeContent={(v) => setCustomSectionField('mainCustom', sec.id, 'content', v)}
          onRemove={() => removeCustomSection('mainCustom', sec.id)}
        />
      ))}

      <button
        type="button"
        className="btn-add"
        onClick={() => addCustomSection('mainCustom')}
      >
        <FontAwesomeIcon icon={faPlus} /> Add section
      </button>
    </main>
  );
}
