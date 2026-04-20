import type { Locale } from './i18n';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
  tr: () => import('@/dictionaries/tr.json').then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
