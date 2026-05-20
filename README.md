# Lawyers Management System

Web-based management system scaffold for law firms and legal teams — includes a React + Vite frontend and example feature folders for authentication, admin, client, and lawyer workflows.

## Overview

This repository contains the frontend for a Lawyers Management System. The project is organized to separate features, layouts, components, and services to make it easy to extend and maintain.

## Key Features

- Modular React frontend with Vite
- Role-based routing and protected routes
- Auth context and token storage utilities
- Example pages and UI components for dashboards
- Mock data and API service stubs for local development

## Tech Stack

- Frontend: React, Vite, JSX, Tailwind/CSS (project styles)
- Tooling: ESLint, Vite dev server

## Repository Structure

- `frontend/` — React application source
	- `src/components/` — UI components and layout pieces
	- `src/features/` — feature modules (auth, admin, client, lawyer)
	- `src/services/` — API helpers and mock seed data
	- `src/pages/` — top-level page components

## Getting Started (Frontend)

Prerequisites: Node.js 16+ and a package manager (`npm`/`pnpm`/`yarn`).

1. Install dependencies

```bash
cd frontend
npm install
```

2. Run development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

Notes:
- The frontend contains a `mockSeedData.js` file to boot local mock data for development. If a backend is added later, update `src/services/api.js` to point to real endpoints.

## Contributing

If you'd like to contribute, please open an issue to propose changes and then a pull request describing the change.

## License

This project is released under the MIT License. Replace with the appropriate license for your project.

## Contact

For questions or help, open an issue in this repository.

