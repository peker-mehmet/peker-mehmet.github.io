'use client';

import { useState } from 'react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgornkpb';

export type ContactDict = {
  title: string;
  email: string;
  office: string;
  address: string;
  form_title: string;
  form_name: string;
  form_email: string;
  form_subject: string;
  form_message: string;
  form_submit: string;
  form_sending: string;
  form_name_placeholder: string;
  form_email_placeholder: string;
  form_subject_placeholder: string;
  form_message_placeholder: string;
  subject_collaboration: string;
  subject_scale: string;
  subject_media: string;
  subject_student: string;
  subject_other: string;
  success_title: string;
  success_body: string;
  send_another: string;
  error_title: string;
  error_body: string;
  info_title: string;
  response_label: string;
  response_value: string;
  profiles_title: string;
  view_profile: string;
  required_field: string;
  [key: string]: string;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string; // _gotcha — hidden spam trap read by Formspree
};

const EMPTY_FORM: FormData = { name: '', email: '', subject: '', message: '', honeypot: '' };

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconSend({ spinning }: { spinning?: boolean }) {
  if (spinning) {
    return (
      <svg
        className="w-4 h-4 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.903 6.557H13.5a.75.75 0 010 1.5H4.182l-1.903 6.557a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconWarning() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

// ── Shared field classes ──────────────────────────────────────────────────────

const fieldCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-warm-300 bg-white ' +
  'font-body text-sm text-slate-800 placeholder:text-slate-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-navy-300 focus:border-navy-400 transition-colors';

const labelCls = 'block font-body text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5';

// ── Main component ────────────────────────────────────────────────────────────

export default function ContactForm({ dict }: { dict: ContactDict }) {
  const [form, setForm]     = useState<FormData>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>('idle');

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.honeypot) return; // silently drop bot submissions
    setStatus('submitting');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:     form.name,
          email:    form.email,
          subject:  form.subject,
          message:  form.message,
          _gotcha:  form.honeypot,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setForm(EMPTY_FORM);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  // ── Success state ───────────────────────────────────────────────────────────

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600">
          <IconCheck />
        </div>
        <div>
          <p className="font-display text-xl font-semibold text-navy-800 mb-1">{dict.success_title}</p>
          <p className="font-body text-sm text-slate-500 leading-relaxed">{dict.success_body}</p>
        </div>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-xs font-medium font-body text-navy-500 hover:text-navy-800 underline underline-offset-2 transition-colors"
        >
          {dict.send_another}
        </button>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  const subjects = [
    { value: 'collaboration', label: dict.subject_collaboration },
    { value: 'scale',         label: dict.subject_scale },
    { value: 'media',         label: dict.subject_media },
    { value: 'student',       label: dict.subject_student },
    { value: 'other',         label: dict.subject_other },
  ];

  const isSubmitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* Honeypot — hidden from real users, traps bots */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={form.honeypot}
        onChange={set('honeypot')}
      />

      {/* Error banner */}
      {status === 'error' && (
        <div role="alert" className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <IconWarning />
          <div>
            <p className="font-body text-sm font-semibold">{dict.error_title}</p>
            <p className="font-body text-xs mt-0.5 text-red-600">{dict.error_body}</p>
          </div>
        </div>
      )}

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-name" className={labelCls}>
            {dict.form_name} <span className="text-gold-600">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder={dict.form_name_placeholder}
            value={form.name}
            onChange={set('name')}
            disabled={isSubmitting}
            className={fieldCls}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelCls}>
            {dict.form_email} <span className="text-gold-600">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={dict.form_email_placeholder}
            value={form.email}
            onChange={set('email')}
            disabled={isSubmitting}
            className={fieldCls}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="cf-subject" className={labelCls}>
          {dict.form_subject} <span className="text-gold-600">*</span>
        </label>
        <select
          id="cf-subject"
          name="subject"
          required
          value={form.subject}
          onChange={set('subject')}
          disabled={isSubmitting}
          className={`${fieldCls} ${form.subject === '' ? 'text-slate-400' : 'text-slate-800'}`}
        >
          <option value="" disabled>{dict.form_subject_placeholder}</option>
          {subjects.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cf-message" className={labelCls}>
          {dict.form_message} <span className="text-gold-600">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={6}
          placeholder={dict.form_message_placeholder}
          value={form.message}
          onChange={set('message')}
          disabled={isSubmitting}
          className={`${fieldCls} resize-none`}
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <p className="font-body text-xs text-slate-400">
          <span className="text-gold-600">*</span> {dict.required_field}
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-navy-700 text-white
                     text-sm font-medium font-body shadow-sm
                     hover:bg-navy-800 active:scale-[0.98] transition-all duration-150
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <IconSend spinning={isSubmitting} />
          {isSubmitting ? dict.form_sending : dict.form_submit}
        </button>
      </div>

    </form>
  );
}
