# ClinIQ — AI-Assisted Clinical Decision Support

A React web app that uses Claude AI to help doctors with differential diagnosis, investigations, and treatment planning.

> **Warning**: This app calls the Anthropic API directly from the browser using `anthropic-dangerous-direct-browser-access`. This is suitable for local development and personal use only. For production, route API calls through a backend server.

## Setup

```bash
# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Edit .env and add your Anthropic API key

# Start dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | Your Anthropic API key |

## Features

- 5-step patient intake wizard (particulars, complaints, history, examination, systemic)
- AI-powered differential diagnosis with confidence scoring
- Symptomatic and definitive treatment planning
- Investigation checklist with priority badges
- Printable prescription pad with `window.print()` support
- Dark clinical UI theme, mobile responsive

## Stack

- Vite + React
- Custom CSS-in-JS (no UI library)
- IBM Plex Sans + IBM Plex Mono fonts
- Claude claude-sonnet-4-20250514 via Anthropic Messages API
