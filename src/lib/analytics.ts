import posthog from 'posthog-js';
import { analyticsAllowed } from './cookieconsent';

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string;
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string;

let initialised = false;

export function initAnalytics() {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Don't capture anything until consent is granted
    persistence: 'memory',
    autocapture: false,
    capture_pageview: false,
    loaded: (ph) => {
      if (!analyticsAllowed()) {
        ph.opt_out_capturing();
      }
    },
  });
  initialised = true;
}

/** Call this when the user grants analytics consent. */
export function enableAnalytics() {
  if (!initialised) initAnalytics();
  posthog.opt_in_capturing();
  posthog.capture('$pageview');
}

/** Call this when the user revokes analytics consent. */
export function disableAnalytics() {
  posthog.opt_out_capturing();
  posthog.reset();
}

function track(event: string, props?: Record<string, unknown>) {
  if (!initialised || !analyticsAllowed()) return;
  posthog.capture(event, props);
}

// ── Key events ──────────────────────────────────────────────────────────────

export const Analytics = {
  cvExported: () => track('cv_exported'),
  layoutChanged: (layoutId: string) => track('layout_changed', { layout: layoutId }),
  colorChanged: (color: string) => track('color_changed', { color }),
  languageChanged: (lang: string) => track('cv_language_changed', { language: lang }),
  sectionToggled: (section: string, visible: boolean) =>
    track('section_toggled', { section, visible }),
  resetClicked: () => track('cv_reset'),
};
