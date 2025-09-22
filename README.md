# Codex Convergence

Codex Convergence is a neon-infused browser puzzle where you bind glowing runes to restore the shattered Codex Obscura. Match clusters of three or more fragments, chase combo multipliers, and keep the chronometer alive long enough to inscribe as many verses as possible.

## Getting Started

The game is a static site and will run in any modern browser. If you only need to peek at the experience, open `index.html` directly in your browser of choice and press **Start Ritual**.

## Local development server

To iterate quickly or share a live URL on your machine, use the built-in development server:

1. Install dependencies once: `npm install`
2. Start the local server: `npm start`
3. Open http://127.0.0.1:4173 in your browser. Use `npm run start:open` to launch and open the page automatically.

The server is powered by [`http-server`](https://www.npmjs.com/package/http-server) with caching disabled so that changes to HTML, CSS, or JavaScript are reflected immediately when you refresh.

## Automated browser tests

Interactive experiences are easiest to verify in a browser. Playwright end-to-end tests are included to confirm core flows such as starting a ritual and populating the rune grid.

```bash
npm install
npx playwright install --with-deps   # required the first time to download browsers
npm test
```

Use `npm run test:headed` for a visible browser window, or `npm run test:ui` to explore the test cases visually.

## Deploying to GitHub Pages

The repository contains a GitHub Actions workflow (`.github/workflows/deploy.yml`) that publishes the site to GitHub Pages. Once the workflow is on the default branch:

1. Go to **Settings → Pages** in your GitHub repository and choose "GitHub Actions" as the source.
2. Push to the `main` branch (or trigger the workflow manually via the **Actions** tab).
3. GitHub Actions builds and deploys the static assets, making the game available at `https://<your-username>.github.io/<repository-name>/`.

If you prefer a manual setup, you can also enable Pages by selecting the `main` branch and the `/ (root)` folder under **Settings → Pages**. GitHub will host the static files without an additional build step.

## Project Structure

- `GAME_DESIGN.md` – design document outlining the Codex Convergence concept.
- `index.html` – markup for the game shell and interface.
- `styles.css` – theming and layout with a codex-inspired neon aesthetic.
- `script.js` – game logic, including grid spawning, scoring, combos, and timing.
- `tests/` – Playwright browser tests covering critical interactions.

No external build tools are required; everything runs directly in the browser.
