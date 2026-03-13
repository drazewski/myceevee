import { useState } from 'react';
import { useCvStore } from '../store/cvStore';
import { CvLanguage, SECTION_TITLE_DEFAULTS } from '../data/cv';
import { Analytics } from '../lib/analytics';
import './LanguageSelector.css';

const LANGUAGES: { code: CvLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'pl', label: 'Polski',     flag: '🇵🇱' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'it', label: 'Italiano',   flag: '🇮🇹' },
  { code: 'pt', label: 'Português',  flag: '🇵🇹' },
];

export default function LanguageSelector() {
  const { cvLanguage, setCvLanguage, data } = useCvStore();
  const [confirm, setConfirm] = useState<CvLanguage | null>(null);

  const handleSelect = (lang: CvLanguage) => {
    if (lang === cvLanguage) return;
    const defaults = SECTION_TITLE_DEFAULTS[cvLanguage];
    const customized = (Object.keys(defaults) as (keyof typeof defaults)[]).some(
      (k) => data.sectionTitles[k] !== defaults[k]
    );
    if (customized) {
      setConfirm(lang);
    } else {
      Analytics.languageChanged(lang);
      setCvLanguage(lang);
    }
  };

  const applyChange = () => {
    if (confirm) {
      Analytics.languageChanged(confirm);
      setCvLanguage(confirm);
    }
    setConfirm(null);
  };

  return (
    <div className="lang-selector">
      <div className="lang-selector__label">CV language</div>
      <div className="lang-selector__grid">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            className={`lang-selector__btn${cvLanguage === l.code ? ' lang-selector__btn--active' : ''}`}
            onClick={() => handleSelect(l.code)}
            title={l.label}
          >
            <span className="lang-selector__flag">{l.flag}</span>
            <span className="lang-selector__code">{l.code.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {confirm && (
        <div className="lang-selector__confirm">
          <p>This will reset section titles to <strong>{LANGUAGES.find(l => l.code === confirm)?.label}</strong> defaults. Continue?</p>
          <div className="lang-selector__confirm-actions">
            <button type="button" className="lang-selector__confirm-yes" onClick={applyChange}>Apply</button>
            <button type="button" className="lang-selector__confirm-no" onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
