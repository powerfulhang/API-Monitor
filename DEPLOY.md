# ccstatusline-mimo Deployment Guide

## Overview

Custom Claude Code status line based on [ccstatusline](https://github.com/sirmalloc/ccstatusline),
with MiMo Token Plan credit tracking widget.

**Status line output example:**
```
Model: MiMo-V2.5-Pro | Context: [████░░░░░░░░░░░░] 262k/1049k (25%) | Ctx Used: 25.0% | Credits: 106.0K (in:50.0K out:3.0K) | Session: 2m
```

## Prerequisites

- Windows 10/11
- Node.js LTS (v18+) — https://nodejs.org/
- Claude Code CLI installed

## Quick Deploy

### 1. Install Node.js

```powershell
winget install OpenJS.NodeJS.LTS
```

After install, restart your terminal so `node` and `npm` are in PATH.

### 2. Extract project

Extract this archive to your preferred location, e.g.:
```
D:\Working\ccstatusline-mimo\
```

### 3. Install dependencies

```powershell
cd D:\Working\ccstatusline-mimo
npm install --legacy-peer-deps
```

### 4. Configure Claude Code

Add the following to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "cmd /c D:/Working/ccstatusline-mimo/run.cmd"
  }
}
```

> Adjust the path if you extracted to a different location.

### 5. Configure widgets (optional)

Edit `~/.config/ccstatusline/settings.json` to customize which widgets are shown.
The included default shows: Model, Context Bar, Context %, MiMo Credits, Session Time.

## MiMo Credit Rates

| Model            | Input (credits/token) | Output (credits/token) |
|------------------|-----------------------|------------------------|
| MiMo-V2.5-Pro   | 2                     | 2                      |
| MiMo-V2-Pro      | 2                     | 2                      |
| MiMo-V2.5        | 1                     | 1                      |
| MiMo-V2-Omni     | 1                     | 1                      |
| MiMo-V2-Flash    | 0.5                   | 0.5                    |

To modify rates, edit `src/widgets/MimoCredit.ts` and rebuild.

## Customization

### Add/remove widgets

Edit `~/.config/ccstatusline/settings.json`. Available widget types include:
- `model` — Model name
- `context-bar` — Progress bar (supports `progress`, `progress-short`, `slider`, `slider-only`)
- `context-percentage` — Context usage percentage
- `mimo-credit` — MiMo credit consumption (custom widget)
- `session-clock` — Session duration
- `session-cost` — USD cost (Claude pricing, not accurate for MiMo)
- `tokens-input` / `tokens-output` / `tokens-total` — Token counts
- `git-branch` / `git-changes` — Git info
- `thinking-effort` — Current thinking effort level
- `compaction-counter` — Context compaction count

### Change color

Set `"color"` on any widget: `"cyan"`, `"green"`, `"yellow"`, `"magenta"`, `"red"`, `"white"`, `"brightBlack"`, etc.

### Multi-line status line

The `"lines"` array in settings.json supports multiple arrays for multi-line display.

## Troubleshooting

**Status line not appearing:**
- Verify Node.js is installed: `node --version`
- Test manually: `echo {} | cmd /c D:\Working\ccstatusline-mimo\run.cmd`
- Check settings.json syntax is valid JSON

**BOM / encoding issues:**
- The project includes a BOM-stripping fix in `src/ccstatusline.ts`
- If you see JSON parse errors, ensure input is piped via `cmd /c` (not PowerShell direct pipe)

**Revert to old status line:**
Remove the `statusLine` field from `~/.claude/settings.json`, or restore from backup.

## File Structure

```
ccstatusline-mimo/
├── src/
│   ├── widgets/
│   │   ├── MimoCredit.ts      ← Custom MiMo credit widget
│   │   ├── index.ts           ← Widget exports (modified)
│   │   └── ...                ← Original ccstatusline widgets
│   ├── utils/
│   │   ├── widget-manifest.ts ← Widget registry (modified)
│   │   └── ...
│   ├── ccstatusline.ts        ← Entry point (BOM fix applied)
│   └── ...
├── run.cmd                    ← Windows launch script
├── DEPLOY.md                  ← This file
└── package.json
```
