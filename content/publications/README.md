# Publications

Each file = one publication. Filename convention: `lastname-year-keyword.json`
Example: `erken-2024-attention.json`

## Field Reference

| Field               | Required | Notes                                                   |
|---------------------|----------|---------------------------------------------------------|
| `id`                | yes      | Must match the filename (without .json)                 |
| `type`              | yes      | See allowed values below                                |
| `title`             | yes      | Bilingual object {en, tr}                               |
| `authors`           | yes      | Array — your name first, format "Lastname, Firstname"   |
| `year`              | yes      | Four-digit integer                                      |
| `journal`           | varies   | Journal name (for type: journal)                        |
| `conference`        | varies   | Conference name (for type: conference)                  |
| `publisher`         | varies   | Publisher name (for type: book or book-chapter)         |
| `book_title`        | varies   | Parent book title (for type: book-chapter)              |
| `volume`            | no       | Journal volume number                                   |
| `issue`             | no       | Journal issue number                                    |
| `pages`             | no       | "101-120"                                               |
| `doi`               | no       | DOI only, without https://doi.org/ prefix               |
| `url`               | no       | Full URL to the paper if no DOI                         |
| `pdf`               | no       | Path to PDF in /public/downloads/, e.g. "/downloads/x" |
| `abstract`          | no       | Bilingual object {en, tr}                               |
| `tags`              | no       | Array of keywords for filtering                         |
| `featured`          | no       | true = shown on homepage; default false                 |

## Allowed `type` Values
- `journal`        — peer-reviewed journal article
- `conference`     — conference paper or poster
- `book`           — authored or edited book
- `book-chapter`   — chapter in an edited volume
- `thesis`         — PhD or Master's thesis
- `preprint`       — preprint / working paper
