# Rancid Tomatillos

A Rotten Tomatoes-style movie browser built with React. Browse posters, filter and sort by genre and rating, load more as you scroll, and open any film for details — powered by [The Movie Database (TMDB)](https://www.themoviedb.org/).

**Live site:** [https://hayleyw7.github.io/rancid-tomatillos](https://hayleyw7.github.io/rancid-tomatillos)

**Repo:** [https://github.com/hayleyw7/rancid-tomatillos](https://github.com/hayleyw7/rancid-tomatillos)

---

## Features

- Movie poster grid with infinite scroll
- Sort by popularity, rating, or release date
- Filter by genre and rating (Fresh / Mixed / Rotten)
- Movie detail pages with backdrop, overview, runtime, and genres
- **Back to posters** always returns to the homepage with your filters and scroll position restored
- **Next movie** steps through the list you were browsing

No backend required — the app is static and talks to TMDB directly from the browser.

---

## Tech stack

- React 17, React Router, JavaScript / JSX
- TMDB API for movie data and images
- Cypress for E2E tests
- Deployed on **GitHub Pages** via GitHub Actions

Originally built as a paired [Turing School](https://turing.edu) module 3 project. [Project rubric](https://frontend.turing.edu/projects/module-3/rancid-tomatillos-v3.html).

---

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Add a TMDB API key

TMDB keys are **free**. Sign up and request a key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

```bash
cp .env.example .env
```

Add your key to `.env`:

```
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

Restart the dev server whenever you change `.env`.

### 3. Run the app

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Run Cypress tests

```bash
npm start   # in one terminal
npx cypress open
```

---

## Deploy to GitHub Pages

The repo is already set up for GitHub Pages at `https://hayleyw7.github.io/rancid-tomatillos` (see `homepage` in `package.json` and `.github/workflows/deploy.yml`).

### One-time GitHub setup

1. **Add your TMDB key as a secret**
   - Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Name: `REACT_APP_TMDB_API_KEY`
   - Value: your TMDB API key

2. **Enable GitHub Pages**
   - Repo → **Settings** → **Pages**
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` / `/ (root)`

3. **Push to `main`**
   - The deploy workflow builds with your secret and publishes to the `gh-pages` branch automatically.

After the Action finishes, the live site should load movies using the key from GitHub Secrets. You do **not** commit `.env` to the repo.

### Manual deploy (optional)

```bash
REACT_APP_TMDB_API_KEY=your_key npm run build
npx gh-pages -d build
```

---

## Project history

This app started as a Turing paired project focused on React fundamentals, Router, async data, Cypress, and deployment. It was later updated to use TMDB instead of a custom backend, with filtering, infinite scroll, and GitHub Pages hosting.

## Contributors

[William Phelps](https://github.com/williamphelps13) & [Hayley Witherell](https://github.com/hayleyw7)

Project designed by instructors at Turing School of Software & Design
