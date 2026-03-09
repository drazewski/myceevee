import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { cvData } from './data/cv';

export default function App() {
  return (
    <div className="cv-page">
      <div className="cv-layout">
        <Sidebar data={cvData} />
        <MainContent data={cvData} />
      </div>
    </div>
  );
}
