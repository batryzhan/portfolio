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

export const projects = [
  {
    id: "talos",
    name: "TALOS",
    expansion: "Target-Agent Learning & Operational System",
    body: "An operational system that lets a group of mobile robots work together to transport goods — and keep delivering even if one robot fails. The swarm at the top of this page is a small sketch of that idea.",
    tags: ["Multi-robot coordination", "Fault tolerance", "Task allocation"],
    repo: "https://github.com/batryzhan/talos",
  },
  {
    id: "triage",
    name: "Pulsar Triage",
    expansion: "LLM support assistant for Grand Mobile",
    body: "An AI assistant that sorts Grand Mobile players' support requests, sets their priority, and drafts replies that administrators review before sending.",
    tags: ["LLM", "Classification", "Human in the loop"],
    repo: "https://github.com/BAITC-Hacks/hack-02e066fd-pulsar/",
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
    detail: "The largest national hackathon, across 19 regions of Kazakhstan",
    prize: 500000,
  },
  {
    place: "1st place",
    title: "KazAtomProm National Hackathon 2026",
    detail: "National hackathon by KazAtomProm",
    prize: 100000,
  },
  {
    place: "Award",
    title: "Programming Mastery Award",
    detail: "Central Asian FIRST Championship",
  },
  {
    place: "Finalist",
    title: "World Robot Olympiad 2026",
    detail: "National stage, top 20 projects across Kazakhstan",
  },
  {
    place: "Finalist",
    title: "International Fizmat AI Olympiad 2025",
    detail: "Across 9 countries",
  },
  {
    place: "2nd place",
    title: "CP Open Cup III — 2025",
    detail: "Competitive programming olympiad, with an education grant from Korkyt Ata Kyzylorda University",
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
  { label: "TETR.IO", handle: "batryzhan", href: "https://ch.tetr.io/u/batryzhan" },
];
