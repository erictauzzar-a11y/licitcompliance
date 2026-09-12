---
name: frontend-design
description: >-
  Advanced principles and guidelines for building professional, accessible, and high-performance user interfaces
  using React, Next.js, Tailwind CSS, Radix UI, and Lucide icons.
  Use this skill whenever designing or refining UI layouts, design systems, typography, color palettes,
  interactive components, responsive views, or micro-interactions.
---

# Frontend Design & UI/UX Excellence Skill

Systematic guide to crafting high-end, responsive, accessible, and clean user interfaces for enterprise B2B SaaS applications.

## 1. Core Visual Principles

### A. Layout Hierarchy & Breathing Room
- Avoid cramped views. Use generous spacing (`space-y-6`, `p-6` to `p-8` for dashboard cards, `max-w-6xl` or `max-w-7xl` containers).
- Clear typography scale: `text-xs` for metadata/badges, `text-sm` for secondary text/labels, `text-base` for standard copy, `text-lg`/`text-xl` for section titles, `text-3xl`/`text-4xl` for hero headings.
- Establish strict visual contrast: Dark mode (`slate-900`/`slate-950`), light mode (`slate-50` background with pure `white` elevated cards and `border-slate-200`).

### B. Color & Semantics
- **Brand / Primary**: Professional Blue (`blue-600` / `blue-700`) for primary actions, focus rings, and high-priority links.
- **Success / Validated**: Emerald (`emerald-600` / `bg-emerald-500/10` / `text-emerald-400`) for passing audits, completed trains, and active status.
- **Warning**: Amber (`amber-500` / `text-amber-400`).
- **Danger / Channel**: Crimson / Red (`red-600` / `text-red-400`) for whistleblower channels, severe risks, and deletions.

### C. Components & Interactions
- Always provide feedback on actions: loading spinners, disabled states during submit, success toasts or modals.
- Responsive design: Full mobile drawer or bottom bar, desktop sidebar with collapsible/sticky navigation.
- Accessible: Screen-reader labels (`aria-label`), keyboard navigation (`focus-visible:ring-2`), and high text contrast.
