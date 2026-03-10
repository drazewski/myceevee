import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import DrawerTabs from './components/DrawerTabs';
import { useSettingsStore, FONTS } from './store/settingsStore';

export default function App() {
  const { styling } = useSettingsStore();

  const cvVars = {
    '--color-primary':      styling.primaryColor,
    '--color-accent':       styling.accentColor,
    '--font-size-sidebar':  `${styling.fontSizeSidebar}px`,
    '--font-size-title':    `${styling.fontSizeTitle}px`,
    '--font-size-body':     `${styling.fontSizeBody}px`,
    '--line-height':        styling.lineHeight,
    fontFamily:             FONTS[styling.font].css,
  } as React.CSSProperties;

  return (
    <div className="cv-page">
      <div className="cv-toolbar">
        <button className="cv-toolbar__export" onClick={() => window.print()}>
          <FontAwesomeIcon icon={faFilePdf} /> Export PDF
        </button>
      </div>
      <div className="cv-layout" style={cvVars}>
        <Sidebar />
        <MainContent />
      </div>
      <DrawerTabs />
    </div>
  );
}
