// This is a stub for Sentry integration. Replace with your DSN and enable in production.
import * as Sentry from '@sentry/browser';

export function initSentry() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
    window.Sentry = Sentry;
  }
}
