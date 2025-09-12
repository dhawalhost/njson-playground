# njson playground

Interactive playground to experiment with the `njson` library. It now runs fully in the browser via Go WASM, so it can be deployed to GitHub Pages.

## Features

- Edit a JSON document in the left pane
- Run Get queries (njson path syntax) and view results and types
- Set values at a path (supports string/number/bool/null/object/array)
- Delete values at a path
- Modern, responsive UI

## Run locally (WASM)

1. Build the WASM and runtime into `web/`:

```bash
GOOS=js GOARCH=wasm go build -o web/main.wasm ./wasm
# Copy runtime; path may differ on managed toolchains. Common paths:
#  $(go env GOROOT)/misc/wasm/wasm_exec.js
#  $(brew --prefix golang)/libexec/misc/wasm/wasm_exec.js
#  $(go env GOTOOLDIR)/../misc/wasm/wasm_exec.js
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" web/wasm_exec.js || \
cp "$(brew --prefix golang)/libexec/misc/wasm/wasm_exec.js" web/wasm_exec.js || \
cp "$(dirname $(go env GOTOOLDIR))/misc/wasm/wasm_exec.js" web/wasm_exec.js
```

2. Serve the `web/` folder with any static server (Python example):

```bash
cd web
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

Notes:

- Requires Go >= 1.23.10 (because `github.com/dhawalhost/njson@v1.4.1`).
- Paths follow njson syntax.

## Deploy to GitHub Pages

Already wired via GitHub Actions:

- Workflow: `.github/workflows/deploy.yml` builds `web/main.wasm`, copies `wasm_exec.js`, and publishes the `web/` directory to Pages.
- On push to `main`, it will build and deploy automatically.

First time setup in GitHub UI:

1) Settings → Pages → Build and deployment → Source: GitHub Actions.
2) Push to `main` and wait for the "Deploy GitHub Pages" workflow to finish.
3) Your site will be at `https://<your-username>.github.io/<repo>/`.
