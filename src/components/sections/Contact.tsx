import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { contactLinks, profile } from '@/content/profile';
import { publishable } from '@/content/verification';
import type { ContactLink } from '@/content/types';
import { Icon, type IconName } from '@/components/ui/Icon';
import { VerifyBadge } from '@/components/ui/VerifyBadge';
import { ContactForm } from './ContactForm';

const linkIcon: Record<ContactLink['kind'], IconName> = {
  github: 'github',
  linkedin: 'linkedin',
  email: 'mail',
  cv: 'download',
};

export function Contact() {
  const t = useTranslations('contact');
  const tHero = useTranslations('hero');
  const ta = useTranslations('a11y');
  const locale = useLocale() as Locale;
  const links: ContactLink[] = [
    ...publishable(contactLinks),
    ...(profile.cvUrl ? [{ kind: 'cv' as const, label: 'PDF', href: profile.cvUrl, verified: true }] : []),
  ];
  const email = links.find((l) => l.kind === 'email' && l.verified)?.href.replace(/^mailto:/, '') ?? null;

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container-x contact-grid">
        <div data-reveal>
          <p className="eyebrow m-0">{t('index')}</p>
          <h2 id="contact-title" className="display-title contact-title mt-4 mb-0">
            {t('title')}
          </h2>
          <p className="section-intro">
            {t('subtitle')}
          </p>
          <p className="contact-location">
            <Icon name="globe" size={18} /> {t('location')} {profile.location[locale]}
          </p>

          {links.length > 0 ? (
            <ul className="contact-links">
              {links.map((link) => {
                const external = link.href.startsWith('http');
                return (
                  <li key={link.kind} className={`contact-links__item contact-links__item--${link.kind}`}>
                    <a
                      className="contact-link glass"
                      href={link.href}
                      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      {...(link.kind === 'cv' ? { download: true } : {})}
                    >
                      <Icon name={linkIcon[link.kind]} size={28} />
                      <span>
                        <span className="contact-link__label block font-medium">
                          {t(`links.${link.kind}`)}
                          <VerifyBadge item={link} />
                        </span>
                        {link.kind === 'cv' && <span className="contact-link__cv-label">{tHero('downloadCv')}</span>}
                        <span className="contact-link__sub block text-[0.88rem] opacity-75">{link.label}</span>
                        {external && <span className="sr-only">{ta('newTab')}</span>}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="contact-pending">
              {t('linksSoon')}
            </p>
          )}
          {/* phones only: closing line of the approved mobile design */}
          <p className="contact-thanks">
            {t('thanks')} <Icon name="heart" size={20} />
          </p>
        </div>

        <div data-reveal>
          <ContactForm email={email} />
        </div>
      </div>
    </section>
  );
}
