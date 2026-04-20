# News & Announcements

Each file = one news item or announcement.
Filename convention: `YYYY-MM-DD-short-title.md`
Example: `2024-03-15-best-paper-award.md`

Files are sorted by date (newest first) on the site.

## Frontmatter Fields

Every news file starts with a YAML frontmatter block between `---` lines.

| Field        | Required | Notes                                                         |
|--------------|----------|---------------------------------------------------------------|
| `title`      | yes      | Title in English                                              |
| `title_tr`   | yes      | Title in Turkish                                              |
| `date`       | yes      | ISO date: "YYYY-MM-DD"                                        |
| `category`   | yes      | See allowed values below                                      |
| `summary`    | yes      | One-sentence summary in English (shown in news list)          |
| `summary_tr` | yes      | One-sentence summary in Turkish                               |
| `link`       | no       | External URL if this news item links somewhere                |
| `featured`   | no       | true = pinned at top of news list                             |

## Allowed `category` Values
- `award`        — prize or recognition
- `publication`  — new paper accepted or published
- `conference`   — conference talk, poster, or attendance
- `grant`        — new funding received
- `media`        — press coverage or interview
- `teaching`     — course-related news
- `other`        — anything else

## Body Content

After the frontmatter block, write the full news item in Markdown.
- Use `##` for subheadings
- Use `**bold**` for emphasis
- Links: `[link text](https://url.com)`
- The body is optional — if left empty only the summary is shown.
