# API Monitor

API Monitor is a Claude Code status line formatter focused on local API usage visibility. It is a maintained fork of [`sirmalloc/ccstatusline`](https://github.com/sirmalloc/ccstatusline), with a default layout tuned for model identity, context usage, API credit cost, API call count, git state, and session time.

This repository keeps upstream attribution in [AUTHORS](AUTHORS), [NOTICE](NOTICE), and [LICENSE](LICENSE). Fork-specific changes are tracked in [CHANGELOG.md](CHANGELOG.md).

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Made with Bun](https://img.shields.io/badge/Made%20with-Bun-000000.svg?logo=bun)
![Repository](https://img.shields.io/badge/GitHub-powerfulhang%2FAPI--Monitor-blue)

## What It Shows

The default API Monitor status line is intentionally compact:

```text
mimo-v2.5-pro[1m] | [ ᗧ••••••••••••••••] 50k/1000k (5%) | CNY 0.1200 | API Calls: 0 | main | (+0,-0) | 0m
```

Core additions in this fork:

- **Pac-Man context progress**: context usage can render as a compact Pac-Man style bar.
- **API credit cost**: provider-aware CNY cost calculation for supported model providers.
- **API call count**: transcript-derived call count for the current Claude Code session.
- **MiMo and DeepSeek provider detection**: provider/rate matching is centralized in `src/utils/api-providers.ts`.
- **Windows-friendly output**: generated status line output avoids ambiguous currency glyphs by using `CNY`.

The project still includes the broader upstream `ccstatusline` widget system: git widgets, token widgets, usage timers, Powerline rendering, custom commands, links, and a React/Ink TUI.

## Status

This is a personal/API-monitoring-focused fork rather than the upstream npm package. The code can run directly from this checkout, or be built into `dist/ccstatusline.js` for local Claude Code usage.

The original upstream package is `ccstatusline` by Matthew Breedlove:

- Upstream repository: <https://github.com/sirmalloc/ccstatusline>
- Upstream author: Matthew Breedlove / [`@sirmalloc`](https://github.com/sirmalloc)

## Quick Start

Install dependencies:

```bash
bun install
```

Run the interactive configuration TUI:

```bash
bun run start
```

Test renderer mode with the bundled sample payload:

```bash
bun run example
```

Build the local Node-compatible status line script:

```bash
bun run build
```

The build writes:

```text
dist/ccstatusline.js
```

`dist/` is intentionally ignored by Git. Rebuild it locally when needed.

## Claude Code Configuration

For local development, point Claude Code at the built script:

```json
{
  "statusLine": {
    "type": "command",
    "command": "node \"F:\\Working Files\\Coding\\API-Monitor\\dist\\ccstatusline.js\"",
    "padding": 0,
    "refreshInterval": 10
  }
}
```

Claude Code settings are usually stored at:

```text
%USERPROFILE%\.claude\settings.json
```

The status line layout itself is stored by this tool at:

```text
%USERPROFILE%\.config\ccstatusline\settings.json
```

The project includes [settings.example.json](settings.example.json) as a portable API Monitor layout example. Do not commit your personal Claude Code settings.

## Configuration Layout

The default API Monitor layout is defined in [src/types/Settings.ts](src/types/Settings.ts) and mirrored in [settings.example.json](settings.example.json). The key widgets are:

- `model`
- `context-bar` with `metadata.display = "pacman"`
- `api-credit`
- `api-call-count`
- `git-branch`
- `git-changes`
- `session-clock`

The Pac-Man bar supports metadata:

```json
{
  "display": "pacman",
  "width": "18"
}
```

Set `"ascii": "true"` in metadata if a terminal cannot render the Unicode Pac-Man/pellet characters cleanly.

## Development

Use Bun commands consistently:

```bash
bun run lint
bun test
bun run build
```

Useful files:

- [src/ccstatusline.ts](src/ccstatusline.ts): entry point for TUI and piped renderer modes.
- [src/widgets/ContextBar.ts](src/widgets/ContextBar.ts): context progress widget, including Pac-Man mode.
- [src/widgets/ApiCredit.ts](src/widgets/ApiCredit.ts): API credit widget.
- [src/widgets/ApiCallCount.ts](src/widgets/ApiCallCount.ts): API call count widget.
- [src/utils/api-providers.ts](src/utils/api-providers.ts): provider detection and CNY rate definitions.
- [src/widgets/shared/progress-bar.ts](src/widgets/shared/progress-bar.ts): progress bar renderers.

More details are in:

- [docs/USAGE.md](docs/USAGE.md)
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- [docs/WINDOWS.md](docs/WINDOWS.md)

## Repository Hygiene

Committed:

- source files under `src/`
- tests
- docs
- example settings
- GitHub workflow files
- screenshots used by docs
- Bun lockfile

Ignored:

- `node_modules/`
- `dist/`
- `.claude/`
- `.vscode/`
- `run.cmd`
- `log/`
- `package-lock.json`
- local backup files

## Attribution And Contributors

This fork is based on `ccstatusline`.

- Original author: Matthew Breedlove, [`@sirmalloc`](https://github.com/sirmalloc)
- Original repository: <https://github.com/sirmalloc/ccstatusline>
- Current fork maintainer: powerfulhang, [`@powerfulhang`](https://github.com/powerfulhang)

GitHub's **Contributors** graph is generated from commit authorship. Because this fork was imported as a new repository, the upstream author may not appear in GitHub's graph unless upstream commits are preserved in history. Attribution is therefore maintained explicitly in this README, [AUTHORS](AUTHORS), [NOTICE](NOTICE), and `package.json`.

## License

MIT. See [LICENSE](LICENSE).

The upstream copyright notice is retained. Fork-specific changes are maintained in this repository under the same license.
