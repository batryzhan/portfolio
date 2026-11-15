# Batyrzhan Amanbek — portfolio

One-page portfolio. Vite + React 19 + TypeScript + Tailwind CSS v4 + React Three Fiber.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm test         # unit tests (swarm + tetris logic)
```

## Editing content
- All text, links, achievements and photo captions: `src/content.ts`
- Photos: put originals in `assets/img`, list them in `scripts/optimize-images.mjs`, run `node scripts/optimize-images.mjs`
- Colors and fonts: tokens at the top of `src/index.css`

## How the hero works
`src/three/SwarmScene.tsx` is loaded lazily after first paint (the page shows an SVG poster until then). Robots are one `InstancedMesh`; formation math lives in `src/lib/swarm.ts`. Clicking a robot fails it and the rest re-form.

Deploy: any static host (Vercel, Netlify, GitHub Pages) serving `dist/`.
