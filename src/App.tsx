import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faRotateLeft, faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import USLayout from './components/USLayout';
import DrawerTabs from './components/DrawerTabs';
import ResetModal from './components/ResetModal';
import { useSettingsStore, FONTS } from './store/settingsStore';
import { useCvStore } from './store/cvStore';
import { Analytics } from './lib/analytics';

const CV_WIDTH = 794;

export default function App() {
  const { styling, resetLayout, layoutId } = useSettingsStore();
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
    '--color-primary':         styling.primaryColor,
    '--color-accent':          styling.accentColor,
    '--font-size-sidebar':     `${styling.fontSizeSidebar}px`,
    '--font-size-title':       `${styling.fontSizeTitle}px`,
    '--font-size-body':        `${styling.fontSizeBody}px`,
    '--line-height-sidebar':   styling.lineHeightSidebar,
    '--line-height-body':      styling.lineHeightBody,
    '--font-size-us-name':     `${styling.fontSizeUSName}px`,
    '--font-size-us-title':    `${styling.fontSizeUSTitle}px`,
    '--font-size-us-contact':  `${styling.fontSizeUSContact}px`,
    '--line-height-us-header': styling.lineHeightUSHeader,
    '--photo-size-classic':    `${styling.photoSizeClassic}px`,
    '--photo-size-us':         `${styling.photoSizeUS}px`,
    fontFamily:                FONTS[styling.font].css,
  } as React.CSSProperties;

  return (
    <div className={`cv-page${preview ? ' is-preview' : ''}`}>
      <header className="cv-header">
        <div className="cv-toolbar" style={{ width: CV_WIDTH * scale }}>
          <a href="/" className="cv-toolbar__logo" title="MyCeeVee">
            My<span className="cv-toolbar__logo-c">C</span><span className="cv-toolbar__logo-ee">ee</span><span className="cv-toolbar__logo-v">V</span><span className="cv-toolbar__logo-ee">ee</span>
          </a>
          <div className="cv-toolbar__actions">
            <button className="cv-toolbar__reset" onClick={() => setShowReset(true)} title="Reset">
              <FontAwesomeIcon icon={faRotateLeft} />
              <span className="cv-toolbar__btn-label"> Reset</span>
            </button>
            <button
              className={`cv-toolbar__preview${preview ? ' cv-toolbar__preview--active' : ''}`}
              onClick={() => setPreview((p) => !p)}
              title={preview ? 'Edit mode' : 'Preview'}
            >
              <FontAwesomeIcon icon={preview ? faPenToSquare : faEye} />
              <span className="cv-toolbar__btn-label">{preview ? ' Edit mode' : ' Preview'}</span>
            </button>
            <button className="cv-toolbar__export" onClick={() => { Analytics.cvExported(); window.print(); }} title="Export PDF">
              <FontAwesomeIcon icon={faFilePdf} />
              <span className="cv-toolbar__btn-label"> Export PDF</span>
            </button>
          </div>
        </div>
      </header>
      <div className="cv-scaler" ref={scalerRef}>
        <div
          className="cv-scaler__inner"
          style={{
            transform: scale < 1 ? `scale(${scale})` : undefined,
            marginBottom: scale < 1 ? `${(scale - 1) * 1123}px` : undefined,
          }}
        >
          <div className="cv-layout" style={cvVars}>
            {layoutId === 'classic' ? (
              <>
                <Sidebar />
                <MainContent />
              </>
            ) : (
              <USLayout />
            )}
          </div>
        </div>
      </div>
      <DrawerTabs />
      {showReset && (
        <ResetModal
          onResetLayout={() => { Analytics.resetClicked(); resetLayout(); setShowReset(false); }}
          onResetData={() => { Analytics.resetClicked(); resetData(); setShowReset(false); }}
          onResetAll={() => { Analytics.resetClicked(); resetLayout(); resetData(); setShowReset(false); }}
          onClose={() => setShowReset(false)}
        />
      )}
    </div>
  );
}
