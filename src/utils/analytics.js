/**
 * Analytics Event Tracker Helper
 * Safe wrapper for Vercel Analytics / Plausible / Custom Event Logging
 */
export function trackEvent(eventName, properties = {}) {
  try {
    // 1. Check window.va (Vercel Analytics)
    if (typeof window !== 'undefined' && typeof window.va === 'function') {
      window.va('event', { name: eventName, ...properties });
    }

    // 2. Check window.plausible
    if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
      window.plausible(eventName, { props: properties });
    }

    // 3. Check Google Analytics / gtag
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, properties);
    }

    // 4. Debug in development
    if (import.meta.env?.DEV) {
      console.log(`[Analytics Event] 📊 ${eventName}`, properties);
    }
  } catch (err) {
    // Fail silently in production
  }
}
