# Product Cart App

A small Next.js product catalog and cart example used for testing and demos.

## Prerequisites

- Node.js 18 or newer
- npm (bundled with Node.js)

## Install

1. Open a terminal in the project folder:

   `cd product-cart-app`

2. Install dependencies:

   `npm install`

## Run (development)

Start the development server:

`npm run dev`

Open http://localhost:3000 in your browser.

## Build & Start (production)

1. Build the app:

   `npm run build`

2. Start the production server:

   `npm start`

## Tests

Unit and component tests use Vitest and Testing Library.

- Run tests once:

  `npm test`

- Run tests in watch mode (useful during development):

  `npm run test:watch`

Test files are located under the `__tests__` folder and alongside components.

## Project Structure (high-level)

- `app/` — Next.js app routes and pages
- `components/` — Reusable UI components
- `context/` — React context for cart state
- `lib/` — API helpers and utilities
- `public/` — Static assets

## Approach & Design Choices

- Framework: built with Next.js for filesystem-based routing and fast developer experience.
- UI: React 18 and component-first structure to keep components small and testable.
- State: a React Context (`context/CartContext.tsx`) manages cart state for simplicity and to demonstrate patterns.
- Tests: Vitest + Testing Library provide fast unit/component tests with jsdom. Tests are placed in `__tests__` and alongside components where helpful.
- CI-friendly: `npm test` runs headless tests suitable for CI pipelines.
