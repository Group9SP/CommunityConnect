# CommunityConnect - Migration from Lovable.dev to Local Development

## Codebase Overview

### Project Description
**CommunityConnect** (also branded as "Minority X-Change") is a web application that helps users discover and support verified minority-owned and Howard University-affiliated businesses. The platform provides business listings, search functionality, authentication, and business verification workflows.

### Technology Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: TanStack React Query 5.83.0
- **Backend/Database**: Supabase (PostgreSQL)
- **Form Handling**: React Hook Form 7.61.1 with Zod validation
- **Icons**: Lucide React

### Project Structure
```
CommunityConnect/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── AuthButton.tsx
│   │   ├── BusinessCard.tsx
│   │   ├── FilterSidebar.tsx
│   │   └── ReviewCard.tsx
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Homepage
│   │   ├── Browse.tsx       # Business listings
│   │   ├── BusinessDetail.tsx
│   │   ├── Auth.tsx         # Authentication
│   │   └── NotFound.tsx
│   ├── hooks/               # Custom React hooks
│   ├── integrations/
│   │   └── supabase/        # Supabase client & types
│   ├── lib/                 # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── supabase/               # Supabase migrations & config
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

### Key Features
1. **Business Discovery**: Browse and search minority-owned businesses
2. **Authentication**: User registration and login via Supabase Auth
3. **Business Profiles**: Business owners can create and manage profiles
4. **Verification System**: Business verification workflow (pending/verified/rejected)
5. **Filtering**: Filter businesses by category, price level, location, etc.
6. **Reviews**: Users can leave reviews for businesses

### Database Schema (Supabase)
- **profiles**: User profile information
- **user_roles**: Role-based access control (business_owner, customer)
- **business_profiles**: Business information and verification status
- **reviews**: User reviews for businesses
- Row Level Security (RLS) policies enabled for data protection

### Environment Variables Required
The application requires the following environment variables (configured in `.env`):
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
- `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID (optional, may be used for some features)

---

## Step-by-Step Migration Plan

### Step 1: Remove Lovable Tagger from Vite Configuration
**File**: `vite.config.ts`

The `lovable-tagger` plugin is currently imported and conditionally added in development mode. This is a Lovable.dev-specific development tool that adds metadata tags to components for their AI code generation system.

**Action**: Remove the import and plugin usage.

### Step 2: Remove Lovable Tagger Package Dependency
**File**: `package.json`

The `lovable-tagger` package is listed in `devDependencies`. This package is not needed for local development.

**Action**: Remove from `devDependencies` and run `npm install` to update `package-lock.json`.

**Note**: After removing from `package.json`, run `npm install` to update `package-lock.json` and remove the package from `node_modules`.

### Step 3: Update HTML Meta Tags
**File**: `index.html`

The HTML file contains Lovable.dev-specific meta tags for Open Graph and Twitter cards that reference Lovable's CDN images.

**Action**: Replace Lovable references with your own branding or remove them.

### Step 4: Update README.md
**File**: `README.md`

The current README is generic Lovable boilerplate that references Lovable.dev workflows and URLs.

**Action**: Replace with project-specific documentation including:
- Project description
- Local development setup instructions
- Environment variable configuration
- Available scripts
- Deployment instructions

### Step 5: Verify Environment Variables
**File**: `.env`

Ensure your `.env` file contains valid Supabase credentials. The current `.env` file appears to have Supabase configuration, but verify these are your own credentials (not shared/template values).

**Action**: 
- Verify Supabase credentials are correct
- Consider creating `.env.example` as a template (without actual secrets)
- Ensure `.env` is in `.gitignore` (it should be)

### Step 6: Test Local Development Setup
After making changes, verify the application runs correctly:

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Verify the app loads at `http://localhost:8080`
4. Test key features:
   - Homepage loads
   - Navigation works
   - Authentication flow
   - Business browsing

### Step 7: Update .gitignore (if needed)
Ensure `.env` is properly ignored. The current `.gitignore` includes `*.local` but should explicitly include `.env` for security.

---

## Detailed Migration Instructions

### 1. Remove Lovable Tagger from vite.config.ts

**Current code:**
```typescript
import { componentTagger } from "lovable-tagger";
// ...
plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
```

**Change to:**
```typescript
// Remove the import
// ...
plugins: [react()],
```

### 2. Remove Package Dependency

Run:
```bash
npm uninstall lovable-tagger
```

This will automatically update `package.json` and `package-lock.json`.

### 3. Update index.html Meta Tags

Replace Lovable.dev references:
- Line 13: `og:image` - Update to your own image URL or remove
- Line 16: `twitter:site` - Update to your Twitter handle or remove
- Line 17: `twitter:image` - Update to your own image URL or remove

### 4. Create New README.md

Replace the Lovable boilerplate with project-specific documentation. Include:
- Project overview
- Tech stack
- Prerequisites (Node.js version)
- Installation steps
- Environment setup
- Development commands
- Project structure overview

### 5. Verify Supabase Connection

Ensure your Supabase project is accessible:
- Check that `VITE_SUPABASE_URL` is correct
- Verify `VITE_SUPABASE_PUBLISHABLE_KEY` is valid
- Test database connection by running the app

---

## Post-Migration Checklist

- [ ] Removed `lovable-tagger` from `vite.config.ts`
- [ ] Removed `lovable-tagger` from `package.json`
- [ ] Updated `index.html` meta tags
- [ ] Created new `README.md` with project documentation
- [ ] Verified `.env` file has correct Supabase credentials
- [ ] Tested `npm install` works without errors
- [ ] Tested `npm run dev` starts successfully
- [ ] Verified application loads in browser
- [ ] Tested authentication flow
- [ ] Tested business browsing functionality
- [ ] Confirmed no console errors related to Lovable

---

## Development Commands

After migration, you can use these standard commands:

- `npm run dev` - Start development server (runs on port 8080)
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

---

## Troubleshooting

### Issue: Build fails after removing lovable-tagger
**Solution**: Ensure you've removed both the import and the plugin usage from `vite.config.ts`, and run `npm install` to update dependencies.

### Issue: Environment variables not loading
**Solution**: 
- Ensure `.env` file exists in project root
- Verify variable names start with `VITE_` prefix
- Restart dev server after changing `.env`

### Issue: Supabase connection errors
**Solution**:
- Verify Supabase credentials in `.env`
- Check Supabase project is active
- Ensure Supabase URL format is correct: `https://[project-id].supabase.co`

---

## Next Steps After Migration

1. **Set up version control**: Ensure git is properly configured
2. **Create deployment pipeline**: Set up CI/CD for your preferred hosting platform
3. **Environment management**: Set up separate environments (dev/staging/prod)
4. **Documentation**: Add code comments and JSDoc where needed
5. **Testing**: Consider adding unit/integration tests
6. **Type safety**: Generate Supabase types using `supabase gen types typescript`

---

## Additional Notes

- The codebase uses standard React/Vite patterns and should work independently of Lovable
- All UI components are from shadcn/ui, which is framework-agnostic
- Supabase integration is standard and doesn't depend on Lovable
- The project structure follows common React best practices

---

**Migration Date**: February 19, 2026  
**Migrated From**: Lovable.dev  
**Target Environment**: Local development with standard tooling
