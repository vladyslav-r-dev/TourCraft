TourCraft
Build, customize, and preview interactive product tours.

TourCraft is a responsive Angular application for creating guided onboarding experiences around a demo workspace. Build a sequence of steps, attach each step to a UI element, and see the resulting tour in an interactive preview.

Live Demo: 
<h1 align="center">TourCraft</h1>

<p align="center">
  An interactive product tour builder built with Angular.
</p>

<p align="center">
  <a href="https://vladyslav-r-dev.github.io/TourCraft/">
    <img src="https://img.shields.io/badge/OPEN_LIVE_DEMO-5945E8?style=for-the-badge&logo=angular&logoColor=white" alt="Open Live Demo">
  </a>
</p>

Features
- Tour Builder — Add, edit, delete, and reorder steps, with form validation and cancelable editing.
- Interactive Preview — Highlight target elements and display contextual tooltips with step titles and descriptions.
- Guided Navigation — Move between steps with Previous and Next, finish the tour, or restart it.
- Live Demo Workspace — Explore a sample project dashboard with searchable projects and selectable tour targets.
- Persistent State — Automatically save and restore the tour using the browser's localStorage.
- Responsive Interface — Use the builder and preview across desktop and mobile layouts.
Tech Stack
- Framework: Angular (standalone components)
- Language: TypeScript
- Styling: SCSS
- State Management: Angular Signals and a shared TourService
- Forms: Angular Reactive Forms
- Routing: Angular Router
- Deployment: GitHub Pages via GitHub Actions
Architecture
TourCraft keeps tour state in a shared Angular service. The Builder updates this state, while the Preview reads it to highlight elements inside the Demo Workspace and render reusable tooltips. Component inputs and outputs connect the guided-tour controls, and localStorage persists changes across page reloads.
Testing & Deployment
The project includes automated tests and a production build. A GitHub Actions workflow builds and publishes the application to GitHub Pages.
TourCraft is a frontend-only demo. Tours are stored locally in each visitor's browser; no account or backend service is required.
