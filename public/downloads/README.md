# Downloads

Place all downloadable files here: PDFs, scale forms, scoring guides, manuals, posters, etc.

Files in this folder are publicly accessible at `/downloads/filename.ext`.

## Naming Convention

Use descriptive, lowercase names with hyphens. Include the year where relevant.

| Type              | Example filename                    |
|-------------------|-------------------------------------|
| Journal article   | `lastname-2024-short-title.pdf`     |
| Scale form        | `scale-abbreviation-form-tr.pdf`    |
| Scoring guide     | `scale-abbreviation-scoring.pdf`    |
| Technical manual  | `scale-abbreviation-manual.pdf`     |
| Conference poster | `lastname-2023-conference-poster.pdf` |
| CV                | `cv-en.pdf` / `cv-tr.pdf`           |

## Referencing in Content Files

Once you place a file here, reference it in JSON or Markdown using the path:

```
/downloads/your-filename.pdf
```

Example in a publication JSON:
```json
"pdf": "/downloads/erken-2024-memory.pdf"
```

Example in a scale JSON:
```json
"downloads": {
  "scale_form": "/downloads/ases-form-tr.pdf",
  "scoring_guide": "/downloads/ases-scoring.pdf"
}
```
