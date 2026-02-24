# CommunityConnect

**Discover and support verified minority-owned and Howard University-affiliated businesses.**

CommunityConnect (also branded as "Minority X-Change") is a web platform that connects users with verified minority-owned businesses and Howard University-affiliated entrepreneurs. The platform provides business discovery, authentication, verification workflows, and review capabilities.

## Business Domain Explanation
The platform operates around three primary actors:

- **Visitors** – Can browse public business listings
- **Authenticated Users** – Can create and manage business profiles
- **Administrators** – Can approve or reject business verification requests

Core domain concepts:
- Business discovery
- Role-based access control
- Business verification lifecycle
- Secure authentication

## Features

- 🔍 **Business Discovery**: Browse and search minority-owned businesses by category, location, price level, and more
- ✅ **Verification System**: Verified business profiles with pending/verified/rejected status workflow
- 👤 **User Authentication**: Secure registration and login via Supabase Auth
- 📝 **Business Profiles**: Business owners can create and manage detailed profiles
- ⭐ **Reviews**: Users can leave reviews and ratings for businesses
- � **Advanced Filtering**: Filter by category, price level, languages, minority-owned status, and Howard affiliation

## Technology Stack and Architecture Overview

- **Frontend**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: TanStack React Query 5.83.0
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm) for version management)
- npm or yarn
- A Supabase account and project

## Installation

### 1. Clone the Repository

```bash
git clone <YOUR_REPO_URL>
cd CommunityConnect
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

**How to get Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select an existing one
3. Go to Project Settings > API
4. Copy the Project URL → `VITE_SUPABASE_URL`
5. Copy the `anon` `public` key → `VITE_SUPABASE_PUBLISHABLE_KEY`
6. Copy the Project ID → `VITE_SUPABASE_PROJECT_ID`

### 4. Set Up Database

The project includes Supabase migrations in the `supabase/` directory. Run these migrations in your Supabase project:

1. Go to Supabase Dashboard > SQL Editor
2. Run the migration files in order (check `supabase/migrations/`)

Or use the Supabase CLI:
```bash
supabase db push
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── AuthButton.tsx
│   ├── BusinessCard.tsx
│   ├── FilterSidebar.tsx
│   └── ReviewCard.tsx
├── pages/               # Route pages
│   ├── Index.tsx        # Homepage
│   ├── Browse.tsx       # Business listings
│   ├── BusinessDetail.tsx # Business detail page
│   ├── Auth.tsx         # Authentication
│   └── NotFound.tsx
├── hooks/               # Custom React hooks
├── integrations/
│   └── supabase/        # Supabase client & types
├── lib/                 # Utility functions
├── types/               # TypeScript type definitions
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint configured with React hooks rules
- Components use functional components with hooks
- Styling via Tailwind CSS utility classes

### Key Files

- `src/App.tsx` - Main application component with routing
- `src/integrations/supabase/client.ts` - Supabase client configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration

## Deployment

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Deploy Options

- **Vercel**: Connect your Git repository, set environment variables, deploy
- **Netlify**: Connect repository, set build command `npm run build`, set publish directory `dist`
- **Supabase Hosting**: Use Supabase's built-in hosting
- **Any static host**: Upload `dist/` folder contents

### Environment Variables for Production

Ensure your production environment has the same `.env` variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Database Schema

The application uses the following Supabase tables:

- **profiles**: User profile information
- **user_roles**: Role-based access control (business_owner, customer)
- **business_profiles**: Business information and verification status
- **reviews**: User reviews for businesses

Row Level Security (RLS) policies are enabled for data protection.

## Data Relationships

profiles.id → references auth.users.id

user_roles.user_id → references profiles.id

business_profiles.owner_id → references profiles.id

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amezing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Add your license here]

## Support

For issues and questions, please open an issue in the repository.

---

**Built with** ❤️ using React, Vite, and Supabase
