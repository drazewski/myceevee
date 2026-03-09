import { CvData } from '../data/cv';
import './MainContent.css';
import AboutMe from './AboutMe';
import Experience from './Experience';
import Education from './Education';
import Courses from './Courses';

interface MainContentProps {
  data: CvData;
}

export default function MainContent({ data }: MainContentProps) {
  return (
    <main className="main-content">
      <AboutMe items={data.aboutMe} />
      <Experience items={data.experience} />
      <Education items={data.education} />
      <Courses items={data.courses} />
    </main>
  );
}
