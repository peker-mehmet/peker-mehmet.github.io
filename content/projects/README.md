# Research Projects

Each file = one research project (ongoing or completed).
Filename convention: `short-project-name.json`
Example: `tubitak-memory-2023.json`

## Field Reference

| Field            | Required | Notes                                                       |
|------------------|----------|-------------------------------------------------------------|
| `id`             | yes      | Must match the filename (without .json)                     |
| `title`          | yes      | Bilingual {en, tr}                                          |
| `status`         | yes      | active | completed | planned                                |
| `description`    | yes      | Bilingual {en, tr}                                          |
| `role`           | yes      | Your role: "Principal Investigator", "Co-Investigator", etc |
| `funding`        | no       | Object with agency, grant_number, amount (see template)     |
| `collaborators`  | no       | Array of {name, affiliation} objects                        |
| `start_date`     | yes      | "YYYY-MM" format                                            |
| `end_date`       | no       | "YYYY-MM" format. Leave empty if ongoing.                   |
| `outputs`        | no       | Array of publication IDs linked to this project             |
| `image`          | no       | Path to a project image in /public/images/                  |
| `featured`       | no       | true = shown on homepage                                    |
