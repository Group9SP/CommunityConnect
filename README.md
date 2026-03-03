# Minority X-Change

A platform for discovering and supporting verified minority-owned and Howard University-affiliated businesses. Connect with authentic entrepreneurs making a difference in our community.

## Project Overview

**Minority X-Change** (also branded as "Community Connect") empowers communities through authentic discovery, trusted reviews, and special support for minority-owned businesses. In light of recent rollbacks to diversity, equity, and inclusion (DEI) initiatives, this platform shines a spotlight on minority-owned businesses and connects them directly with conscious consumers.

## Features

- 🔍 **Business Discovery**: Browse and search verified minority-owned businesses
- 📋 **Detailed Profiles**: View comprehensive business information with reviews and ratings
- ✅ **Verification System**: Trusted verification status for businesses
- ⭐ **Reviews & Ratings**: User-generated reviews and ratings
- 🎯 **Filtering**: Filter businesses by category, location, and more
- 🔐 **User Authentication**: Secure signup and login system

## Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **UI Components**: shadcn-ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: TanStack Query (React Query) 5.83.0
- **Backend/Database**: Supabase (PostgreSQL)
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- Git

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd equity-spot-38895
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory (or verify the existing one) with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn-ui components
│   ├── AuthButton.tsx
│   ├── BusinessCard.tsx
│   ├── FilterSidebar.tsx
│   └── ReviewCard.tsx
├── pages/              # Route pages
│   ├── Index.tsx      # Landing page
│   ├── Browse.tsx     # Business listing page
│   ├── BusinessDetail.tsx
│   ├── Auth.tsx       # Authentication page
│   └── NotFound.tsx
├── integrations/
│   └── supabase/      # Supabase client & types
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── assets/            # Static assets
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Database Setup

The project uses Supabase for the backend. Database migrations are located in `supabase/migrations/`.

Ensure you have:
1. Access to the Supabase project
2. Correct environment variables set in `.env`
3. Database migrations applied (usually handled automatically by Supabase)

## Deployment

This application can be deployed to various platforms:

- **Vercel**: Excellent for Vite + React apps
- **Netlify**: Good support for static sites
- **Cloudflare Pages**: Fast CDN and edge computing
- **AWS Amplify**: Full-stack deployment

Build the application:
```bash
npm run build
```

The `dist/` directory contains the optimized static assets ready for deployment.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Add your license here]

## Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ for supporting minority-owned businesses
