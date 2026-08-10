# UXDR.net

Personal portfolio site for James Abbott Eqdam — experience research and design work, case studies, publications, and writing.

## Getting started

Requires Node.js and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
npm install
npm run dev
```

The dev server runs on port 8080.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with hot reloading |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Build with development mode settings |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the project |

## Tech stack

- Vite
- TypeScript
- React with React Router
- shadcn/ui on Radix primitives
- Tailwind CSS

## Project layout

```
src/
  components/     Shared UI; ui/ holds the shadcn primitives
  pages/          Route-level components
  data/           Case studies, articles, experience, and research as JSON
  lib/            Helpers, including the obfuscated contact details
public/           Static assets served as-is (logo, favicon, robots.txt)
```

Content lives in `src/data` as JSON rather than in components, so case studies and
articles can be edited without touching the rendering code.

## Notable implementation details

- **Contact details** are XOR-encoded in `src/lib/contact.ts` and decoded only
  after a visitor completes the hold-to-reveal gesture, so scrapers reading the
  markup never see a raw address or phone number.
- **The splash preloader** fetches its 390 KB logo artwork at runtime instead of
  bundling it, then hands the assembled logo off to the navigation mark.
- **Deep links** on static hosts rely on the `404.html` redirect trick, unwound
  in `src/main.tsx` before the router reads the location.

## Deployment

`npm run build` emits to `dist/`. Note that `docs/` in this repo is an older
checked-in build; if GitHub Pages is configured to serve from `/docs`, that
directory needs refreshing from a current build.

Analytics use GA4 via both the gtag snippet in `index.html` and route-change
events in `src/App.tsx`.
