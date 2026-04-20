# Scales

Each file = one psychological scale or measurement tool.
Filename convention: `short-scale-name.json`
Example: `academic-self-efficacy-scale.json`

## Field Reference

| Field                    | Required | Notes                                                      |
|--------------------------|----------|------------------------------------------------------------|
| `id`                     | yes      | Must match the filename (without .json)                    |
| `name`                   | yes      | Bilingual {en, tr}                                         |
| `abbreviation`           | no       | Short acronym, e.g. "ASES"                                 |
| `description`            | yes      | Bilingual {en, tr} — what the scale measures               |
| `item_count`             | yes      | Total number of items as an integer                        |
| `subscales`              | no       | Array of subscale names                                    |
| `response_format`        | yes      | E.g. "5-point Likert (1=Never, 5=Always)"                  |
| `target_population`      | yes      | Who the scale is designed for                              |
| `languages_available`    | yes      | Array of language codes, e.g. ["tr", "en"]                 |
| `reliability`            | no       | Object with psychometric info (see template)               |
| `validity_notes`         | no       | Bilingual {en, tr} — brief validity information            |
| `downloads`              | no       | Object with paths to downloadable files                    |
| `citation`               | yes      | Bilingual {en, tr} — how to cite this scale                |
| `reference_publication`  | no       | ID of the publication in /publications/ where it was validated |
| `featured`               | no       | true = shown prominently on the scales page                |
