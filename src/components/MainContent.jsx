import './MainContent.css';
import AboutMe from './AboutMe';
import Experience from './Experience';
import Education from './Education';
import Courses from './Courses';

export default function MainContent({ data }) {
  return (
    <main className="main-content">
      <AboutMe items={data.aboutMe} />
      <Experience items={data.experience} />
      <Education items={data.education} />
      <Courses items={data.courses} />
    </main>
  );
}
