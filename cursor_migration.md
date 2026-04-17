# Codebase Migration Guide: Disconnecting from Lovable.dev

## Overview

This document provides a comprehensive guide to migrating this codebase from Lovable.dev to a fully independent local development environment. The application is a **Minority X-Change** platform - a marketplace for discovering and supporting verified minority-owned and Howard University-affiliated businesses.

## Codebase Overview

### Application Purpose
**Minority X-Change** (also branded as "Community Connect") is a web application that:
- Showcases verified minority-owned businesses
- Connects conscious consumers with authentic entrepreneurs
- Supports Howard University-affiliated businesses
- Provides business discovery, reviews, and verification features

### Technology Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **UI Components**: shadcn-ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: TanStack Query (React Query) 5.83.0
- **Backend/Database**: Supabase (PostgreSQL)
- **Form Handling**: React Hook Form 7.61.1 + Zod 3.25.76
- **Icons**: Lucide React
- **Charts**: Recharts 2.15.4

### Project Structure
```
equity-spot-38895/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn-ui components
│   │   ├── AuthButton.tsx
│   │   ├── BusinessCard.tsx
│   │   ├── FilterSidebar.tsx
│   │   └── ReviewCard.tsx
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Landing page
│   │   ├── Browse.tsx       # Business listing page
│   │   ├── BusinessDetail.tsx
│   │   ├── Auth.tsx         # Authentication page
│   │   └── NotFound.tsx
│   ├── integrations/
│   │   └── supabase/        # Supabase client & types
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── assets/              # Static assets
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── supabase/
│   └── migrations/          # Database migrations
├── public/                  # Public assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.app.json        # TypeScript configuration
├── package.json             # Dependencies
└── .env                     # Environment variables
```

### Key Features
1. **Business Discovery**: Browse and search minority-owned businesses
2. **Business Profiles**: Detailed business information with reviews
3. **Authentication**: User signup/login with Supabase Auth
4. **Verification System**: Business verification status workflow
5. **Reviews & Ratings**: User reviews for businesses
6. **Filtering**: Filter businesses by category, location, etc.

### External Dependencies
- **Supabase**: Backend-as-a-Service (Database, Auth, Storage)
  - Project ID: `gfofximpghlnjixdffkx`
  - URL: `https://gfofximpghlnjixdffkx.supabase.co`
  - Environment variables required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

## Lovable.dev Dependencies Identified

The following Lovable.dev-specific dependencies were found:

1. **`lovable-tagger` package** (devDependency)
   - Location: `package.json` line 77
   - Usage: `vite.config.ts` lines 4, 12
   - Purpose: Development tool for component tagging (Lovable-specific)

2. **README.md references**
   - Multiple references to Lovable.dev URLs and workflows
   - Instructions for using Lovable platform

3. **index.html meta tags**
   - Open Graph image: `https://lovable.dev/opengraph-image-p98pqg.png`
   - Twitter site: `@lovable_dev`
   - Twitter image: `https://lovable.dev/opengraph-image-p98pqg.png`

## Migration Steps

### Step 1: Remove Lovable Tagger from Vite Configuration

**File**: `vite.config.ts`

Remove the `lovable-tagger` import and usage:
- Remove import statement: `import { componentTagger } from "lovable-tagger";`
- Remove from plugins array: `mode === "development" && componentTagger()`

**Result**: The vite.config.ts will only use the React plugin.

### Step 2: Remove Lovable Tagger Package

**File**: `package.json`

Remove from devDependencies:
- Remove: `"lovable-tagger": "^1.1.11"`

**Action Required**: Run `npm install` after editing package.json to update node_modules.

### Step 3: Update README.md

**File**: `README.md`

Replace Lovable-specific content with standard project documentation:
- Remove Lovable project URL references
- Remove Lovable-specific editing instructions
- Add project-specific setup instructions
- Update deployment instructions to be platform-agnostic

### Step 4: Update index.html Meta Tags

**File**: `index.html`

Replace Lovable-specific meta tags:
- Replace Open Graph image URL with a project-specific image
- Update Twitter site handle (or remove if not applicable)
- Update Twitter image URL

**Note**: You'll need to host your own Open Graph image or remove these tags temporarily.

### Step 5: Verify Environment Variables

**File**: `.env`

Ensure the following variables are set:
```
VITE_SUPABASE_URL=https://gfofximpghlnjixdffkx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-key>
```

**Note**: The `.env` file already exists with Supabase credentials. Verify these are correct for your environment.

### Step 6: Install Dependencies

Run the following command to install all dependencies (without lovable-tagger):
```bash
npm install
```

### Step 7: Start Development Server

Run the development server:
```bash
npm run dev
```

The application should start on `http://localhost:8080` (as configured in vite.config.ts).

### Step 8: Verify Application Functionality

Test the following:
1. ✅ Application starts without errors
2. ✅ Homepage loads correctly
3. ✅ Navigation works
4. ✅ Authentication flow works
5. ✅ Business browsing works
6. ✅ Supabase connection is successful

## Post-Migration Checklist

- [ ] Remove `lovable-tagger` from vite.config.ts
- [ ] Remove `lovable-tagger` from package.json
- [ ] Run `npm install` to update dependencies
- [ ] Update README.md with project-specific documentation
- [ ] Update index.html meta tags
- [ ] Verify .env file has correct Supabase credentials
- [ ] Test application runs locally (`npm run dev`)
- [ ] Test build process (`npm run build`)
- [ ] Verify all routes work correctly
- [ ] Test Supabase integration (auth, database queries)

## Development Workflow

### Starting the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Environment Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- Git

### Initial Setup
1. Clone the repository
2. Navigate to project directory: `cd equity-spot-38895`
3. Install dependencies: `npm install`
4. Set up environment variables (`.env` file already exists)
5. Start development server: `npm run dev`

## Database Setup

The project uses Supabase for the backend. The database migrations are located in `supabase/migrations/`.

To set up the database:
1. Ensure you have access to the Supabase project
2. Run migrations if needed (usually handled by Supabase automatically)
3. Verify database schema matches the TypeScript types in `src/integrations/supabase/types.ts`

## Deployment Considerations

After migration, you can deploy this application to:
- **Vercel**: Excellent for Vite + React apps
- **Netlify**: Good support for static sites and serverless functions
- **Cloudflare Pages**: Fast CDN and edge computing
- **AWS Amplify**: Full-stack deployment
- **Self-hosted**: Any Node.js hosting environment

### Build Output
The `npm run build` command creates a `dist/` directory with optimized static assets that can be served by any static file server.

## Troubleshooting

### Issue: Application won't start
- Check Node.js version: `node --version` (should be v18+)
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for port conflicts (default port is 8080)

### Issue: Supabase connection errors
- Verify `.env` file has correct credentials
- Check Supabase project is active
- Verify network connectivity

### Issue: Build errors
- Check TypeScript errors: `npm run lint`
- Verify all imports are correct
- Check for missing dependencies

## Additional Notes

- The application uses path aliases (`@/` for `src/`) configured in `vite.config.ts` and `tsconfig.app.json`
- TypeScript strict mode is enabled
- ESLint is configured for code quality
- The project follows standard React best practices

## Support

For issues related to:
- **React/Vite**: Check [Vite Documentation](https://vitejs.dev/)
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **shadcn-ui**: Check [shadcn/ui Documentation](https://ui.shadcn.com/)

---

**Migration Date**: February 19, 2026
**Migration Status**: Ready for execution
