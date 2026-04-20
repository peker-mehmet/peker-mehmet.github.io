# Content Directory

This folder is your content management system. All site content lives here as
plain JSON or Markdown files — no coding required to add or edit entries.

## Folder Overview

| Folder           | Format   | Purpose                                      |
|------------------|----------|----------------------------------------------|
| `publications/`  | JSON     | Journal articles, conference papers, books   |
| `scales/`        | JSON     | Psychological scales / measurement tools     |
| `projects/`      | JSON     | Research projects (ongoing & completed)      |
| `news/`          | Markdown | News items, announcements, updates           |

Downloadable files (PDFs, forms, manuals) go in `/public/downloads/`.

## How to Add New Content

1. Copy the `_template` file in the relevant folder.
2. Rename it (use a short, descriptive, lowercase filename with hyphens).
3. Fill in the fields — every field is explained inside the template.
4. Save. The site will pick it up automatically on the next build.

## Bilingual Fields

Fields that appear in both languages use this structure:

```json
"title": {
  "en": "English text here",
  "tr": "Türkçe metin buraya"
}
```

If you only have one language version, leave the other as an empty string `""`.
