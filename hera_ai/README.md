# HERA Research Hub

This is a data-driven static website. Page content is stored in `content.json` and rendered by
`app.js` when each page loads.

## Editing content

- Update site branding, navigation, and footer text in `site`.
- Update the landing page in `home`.
- Add or edit working groups in `projects.items`.
- Add research outputs in `resources.items` and resource types in `resources.filters`.
- Add training material in `courses.items`.
- Update publication steps in `process.steps`.
- Add programme contacts in `people.items`.
- Update HERA information and principles in `about`.

Keep the existing property names when adding records. Links may be relative paths, full URLs, or
`#` while they are placeholders. Validate the file after editing with:

```sh
python3 -m json.tool hera_ai/content.json >/dev/null
```

## Pages

- `index.html`: home
- `projects.html`: projects and working groups
- `resources.html`: filterable research output catalogue
- `courses.html`: courses and training
- `process.html`: publication pathway
- `people.html`: programme and theme leaders
- `about.html`: HERA overview

Because browsers block JSON requests from local `file://` pages, preview the repository through a
local web server or GitHub Pages. From the repository root:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/hera_ai/`.
