import { useSettingsStore } from '../store/settingsStore';
import './MainContent.css';
import AboutMe from './AboutMe';
import Experience from './Experience';
import Education from './Education';
import Courses from './Courses';

export default function MainContent() {
  const { visibility } = useSettingsStore();

  return (
    <main className="main-content">
      {visibility.aboutMe    && <AboutMe />}
      {visibility.experience && <Experience />}
      {visibility.education  && <Education />}
      {visibility.courses    && <Courses />}
    </main>
  );
}
