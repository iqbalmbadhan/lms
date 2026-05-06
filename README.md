# AI Business Solutions Academy — LMS Platform

A persona-based Learning Management System with AI Tutor, Solution Catalog, Prompt Library, Idea Studio, and Governance Hub.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router, TypeScript, Tailwind CSS) |
| Backend API | Node.js + Express (TypeScript) |
| ORM | Prisma with PostgreSQL |
| AI Layer | Multi-provider: Anthropic Claude, OpenAI, Google Gemini, OpenRouter |
| Vector Search | pgvector PostgreSQL extension |
| Cache / Queue | Redis + BullMQ |
| File Storage | Cloudflare R2 |
| Auth | NextAuth.js v5 (JWT, Credentials + Google OAuth) |
| Infrastructure | Docker Compose + Nginx + PM2 |

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js 20+
- Docker + Docker Compose

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your values (at minimum set ANTHROPIC_API_KEY)
```

### 3. Start Database + Redis
```bash
cd docker && docker compose up -d
```

### 4. Enable pgvector extension
```bash
docker exec -it lms_postgres psql -U lms_user -d lms_db -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 5. Install Dependencies
```bash
npm install --workspace=apps/web
npm install --workspace=apps/api
```

### 6. Database Migrations + Seed
```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
ts-node prisma/seed.ts
```

### 7. Run Development Servers
```bash
# Terminal 1 — API
cd apps/api && npm run dev

# Terminal 2 — Web
cd apps/web && npm run dev
```

Open http://localhost:3000

## Demo Accounts

All demo users have password: `Demo@2025`

| Email | Role |
|---|---|
| exec@aidemo.com | Executive Leadership |
| po@aidemo.com | Product Owner |
| ba@aidemo.com | Business Analyst |
| cs@aidemo.com | Customer Service |
| hr@aidemo.com | Human Resources |
| finance@aidemo.com | Finance |
| legal@aidemo.com | Legal & Sourcing |
| dev@aidemo.com | Developer |
| gov@aidemo.com | Governance |

## Persona System

Each of the 9 personas sees a different dashboard, different navigation modules, and different content. The persona config is the single source of truth at `apps/web/lib/persona.ts`.

## AI Tutor — Multi-Provider

The AI Tutor supports 4 providers switchable at runtime:
- **Anthropic Claude** (default) — `claude-sonnet-4-5`
- **OpenAI** — `gpt-4o`
- **Google Gemini** — `gemini-2.0-flash`
- **OpenRouter** — access to 200+ models

Set `DEFAULT_AI_PROVIDER` in `.env` and add the corresponding API key.

## Production Deployment (Hostinger VPS)

See `docker/docker-compose.yml` for infrastructure, `docker/nginx/default.conf` for the reverse proxy, `ecosystem.config.js` for PM2, and `.github/workflows/deploy.yml` for CI/CD.

## Project Structure

```
ai-lms/
├── apps/web/          # Next.js 14 frontend
├── apps/api/          # Express REST API
├── docker/            # Docker Compose + Nginx config
├── .github/workflows/ # CI/CD pipeline
└── ecosystem.config.js # PM2 process manager
```
