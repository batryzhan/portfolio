import type { ProjectSlide } from "./components/ProjectCarousel";

export const person = {
  name: "Batyrzhan Amanbek",
  first: "Batyrzhan",
  last: "Amanbek",
  age: 16,
  tagline:
    "I build robots that keep working when one of them breaks — and the software and language models that tell them what to do.",
  school: "Kyzylorda Bilim-Innovation Lyceum for gifted boys",
  grade: "11th grade",
  studying: ["UNT", "IELTS", "School finals"],
  email: "batryzhan@gmail.com",
};

export const roles = [
  {
    id: "hardware",
    title: "Hardware Engineer",
    org: "HubTech KZ",
    href: "https://hubtech.kz",
    body: "Designing and soldering the electronics side of real products: boards, wiring, sensors, and the bring-up that makes them talk.",
  },
  {
    id: "team",
    title: "Captain, robotics team Pulsar",
    org: "@pulsar.ftc",
    href: "https://instagram.com/pulsar.ftc/",
    body: "Leading a FIRST Tech Challenge team: splitting the build, keeping the code honest, and getting the robot to the field on time.",
  },
];

export type Project = {
  id: string;
  name: string;
  expansion: string;
  body: string;
  tags: string[];
  repo: string;
  slides: ProjectSlide[];
};

export const projects: Project[] = [
  {
    id: "talos",
    name: "TALOS",
    expansion: "Target-Agent Learning & Operational System",
    body: "An operational system that lets a group of mobile robots split up work and keep going when one of them fails. Robots bid for tasks in an auction; when one drops out, the rest re-plan in seconds. Tested in simulated factory, mine and wildfire scenarios.",
    tags: ["Multi-robot coordination", "Fault tolerance", "Task allocation"],
    repo: "https://github.com/batryzhan/talos",
    slides: [
      {
        src: "/images/projects/talos/factory-960.webp",
        srcLarge: "/images/projects/talos/factory-1600.webp",
        largeWidth: 1600,
        width: 960,
        height: 600,
        alt: "TALOS simulator: a factory floor where cutter, welder, mechanic and logistics robots share work, with a fleet telemetry table below.",
        caption: "Factory: a welder's battery dies mid-shift and a mechanic is reassigned to it.",
      },
      {
        src: "/images/projects/talos/mining-960.webp",
        srcLarge: "/images/projects/talos/mining-1600.webp",
        largeWidth: 1600,
        width: 960,
        height: 600,
        alt: "TALOS simulator: a dark mine mapped by LiDAR robots, with collapsed tunnels marked in red.",
        caption: "Mine: a tunnel collapses and the swarm reroutes around it.",
      },
      {
        src: "/images/projects/talos/rescue-960.webp",
        srcLarge: "/images/projects/talos/rescue-1600.webp",
        largeWidth: 1600,
        width: 960,
        height: 600,
        alt: "TALOS simulator: firefighting robots on a hilly forest map with two active fires and a river.",
        caption: "Wildfire: 24 robots find fires, cut firebreaks and refill at the river.",
      },
    ],
  },
  {
    id: "triage",
    name: "Pulsar Triage",
    expansion: "LLM support assistant for Grand Mobile",
    body: "An AI assistant that sorts Grand Mobile players' support requests, sets their priority, and drafts replies that administrators review before sending.",
    tags: ["LLM", "Classification", "Human in the loop"],
    repo: "https://github.com/BAITC-Hacks/hack-02e066fd-pulsar/",
    slides: [
      {
        src: "/images/projects/pulsar_triage/landing-960.webp",
        srcLarge: "/images/projects/pulsar_triage/landing-1600.webp",
        largeWidth: 1440,
        width: 960,
        height: 600,
        alt: "Support Copilot landing page: a large headline over a dark green background and an Open demo button.",
        caption: "Landing page of the hackathon prototype.",
      },
      {
        src: "/images/projects/pulsar_triage/workspace-960.webp",
        srcLarge: "/images/projects/pulsar_triage/workspace-1600.webp",
        largeWidth: 1440,
        width: 960,
        height: 600,
        alt: "Support Copilot admin workspace: a queue of player requests, the selected ticket, and a drafted reply waiting for review.",
        caption: "Admin workspace: ticket queue, extracted facts and a draft reply that a person approves.",
      },
    ],
  },
];

export type Achievement = {
  place: string;
  title: string;
  detail: string;
  prize?: number;
};

export const achievements: Achievement[] = [
  {
    place: "1st place",
    title: "Decentrathon 6.0",
    detail: "Across 19 regions of Kazakhstan",
    prize: 500000,
  },
  {
    place: "1st place",
    title: "National Hackathon by KazAtomProm 2026",
    detail: "National hackathon",
    prize: 100000,
  },
  {
    place: "Finalist",
    title: "World Robot Olympiad 2026",
    detail: "National stage, top 20 across Kazakhstan",
  },
];

export const journey = [
  {
    src: "/img/decentrathon.webp",
    w: 1280,
    h: 960,
    event: "Decentrathon 6.0",
    caption: "Hackathon floor, mid-build. We took first place out of teams from 19 regions.",
  },
  {
    src: "/img/first-championship.webp",
    w: 1280,
    h: 960,
    event: "Central Asian FIRST Championship",
    caption: "Team photo with the Programming Mastery Award certificate.",
  },
  {
    src: "/img/wro-national.webp",
    w: 1280,
    h: 934,
    event: "World Robot Olympiad 2026 — National stage",
    caption: "On stage as one of the top 20 projects in Kazakhstan.",
  },
  {
    src: "/img/cp-open-cup.webp",
    w: 1280,
    h: 720,
    event: "CP Open Cup III — 2025",
    caption: "Second place and a university education grant.",
  },
];

export const links = [
  { label: "GitHub", handle: "batryzhan", href: "https://github.com/batryzhan/" },
  { label: "LinkedIn", handle: "in/batryzhan", href: "https://linkedin.com/in/batryzhan/" },
  { label: "Telegram", handle: "@batryzhan", href: "https://t.me/batryzhan/" },
  { label: "Instagram", handle: "@batryzhan", href: "https://instagram.com/batryzhan/" },
  { label: "Team Pulsar", handle: "@pulsar.ftc", href: "https://instagram.com/pulsar.ftc/" },
];
