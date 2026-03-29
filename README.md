# Imperial Nexus

This repo hosts the current `Chakravyuh / Genesis 2K26` web experience.

The application is a small Next.js shell that renders a full-screen immersive scene from static assets in `public/`. The active route is `/`, which mounts `ThreeDShowcase` and embeds `public/3d/index.html`.

## Architecture

- `app/page.tsx`: home route entrypoint
- `components/home/ThreeDShowcase.tsx`: iframe wrapper for the immersive experience
- `public/3d/index.html`: main Three.js-based scene and navigation shell
- `public/3d/index.js`: extracted runtime logic for the main 3D scene
- `public/earth`, `public/fire`, `public/water`: elemental sub-experiences loaded by the 3D shell
- `public/earth/index.js`, `public/fire/index.js`, `public/water/index.js`: extracted runtime logic for the district scenes
- `app/layout.tsx` and `app/globals.css`: root layout, metadata, fonts, and theme tokens

## Development

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build And Checks

```bash
npm run lint
npm run build
```

## Notes

- The source of truth for the shipped experience is `public/*`, not React page sections.
- The source of truth for club/event image assets is `public/Club Logo/*`.
- The homepage is intentionally static from Next's perspective and currently prerenders successfully.
- Large media files in `public/earth`, `public/fire`, and `public/water` are the main candidates for future performance work.
- Use `QA_CHECKLIST.md` before shipping scene changes because most `public/*` runtime behavior is outside Next.js lint/type coverage.
