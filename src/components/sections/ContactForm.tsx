'use client';

import { useId, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

type Field = 'name' | 'email' | 'message';
type Errors = Partial<Record<Field, string>>;

/**
 * No backend and no third-party form service: the message opens in the visitor's email app,
 * addressed to Ranim's published email. Until that email is confirmed the form explains it
 * can't be sent yet instead of pretending to work.
 */
export function ContactForm({ email }: { email: string | null }) {
  const t = useTranslations('contact.form');
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<string>('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const from = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const next: Errors = {};
    if (!name) next.name = t('required');
    if (!from) next.email = t('required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) next.email = t('emailInvalid');
    if (!message) next.message = t('required');
    else if (message.length < 10) next.message = t('messageShort');
    setErrors(next);
    if (Object.keys(next).length) {
      const first = (['name', 'email', 'message'] as Field[]).find((f) => next[f]);
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    if (!email) {
      setStatus(t('notConfigured'));
      return;
    }
    setStatus(t('opening'));
    const body = `${message}\n\n— ${name} <${from}>`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Portfolio — ${name}`)}&body=${encodeURIComponent(body)}`;
  };

  const field = (name: Field, type: 'text' | 'email' | 'textarea', autoComplete: string) => {
    const id = `${uid}-${name}`;
    const errId = `${id}-error`;
    const common = {
      id,
      name,
      placeholder: t(name),
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': errors[name] ? errId : undefined,
      autoComplete,
      required: true,
    };
    return (
      <div className="field">
        <label htmlFor={id} className="sr-only">
          {t(name)}
        </label>
        {type === 'textarea' ? <textarea rows={5} {...common} /> : <input type={type} {...common} />}
        {errors[name] && (
          <p id={errId} className="field__error m-0">
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <form className="contact-form glass" noValidate onSubmit={onSubmit}>
      {field('name', 'text', 'name')}
      {field('email', 'email', 'email')}
      {field('message', 'textarea', 'off')}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn--primary">
          {t('send')} <Icon name="arrowUpRight" size={18} />
        </button>
        <p className="form-status" role="status">
          {status}
        </p>
      </div>
    </form>
  );
}
