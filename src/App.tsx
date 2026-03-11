import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faRotateLeft, faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import DrawerTabs from './components/DrawerTabs';
import ResetModal from './components/ResetModal';
import { useSettingsStore, FONTS } from './store/settingsStore';
import { useCvStore } from './store/cvStore';

const CV_WIDTH = 794;

export default function App() {
  const { styling, resetLayout } = useSettingsStore();
  const { resetData } = useCvStore();
  const scalerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [showReset, setShowReset] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const update = () => {
      const vw = document.documentElement.clientWidth;
      setScale(Math.min(1, vw / CV_WIDTH));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const cvVars = {
    '--color-primary':        styling.primaryColor,
    '--color-accent':         styling.accentColor,
    '--font-size-sidebar':    `${styling.fontSizeSidebar}px`,
    '--font-size-title':      `${styling.fontSizeTitle}px`,
    '--font-size-body':       `${styling.fontSizeBody}px`,
    '--line-height-sidebar':  styling.lineHeightSidebar,
    '--line-height-body':     styling.lineHeightBody,
    fontFamily:               FONTS[styling.font].css,
  } as React.CSSProperties;

  return (
    <div className={`cv-page${preview ? ' is-preview' : ''}`}>
      <div className="cv-toolbar" style={{ width: CV_WIDTH * scale }}>
          <button className="cv-toolbar__reset" onClick={() => setShowReset(true)}>
            <FontAwesomeIcon icon={faRotateLeft} /> Reset
          </button>
          <button
            className={`cv-toolbar__preview${preview ? ' cv-toolbar__preview--active' : ''}`}
            onClick={() => setPreview((p) => !p)}
          >
            <FontAwesomeIcon icon={preview ? faPenToSquare : faEye} />
            {preview ? ' Edit mode' : ' Preview'}
          </button>
          <button className="cv-toolbar__export" onClick={() => window.print()}>
            <FontAwesomeIcon icon={faFilePdf} /> Export PDF
          </button>
        </div>
      <div className="cv-scaler" ref={scalerRef}>
        <div
          className="cv-scaler__inner"
          style={{
            transform: scale < 1 ? `scale(${scale})` : undefined,
            marginBottom: scale < 1 ? `${(scale - 1) * 1123}px` : undefined,
          }}
        >
          <div className="cv-layout" style={cvVars}>
            <Sidebar />
            <MainContent />
          </div>
        </div>
      </div>
      <DrawerTabs />
      {showReset && (
        <ResetModal
          onResetLayout={() => { resetLayout(); setShowReset(false); }}
          onResetData={() => { resetData(); setShowReset(false); }}
          onResetAll={() => { resetLayout(); resetData(); setShowReset(false); }}
          onClose={() => setShowReset(false)}
        />
      )}
    </div>
  );
}
