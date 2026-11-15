# Portfolio Implementation Plan

> Executed natively in-session (user already approved and asked to build).

**Goal:** Ship the one-page portfolio described in the spec.
**Architecture:** Vite SPA; content in `src/content.ts`; one component per section in `src/sections/`; hero 3D in `src/three/` lazy-loaded; pure swarm math in `src/lib/swarm.ts` with Vitest tests.
**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4 (`@tailwindcss/vite`), three + @react-three/fiber, Vitest.
**Spec:** `docs/superpowers/specs/2026-11-15-portfolio-design.md`

## Global Constraints
- All copy in English. All links from the brief, opened with `rel="noopener noreferrer"`.
- Colors only via CSS tokens in `src/index.css`.
- Hero text renders without waiting for JS chunks of three.js.

## Review Focus
- Reduced-motion users: no swarm animation, no marquee movement.
- Mobile (≤400px): no horizontal scroll, 3D runs at lower DPR / fewer robots.
- WebGL unavailable: poster SVG stays, no crash.
- Every robot failed: swarm resets instead of disappearing (tested in `swarm.test.ts`).
- Keyboard users: visible focus, skip link, all links reachable.

---

### Task 1: Scaffold
Files: `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `public/img/*`.
- [ ] Create Vite react-ts app, add tailwind, three, r3f, vitest. Copy + compress images to `public/img` with clean names.
- [ ] Verify: `npm run build` passes.

### Task 2: Swarm math (TDD)
Files: `src/lib/swarm.ts`, `src/lib/swarm.test.ts`.
Produces: `formationTargets(count: number, alive: boolean[], radius: number): [number, number, number][]`, `failRobot(alive: boolean[], i: number): boolean[]` (resets to all-alive when none would remain).
- [ ] Tests: alive robots get distinct targets on the ring/sphere; failed robot index excluded; failing the last alive resets.
- [ ] Verify: `npx vitest run` passes.

### Task 3: Tokens, layout, sections
Files: `src/index.css`, `src/content.ts`, `src/App.tsx`, `src/components/*`, `src/sections/*`.
- [ ] Implement all spec sections from `content.ts`.

### Task 4: Hero 3D
Files: `src/three/SwarmScene.tsx`, `src/sections/Hero.tsx`.
Consumes: Task 2 functions.
- [ ] InstancedMesh robots + LineSegments links; pointer attraction; click fails robot; `frameloop` paused off-screen; lazy-loaded on idle.

### Task 5: Review & verify
- [ ] code-review, simplify, a11y pass; `npm run build`, `npm run dev`, browser check at 375 / 1280.
