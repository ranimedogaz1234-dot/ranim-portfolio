import { getRequestConfig } from 'next-intl/server';
import { routing, isLocale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : routing.defaultLocale;
  const messages = (await import(`../../messages/${locale}.json`)).default as Record<string, unknown>;
  return { locale, messages };
});
