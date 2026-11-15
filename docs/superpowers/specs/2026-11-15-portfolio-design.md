# Batyrzhan Amanbek — Portfolio Design

Approved by the client (parent) on 2026-11-15.

## Intent
A one-page English portfolio for Batyrzhan Amanbek (16, robotics / hardware / LLM). Audience: admissions committees, hackathon organisers, future teammates. Core message: *he builds real systems that keep working when something breaks.*

## Goals / non-goals / anti-goals
- Goals: memorable first screen, all content from the brief, fast first paint, works on phones, accessible.
- Non-goals: CMS, blog, multi-page routing, backend.
- Anti-goals: purple gradients, generic card grids, Inter/Roboto, fake metrics, 3D that blocks first paint.

## Approaches
1. **Vite + React + TS + Tailwind v4 + R3F (picked)** — static SPA, simplest toolchain, R3F lazy-loaded.
2. Next.js App Router — SSR/SSG not needed for one static page; more config for no gain.
3. Single HTML with import maps — no build step, but user asked for React + Tailwind + R3F with a real build.

## Visual direction — "Night Shift Lab"
- Palette (OKLCH tokens): graphite bg tinted green (`--bg`), ink off-white, accent = solder amber (≤10% surface), secondary = Pulsar green. Blueprint grid + grain.
- Type: Big Shoulders Display (display), Geist (body), JetBrains Mono (telemetry labels).
- Motion lens: Polish for page, Play for the hero swarm and Tetris accent. Respect `prefers-reduced-motion`.
- Unforgettable element: hero swarm of ~60 instanced robots linked by a network; follows cursor; clicking a robot fails it and the rest re-form (TALOS idea).

## Sections
Hero → About/Datasheet (portrait, lyceum logo, UNT/IELTS) → Roles (HubTech KZ, Pulsar captain) → Projects (TALOS, Pulsar Triage) → Achievements + Robotics Journey photos → Off-duty (Tetris, Spotify) → Contact.

## Photo captions (builder's call from photo contents)
- `photo_…-43.jpg` — portrait (About)
- `photo_…-44.jpg` — Decentrathon 6.0, hackathon floor
- `photo_…-45.jpg` — Central Asian FIRST Championship, Programming Mastery Award
- `photo_…-45 (2).jpg` — World Robot Olympiad 2026, national stage
- `photo_…-46.jpg` — CP Open Cup III 2025, 2nd place + Korkyt Ata University grant (visible in photo; added as an extra achievement, pending parent confirmation)

## Constraints
Node 24, npm 12, Windows. Images optimised and served from `public/img`. 3D chunk loaded after first paint via `React.lazy` + idle callback; static SVG poster as fallback.
