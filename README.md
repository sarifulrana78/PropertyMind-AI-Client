# PropertyMind AI — Client

A production-ready AI-powered Real Estate Intelligence Platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **AI Property Advisor** — Conversational agent with 4 built-in tools (search, market stats, mortgage calc, compare)
- **AI Description Generator** — Auto-generate SEO-optimized listing descriptions & market reports
- **Properties Listing** — Full search, filter, sort, pagination (4 cards/row)
- **Property Details** — Gallery, specs, reviews, AI market report, related listings
- **Market Analytics** — Interactive Recharts dashboards with real-time data
- **Authentication** — JWT + demo login + Google OAuth ready
- **Protected Routes** — Add/Manage property pages with redirect

## 🛠 Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (custom design system)
- **TanStack Query v5** (server state)
- **Framer Motion** (animations)
- **Recharts** (analytics charts)
- **React Hook Form + Zod** (form validation)
- **Groq SDK** (LLM via backend)

## 📦 Setup

```bash
cd client
npm install
cp .env.local.example .env.local
# Edit .env.local with your values
npm run dev
```

## 🔑 Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🎯 Demo Credentials

- Email: `demo@propertymind.ai`
- Password: `Demo@1234`

## 📁 Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components
├── contexts/      # React context (Auth)
├── hooks/         # TanStack Query hooks
├── lib/           # Utilities and API client
└── types/         # TypeScript interfaces
```
