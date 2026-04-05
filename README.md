# CommunityConnect (Minority X-Change)

Discover and support verified minority-owned and Howard University-affiliated businesses. Connect with authentic entrepreneurs making a difference in our community.

## Tech Stack

- **Vite** - Build tool
- **TypeScript** - Type safety
- **React 18** - UI framework
- **shadcn-ui** - Component library
- **Tailwind CSS** - Styling
- **Supabase** - Backend (auth, database)
- **React Query** - Server state management

## Prerequisites

- Node.js 18+ (recommend [nvm](https://github.com/nvm-sh/nvm))
- npm

## Local Development

```sh
# 1. Clone and navigate to the project
cd CommunityConnect

# 2. Install dependencies
npm install

# 3. Configure environment variables (see below)

# 4. Start the development server
npm run dev
```

The app runs at **http://localhost:8080**.

## Environment Variables

Create a `.env` file in the project root with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

Get these from your [Supabase project settings](https://supabase.com/dashboard/project/_/settings/api).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
