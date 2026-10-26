# shotlist

Capture full-page screenshots of a list of URLs.

## Install

```bash
npm install -g shotlist
```

## Usage

```bash
shotlist urls.txt --out shots/ --width 1440 --full-page
```

| Flag | What it does | Default |
|---|---|---|
| `-d, --out <dir>` | Where screenshots are written | `shots` |
| `-w, --width <px>` | Viewport width | `1280` |
| `--full-page` | Capture the whole page | off |
