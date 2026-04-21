import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import { getSiteConfig, getNewsItems } from '@/lib/content';
import { PageTitle } from '@/components/ui/SectionTitle';
import NewsClient, { type NewsDict, type NewsItemFlat } from '@/components/sections/NewsClient';

// ── Lightweight markdown → HTML (covers the subset used in news bodies) ────────

function applyInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );
}

function mdToHtml(md: string): string {
  if (!md.trim()) return '';
  return md
    .trim()
    .split(/\n\n+/)
    .map(block => {
      const b = block.trim();
      if (!b) return '';
      // ## Heading
      if (/^## /.test(b))  return `<h3>${applyInline(b.slice(3).trim())}</h3>`;
      // ### Heading
      if (/^### /.test(b)) return `<h4>${applyInline(b.slice(4).trim())}</h4>`;
      // Unordered list
      if (/^- /.test(b)) {
        const items = b
          .split('\n')
          .filter(l => l.startsWith('- '))
          .map(l => `<li>${applyInline(l.slice(2))}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }
      // Paragraph (inline line breaks preserved)
      return `<p>${b.split('\n').map(applyInline).join('<br>')}</p>`;
    })
    .filter(Boolean)
    .join('');
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const [dict, config] = await Promise.all([
    getDictionary(params.lang),
    Promise.resolve(getSiteConfig()),
  ]);
  return {
    title: `${(dict as any).news.title} — ${config.owner.name.full}`,
    description: `News and updates from ${config.owner.name.full}.`,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function NewsPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const lang = params.lang;

  const [dict, config, rawItems] = await Promise.all([
    getDictionary(lang),
    Promise.resolve(getSiteConfig()),
    Promise.resolve(getNewsItems()),
  ]);

  const d = (dict as any).news as NewsDict;

  const items: NewsItemFlat[] = rawItems.map(item => ({
    slug:       item.slug,
    title:      item.title,
    title_tr:   item.title_tr,
    date:       item.date,
    category:   item.category,
    summary:    item.summary,
    summary_tr: item.summary_tr,
    link:       item.link,
    featured:   item.featured,
    bodyHtml:   mdToHtml(item.content ?? ''),
  }));

  return (
    <>
      <PageTitle
        eyebrow={`${config.owner.title[lang]} · ${config.institution.department[lang]}`}
      >
        {d.title}
      </PageTitle>

      <NewsClient items={items} lang={lang} dict={d} />
    </>
  );
}
