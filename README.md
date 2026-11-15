# Batyrzhan Amanbek — portfolio

One-page portfolio. Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm test         # unit tests (tetris engine)
```

## Editing content
- All text, links, achievements and photo captions: `src/content.ts`
- Photos: put originals in `assets/img`, list them in `scripts/optimize-images.mjs`, run `node scripts/optimize-images.mjs`
- Colors and fonts: tokens at the top of `src/index.css`


Deploy: any static host (Vercel, Netlify, GitHub Pages) serving `dist/`.
