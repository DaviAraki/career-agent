# Career Agent with Mastra

## Overview

A modular AI-powered career chatbot built with **Mastra**, **TypeScript**, and **React**. It answers recruiter questions about Davi Araki's background, reads structured resume data, and allows recruiters to send a contact message directly.

This project demonstrates how I design modular AI applications using TypeScript, Mastra, tool-calling, structured data, and frontend integration.

## Why I Built This

- To showcase clean AI product architecture in a public, readable codebase.
- To give recruiters an interactive way to explore my background.
- To demonstrate Mastra agent design, tool construction, and workflow orchestration.

## Features

- AI agent that answers career questions using structured data
- Four tools: read resume, read projects, read skills, send contact message
- Deterministic contact workflow with email validation
- Embeddable React chat widget with suggested prompts
- Contact form for recruiters to send messages
- Zod validation on all inputs
- CORS and rate limiting

## Architecture

```
davi-araki.dev/lab
        ↓
Embedded Career Chat Widget
        ↓
Career Agent API (Hono)
        ↓
Mastra Career Agent (DeepSeek)
        ↓
Tools:
  - readResume
  - readProjects
  - readSkills
  - sendContactMessage
        ↓
Structured career data (JSON) + Resend email
```

## Tech Stack

- **Mastra** — AI agent and workflow framework
- **TypeScript** — strict mode, no `any`
- **pnpm** — monorepo workspace
- **React + Vite** — widget and demo
- **Tailwind CSS** — widget styling
- **Hono** — API server
- **Zod** — input validation
- **Resend** — email delivery
- **Vitest** — unit tests

## Repository Structure

```
career-agent-mastra/
  apps/
    api/           Mastra backend (agent, tools, workflows, routes)
    widget/        React chat widget component library
    demo/          Vite demo app
  packages/
    career-data/   Structured JSON (resume, projects, skills, FAQ)
    shared/        Zod schemas and TypeScript types
  specs/           Specification document
```

## Local Development

```bash
pnpm install
cp .env.example .env
# Fill in your .env values
pnpm dev
```

The API starts on `http://localhost:4111` and the demo on `http://localhost:5173`.

## Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek LLM API key |
| `MASTRA_LOG_LEVEL` | Logging level (info, debug) |
| `CONTACT_EMAIL` | Recipient email for contact form |
| `RESEND_API_KEY` | Resend email API key |
| `EMAIL_FROM` | Verified sender email for Resend |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window |

## Security Considerations

- Email recipient is fixed via `CONTACT_EMAIL` env var — never from user input
- All inputs validated with Zod schemas
- HTML content sanitized before email insertion
- CORS restricted to allowed origins
- No secrets committed to the repository
- Tools read only bundled JSON data — no filesystem access
- Agent instructions forbid revealing internals or inventing data

## Deployment

The API can be deployed to any Node.js-compatible platform. The demo can be deployed to Vercel, Netlify, or similar static hosts.

To embed in the portfolio:

```tsx
<iframe
  src="https://your-demo-url.com"
  title="Career Agent"
  className="h-[680px] w-full rounded-2xl border"
/>
```

Or import the widget directly:

```tsx
import { CareerChatWidget } from '@career-agent/widget';

<CareerChatWidget apiBaseUrl="https://your-api-url.com" />
```

## Future Improvements

- Add streaming responses
- Add RAG for longer case studies
- Add memory for returning visitors
- Add analytics for recruiter questions
- Add evaluation tests
- Add job-description fit analysis
- Turn widget into reusable npm package
