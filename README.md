# Ecommerce Playwright Framework

Playwright TypeScript automation framework for a Penguin ecommerce app. It uses Page Object Model, feature-based tests, reusable fixtures, an API client layer, CI lint enforcement, and Playwright reporting with Allure.

## Portfolio Highlights

- Local Penguin ecommerce app for stable UI and API testing.
- Page Object Model with shared fixtures for authenticated user journeys.
- Smoke and regression tags for targeted execution.
- GitHub Actions workflow with linting, browser setup, sharded tests, and artifact upload.
- HTML and Allure reporting with screenshots, videos, and traces retained on failure.

## Structure

```text
ecommerce-playwright-framework/
├── tests/
│   ├── auth/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   └── fixtures/base.fixture.ts
├── pages/
│   ├── auth/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   └── components/
├── api/
│   └── clients/
├── utils/
│   ├── data/
│   ├── helpers/
│   └── logger/
├── reporters/
├── config/
│   ├── env/
│   └── playwright.config.ts
├── mock-app/
└── .github/workflows/ci.yml
```

## Setup

```bash
npm install
npx playwright install
cp .env.example .env
```

The sample tests run against `mock-app`, a local Penguin Picks ecommerce demo with login, penguin products, cart, checkout, and mock API endpoints.

To run only the mock app:

```bash
npm run mock:app
```

Then open `http://127.0.0.1:4173/products.html`.

## Scripts

```bash
npm test
npm run test:smoke
npm run test:regression
npm run test:dev
npm run test:staging
npm run typecheck
npm run lint
npm run lint:fix
npm run format
npm run report
```

Tags are standard title tags, for example `@smoke` and `@regression`.

## Environments

Set `TEST_ENV=dev` or `TEST_ENV=staging`. The config loads `config/env/<env>.env`, then `.env` for local overrides.

The `dev` preset targets the bundled local mock app. When `BASE_URL` is local, Playwright starts `mock-app/server.mjs` automatically before running tests.

The `staging` preset is intended for a deployed ecommerce environment. Playwright does not start the local mock server for non-local URLs, so `BASE_URL` and `API_BASE_URL` must point to a reachable staging app before running `TEST_ENV=staging` locally or through manual CI dispatch.

The environment preset files in `config/env/` are committed because they only contain demo URLs and make the framework runnable out of the box. Real credentials, personal overrides, and secrets should go in `.env`, which is ignored by Git. In CI, those values should be configured as GitHub Actions repository secrets or environment variables instead of being committed. `.env.example` is included as a safe template for required variables.

Important variables:

```bash
BASE_URL=http://127.0.0.1:4173
API_BASE_URL=http://127.0.0.1:4173
TEST_USER_EMAIL=maybuyer@example.com
TEST_USER_PASSWORD=Password123!
TEST_USER_FIRST_NAME=May
TEST_USER_LAST_NAME=Buyer
```

## Reports and Debugging

Configured artifacts:

- HTML report in `reports/html`
- Allure results in `reports/allure-results`
- Screenshots, videos, and traces retained on failure

## CI

GitHub Actions currently runs on pushes to `main` and manual dispatch. A daily cron trigger is included as commented YAML and can be enabled later.

The pipeline has two jobs:

- `lint`: installs dependencies with `npm ci` and runs `npm run lint`.
- `test`: waits for lint, installs Playwright browsers with system dependencies, then runs two Playwright shards in parallel.

Manual dispatch supports:

- `test_env`: `dev` by default, or `staging` when a reachable staging URL is configured.
- `grep`: optional Playwright tag filter such as `@smoke` or `@regression`.

The test job is attached to the selected GitHub Environment, using `dev` for pushes to `main` and the selected `test_env` for manual runs. Configure these environment variables and secrets in GitHub under **Settings > Environments > staging**:

- Variables: `BASE_URL`, `API_BASE_URL`
- Secrets: `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`, `TEST_USER_FIRST_NAME`, `TEST_USER_LAST_NAME`

Create a `dev` environment only if you want to override the committed local mock-app defaults in CI. If no `dev` variables are configured, the workflow falls back to `config/env/dev.env`.

The workflow cancels older in-progress runs for the same branch when a newer run starts, which helps avoid spending CI minutes on stale commits. Each shard uploads `reports/` and `test-results/` as a `playwright-artifacts-<shard>` artifact retained for 7 days.

## Code Quality

ESLint is configured for TypeScript and Playwright. Rules prevent focused tests, skipped tests, and unused variables. Prettier handles formatting.
