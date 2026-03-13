import 'vanilla-cookieconsent/dist/cookieconsent.css';
import * as CookieConsent from 'vanilla-cookieconsent';

type ConsentCallbacks = {
  onAnalyticsEnabled: () => void;
  onAnalyticsDisabled: () => void;
};

export function initCookieConsent(callbacks?: ConsentCallbacks) {
  CookieConsent.run({
    onConsent: () => {
      if (CookieConsent.acceptedCategory('analytics')) {
        callbacks?.onAnalyticsEnabled();
      }
    },
    onChange: ({ changedCategories }) => {
      if (changedCategories.includes('analytics')) {
        if (CookieConsent.acceptedCategory('analytics')) {
          callbacks?.onAnalyticsEnabled();
        } else {
          callbacks?.onAnalyticsDisabled();
        }
      }
    },
    guiOptions: {
      consentModal: {
        layout: 'bar',
        position: 'bottom',
        equalWeightButtons: false,
      },
      preferencesModal: {
        layout: 'box',
      },
    },

    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      analytics: {
        enabled: false,
        autoClear: {
          cookies: [
            { name: /^_ph_/ },   // PostHog
            { name: /^_ga/ },    // Google Analytics (future)
          ],
        },
      },
    },

    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: '🍪 We use cookies',
            description:
              'We use essential cookies to make the app work. With your consent we also use analytics cookies to understand how people use MyCeeVee — this helps us improve the product.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject optional',
            showPreferencesBtn: 'Manage preferences',
          },
          preferencesModal: {
            title: 'Cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all optional',
            savePreferencesBtn: 'Save preferences',
            closeIconLabel: 'Close',
            sections: [
              {
                title: 'Essential cookies',
                description:
                  'These cookies are required for the app to function (e.g. saving your CV locally). They cannot be disabled.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analytics cookies',
                description:
                  'These cookies help us understand how visitors interact with MyCeeVee — which features are used, where people drop off, and what to improve. No personal data is sold.',
                linkedCategory: 'analytics',
              },
            ],
          },
        },
      },
    },
  });
}

/** Returns true if the user has accepted analytics cookies. */
export function analyticsAllowed(): boolean {
  return CookieConsent.acceptedCategory('analytics');
}
