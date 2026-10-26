# TourCraft

An Angular 21 application for building and previewing interactive product onboarding tours.

## Run locally

```bash
npm ci
npm start
```

Open http://localhost:4200. Use a Node.js version supported by the installed Angular CLI.

## Build and verify

```bash
npm run format:check
npm test -- --watch=false
npm run build
```

`npm run format` formats authored TypeScript, Angular templates, and SCSS. No separate lint runner is configured. Production output is in `dist/tourcraft/browser`.

## Features

- Add, edit, cancel, delete, and reorder steps with reactive form validation.
- Preview all four targets: New Project, Search, Notifications, and Profile.
- Navigate with Previous, Next, Finish, and Restart Tour.
- Responsive application shell, editor, sample project workspace, and viewport-constrained tooltips.
- Search and create sample projects, read notifications, and inspect the demo profile.

Tour changes persist under the existing `tourcraft-tour` localStorage key. Existing valid tours, including empty tours, load unchanged. Unreadable saved data is not overwritten; editing continues in memory with a storage notice. Browser storage failures do not prevent editing. The sample workspace is separate from tour data and resets on navigation or reload.

## Structure

- `core/services/tour.ts`: signal-backed tour state, IDs, mutations, and persistence.
- `pages/builder`: reactive step editor.
- `pages/preview`: preview navigation and completion state.
- `components/demo-workspace`: interactive tour targets and sample workspace state.
- `components/project-list`: project table and search empty state.
- `components/tour-tooltip`: shared onboarding card, focus, and viewport positioning.
- `styles.scss`: shared visual tokens and interface primitives.

Tests cover editing, validation, persistence, storage failures, navigation, completion, and tooltip controls. Browser checks also exercised the main flows and all targets at 1440, 1024, 768, 390, and 320 pixel viewport widths. Browser automation is not installed as a project dependency.

## Code style

Use one blank line between class methods, logical property groups, independent template sections, and SCSS rules. Group imports into framework and local imports; keep related statements together and separate setup, actions, and assertions in tests. Use braces for conditional bodies and keep connected Angular control-flow branches together. Authored TypeScript, HTML, and SCSS contain no explanatory comments.

Prettier standardizes indentation, quotes, semicolons, trailing commas, line endings, and one attribute per line for tags with multiple attributes. It preserves intentional blank lines and collapses repeated blank lines. It does not infer logical property groups, operation boundaries, template sections, or CSS declaration groups, and does not enforce conditional braces. Those conventions require review; `format:check` alone cannot enforce them. No extra formatter plugins or custom formatting rules are installed.
