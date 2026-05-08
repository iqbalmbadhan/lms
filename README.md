# AI Business Solutions Academy

A full-stack, production-grade Learning Management System (LMS) built for business professionals. Features persona-based dashboards, an AI-powered tutor, a course marketplace with revenue sharing, and three distinct role systems — Learner, Author, and Super Admin.

---

## Platform Overview

### Three User Roles

| Role | Access |
|---|---|
| **Learner** | Persona dashboard, course catalog, AI tutor, checkout |
| **Author** | Author Studio — create and sell courses, track earnings, request payouts |
| **Super Admin** | Full platform control — users, authors, courses, revenue, AI settings |

### Nine Business Personas (Learner)

Each learner is assigned a business persona on registration. The persona controls which modules they see, what content is recommended, and how the AI tutor responds.

| Persona | Focus Area |
|---|---|
| Executive Leadership | Strategy, ROI, leadership decisions |
| Product Owner | Roadmaps, backlog, AI-driven products |
| Business Analyst | Data, process automation, requirements |
| Customer Service | AI assistants, sentiment analysis, CX |
| Human Resources | Recruitment AI, workforce analytics |
| Finance | Financial modelling, fraud detection |
| Legal & Sourcing | Contract AI, compliance, procurement |
| Developer | AI APIs, LLMs, code generation |
| Governance | Risk, ethics, AI policy frameworks |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js + Express, TypeScript |
| Database | PostgreSQL + pgvector (semantic/vector search) |
| ORM | Prisma |
| Auth | NextAuth.js v5 — JWT, Credentials + Google OAuth |
| AI Layer | Anthropic Claude, OpenAI, Google Gemini, OpenRouter |
| Queue | BullMQ + Redis |
| File Storage | Cloudflare R2 (S3-compatible) |
| Infrastructure | Docker Compose, Nginx, PM2 |
| CI/CD | GitHub Actions → SSH deploy on push to main |

---

## Quick Start (Local)

### Prerequisites
- Node.js 20+
- Docker + Docker Compose

### 1. Clone and install
```bash
git clone <repo-url> && cd lms
npm install --workspace=apps/web
npm install --workspace=apps/api
```

### 2. Environment
```bash
cp .env.example .env
# Fill in at minimum: DATABASE_URL, NEXTAUTH_SECRET, and one AI key
```

### 3. Start database + Redis
```bash
cd docker && docker compose up -d
```

### 4. Enable pgvector
```bash
docker exec -it lms_postgres psql -U lms_user -d lms_db \
  -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 5. Migrate and seed
```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
ts-node prisma/seed.ts
```

### 6. Run dev servers
```bash
# Terminal 1
cd apps/api && npm run dev      # http://localhost:4000

# Terminal 2
cd apps/web && npm run dev      # http://localhost:3000
```

---

## Demo Accounts

Password for all accounts: `Demo@2025`

| Email | Role |
|---|---|
| `admin@aidemo.com` | Super Admin |
| `exec@aidemo.com` | Executive Leadership |
| `po@aidemo.com` | Product Owner |
| `ba@aidemo.com` | Business Analyst |
| `cs@aidemo.com` | Customer Service |
| `hr@aidemo.com` | Human Resources |
| `finance@aidemo.com` | Finance |
| `legal@aidemo.com` | Legal & Sourcing |
| `dev@aidemo.com` | Developer |
| `gov@aidemo.com` | Governance |

---

## AI Tutor

The platform uses a multi-provider AI backend. **Users see only a clean chat interface** — no provider name, no model name, no branding.

You control everything from **Admin Panel → AI Settings**:
- Pick your provider (Anthropic / OpenAI / Gemini / OpenRouter)
- Pick the specific model
- Save — takes effect immediately for all users, no redeploy needed

| Provider | Available Models |
|---|---|
| Anthropic Claude | Sonnet 4.5, Opus 4.5, Haiku 4.5 |
| OpenAI | GPT-4o, GPT-4o Mini, o1 Mini |
| Google Gemini | Gemini 2.0 Flash, 1.5 Pro, 1.5 Flash |
| OpenRouter | Llama 3.3 70B, DeepSeek R1, Mistral Large, Qwen 2.5, + more |

Only the provider you activate needs a valid API key set in `.env`.

---

## Course Marketplace & Revenue Sharing

### Author Flow
1. Any learner can apply to become an Author (bio, expertise, PayPal/bank details)
2. Super Admin reviews and approves the application
3. Author creates courses — free or paid with a custom price
4. Author submits course for approval
5. Super Admin approves and sets the **revenue split** (50–90% to author)
6. Course goes live on the catalog
7. Learners purchase via Stripe, PayPal, or Bank Transfer
8. Author tracks earnings and requests payouts

### Revenue Split (per sale)
When a learner purchases a course the system atomically:
- Marks the order as `COMPLETED`
- Creates the enrollment
- Splits the gross amount → Author cut + Platform cut
- Updates the author's running total earnings

Example: $100 course at 70% author split → Author earns $70, Platform keeps $30.

---

## Project Structure

```
lms/
├── apps/
│   ├── api/                          # Express REST API (port 4000)
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Full DB schema
│   │   │   └── seed.ts               # Demo data
│   │   └── src/
│   │       ├── routes/
│   │       │   ├── auth.routes.ts
│   │       │   ├── courses.routes.ts
│   │       │   ├── tutor.routes.ts
│   │       │   ├── admin.routes.ts    # Super Admin endpoints
│   │       │   ├── author.routes.ts   # Author Studio endpoints
│   │       │   ├── orders.routes.ts   # Checkout + atomic earnings split
│   │       │   ├── analytics.routes.ts
│   │       │   ├── catalog.routes.ts
│   │       │   ├── ideas.routes.ts
│   │       │   ├── prompts.routes.ts
│   │       │   └── governance.routes.ts
│   │       ├── middleware/
│   │       │   ├── auth.middleware.ts  # JWT verification
│   │       │   └── rbac.middleware.ts  # Role + module guards
│   │       └── services/ai/            # Multi-provider AI with SSE streaming
│   │
│   └── web/                          # Next.js 14 frontend (port 3000)
│       ├── app/
│       │   ├── (admin)/              # Super Admin panel (dark theme)
│       │   │   └── admin/
│       │   │       ├── page.tsx           # Platform stats
│       │   │       ├── users/             # User management
│       │   │       ├── authors/           # Author application review
│       │   │       ├── courses/           # Course approvals + revenue split slider
│       │   │       ├── revenue/           # Revenue overview
│       │   │       ├── payouts/           # Payout processing
│       │   │       └── settings/          # AI provider + model control
│       │   ├── (author)/             # Author Studio
│       │   │   └── author/
│       │   │       ├── page.tsx           # Earnings dashboard
│       │   │       ├── courses/new/       # Course creation form
│       │   │       ├── earnings/          # Transaction history
│       │   │       └── payouts/           # Payout requests
│       │   ├── (dashboard)/          # Learner area
│       │   │   ├── dashboard/             # Persona dashboard
│       │   │   ├── courses/               # Course browser + lesson player
│       │   │   ├── tutor/                 # AI chat (clean, no branding)
│       │   │   ├── catalog/               # Solution catalog
│       │   │   ├── ideas/                 # Idea studio
│       │   │   ├── prompts/               # Prompt library
│       │   │   ├── governance/            # Governance hub
│       │   │   ├── analytics/             # Analytics
│       │   │   ├── apply-author/          # Author application form
│       │   │   └── checkout/              # Purchase flow + bank transfer pending
│       │   └── (auth)/               # Login + Register
│       ├── lib/
│       │   ├── auth.ts               # NextAuth config
│       │   ├── persona.ts            # 9 persona definitions (single source of truth)
│       │   └── api-client.ts         # Typed fetch wrapper
│       └── types/
│           └── next-auth.d.ts        # Session type augmentation
│
├── docker/
│   ├── docker-compose.yml            # PostgreSQL (pgvector) + Redis, localhost-only
│   └── nginx/default.conf            # Reverse proxy + SSE buffering disabled
├── .github/workflows/deploy.yml      # Auto-deploy on push to main
├── ecosystem.config.js               # PM2: 2x Next.js cluster + 1x Express fork
└── .env.example                      # All required environment variables
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://lms_user:password@localhost:5432/lms_db

# Auth
NEXTAUTH_SECRET=your-random-secret-min-32-chars
NEXTAUTH_URL=https://yourdomain.com
API_URL=http://localhost:4000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI Providers — only set the key for the provider you activate
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
OPENROUTER_API_KEY=

# Fallback provider if none saved in DB yet
DEFAULT_AI_PROVIDER=ANTHROPIC

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# File Storage (Cloudflare R2)
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_ACCESS_KEY=
CLOUDFLARE_R2_SECRET_KEY=
CLOUDFLARE_R2_ENDPOINT=

# Queue
REDIS_URL=redis://localhost:6379
```

---

## Production Deployment (Hostinger VPS)

```bash
# 1. SSH into your VPS
ssh root@your-vps-ip

# 2. Install Node.js 20, Docker, PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs docker.io docker-compose
npm install -g pm2

# 3. Clone and install
git clone <repo-url> /var/www/lms && cd /var/www/lms
npm install --workspace=apps/web
npm install --workspace=apps/api

# 4. Configure environment
cp .env.example .env && nano .env

# 5. Start database + Redis
cd docker && docker compose up -d

# 6. Migrate database
cd /var/www/lms/apps/api
npx prisma migrate deploy
npx prisma generate
ts-node prisma/seed.ts

# 7. Build both apps
npm run build --workspace=apps/web
npm run build --workspace=apps/api

# 8. Start with PM2
cd /var/www/lms && pm2 start ecosystem.config.js
pm2 save && pm2 startup

# 9. SSL
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

After first deployment, any `git push` to `main` triggers GitHub Actions which SSH's into the VPS and redeploys automatically.

---

## API Reference (Summary)

| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/login` | Public |
| POST | `/auth/register` | Public |
| GET | `/courses` | Learner |
| POST | `/tutor/sessions` | Learner |
| POST | `/tutor/sessions/:id/stream` | Learner |
| GET | `/catalog` | Learner |
| POST | `/orders` | Learner |
| POST | `/orders/:id/confirm` | Learner |
| POST | `/author/apply` | Learner |
| GET/POST | `/author/courses` | Author |
| GET | `/author/earnings` | Author |
| POST | `/author/payouts` | Author |
| GET | `/admin/stats` | Super Admin |
| GET/PATCH | `/admin/users/:id` | Super Admin |
| GET/POST | `/admin/authors/:id` | Super Admin |
| GET/POST | `/admin/courses/:id` | Super Admin |
| GET | `/admin/revenue` | Super Admin |
| GET/PUT | `/admin/settings/ai` | Super Admin |
| GET/PUT | `/admin/payouts/:id` | Super Admin |
