import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing, isLocale, LOCALE_COOKIE } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // "/" → the language the visitor last chose, otherwise English.
  if (request.nextUrl.pathname === '/') {
    const saved = request.cookies.get(LOCALE_COOKIE)?.value;
    const target = isLocale(saved) ? saved : routing.defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${target}`;
    return NextResponse.redirect(url);
  }
  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
