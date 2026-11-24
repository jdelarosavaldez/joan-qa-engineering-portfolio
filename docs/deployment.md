# GitHub Pages deployment

The site is a static HTML/CSS/JavaScript page. The workflow packages only the public site entry point, stylesheet, script, and self-hosted font assets into `dist/`; it does not publish repository documents, scripts, or planning files.

## First-time setup

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Merge the deployment pull request after review.
4. Open **Actions → Deploy portfolio to GitHub Pages** and confirm the run on `main` succeeds.
5. The expected project site URL is [https://jdelarosavaldez.github.io/joan-qa-engineering-portfolio/](https://jdelarosavaldez.github.io/joan-qa-engineering-portfolio/).

Pull requests run the packaging job to check that the site artifact can be assembled. They do not deploy. A push to `main` or a manual workflow run packages and deploys the site.

## Local preview

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open [http://127.0.0.1:8000/](http://127.0.0.1:8000/). Python serves the static files for local preview; the site itself is written in HTML, CSS, and JavaScript.

## Limits

- This workflow does not configure a custom domain or Cloudflare.
- The public site contains only the selected website files, not the rest of this public source repository.
- A successful GitHub Actions run is the deployment evidence; do not claim the site is live before that run succeeds.
