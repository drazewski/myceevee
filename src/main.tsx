import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { initCookieConsent } from './lib/cookieconsent';
import { initAnalytics, enableAnalytics, disableAnalytics } from './lib/analytics';

initAnalytics();

initCookieConsent({
  onAnalyticsEnabled: enableAnalytics,
  onAnalyticsDisabled: disableAnalytics,
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
