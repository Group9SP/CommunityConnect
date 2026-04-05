# Technical Debt and Risk Assessment

## Part 1: Significant Technical Debt Items

### Item 1: Hardcoded Mock Data Instead of Database Integration
**Category:** Architectural Debt  
**Description:** The `Browse.tsx` and `BusinessDetail.tsx` pages use hardcoded sample data arrays instead of fetching real data from the Supabase database. The database schema exists (business_profiles, profiles, user_roles tables) and migrations are in place, but the frontend components ignore this infrastructure entirely. The Browse page has a static array of 4 businesses, and BusinessDetail ignores the URL parameter `id` and always displays the same hardcoded business data. This creates a complete disconnect between the data layer and presentation layer, making the application non-functional for real-world use.
**Remediation Plan:** 
1. Create service layer functions in `src/services/` (e.g., `businessService.ts`) to abstract Supabase queries
2. Implement React Query hooks using `useQuery` for fetching businesses list and individual business details
3. Replace hardcoded arrays in Browse.tsx with `useQuery('businesses', fetchBusinesses)`
4. Update BusinessDetail.tsx to use `useQuery(['business', id], () => fetchBusinessById(id))`
5. Add loading states, error handling, and empty states for when no data is available
6. Implement pagination for the businesses list

---

### Item 2: Complete Absence of Test Coverage
**Category:** Test Debt  
**Description:** The codebase has zero test files - no unit tests, integration tests, or end-to-end tests. There are no test configuration files (Jest, Vitest, Playwright, etc.) in the project structure. This is particularly critical for AI-generated code where "trust but verify" protocols are essential. Components like `Auth.tsx` contain complex authentication logic with multiple database operations (signup, profile creation, role assignment) that have no verification mechanisms. Business logic, form validation, and data transformations are all untested, creating significant risk for regressions and bugs in production.
**Remediation Plan:**
1. Set up Vitest (recommended for Vite projects) with React Testing Library
2. Create unit tests for utility functions, custom hooks, and service layer functions
3. Write component tests for critical UI components (Auth, BusinessCard, FilterSidebar)
4. Add integration tests for authentication flows (login, signup, logout)
5. Implement E2E tests using Playwright for critical user journeys (browse businesses, view details, authentication)
6. Add test coverage reporting with a minimum 70% coverage target
7. Set up CI/CD pipeline to run tests on every commit
8. Create test data fixtures and mocks for Supabase client

---

### Item 3: Lack of Service Layer and API Abstraction
**Category:** Architectural Debt  
**Description:** Database operations are directly embedded in React components (e.g., `Auth.tsx` lines 65-68, 114-123, 137-159, `AuthButton.tsx` lines 24-26, 39). Components directly import and call `supabase` client methods, creating tight coupling between UI and data access. This violates separation of concerns, makes components difficult to test, and prevents easy swapping of data sources. Business logic (like the signup flow that creates user → profile → role) is mixed with UI logic, making it impossible to reuse or test independently. There's no centralized error handling, retry logic, or data transformation layer.
**Remediation Plan:**
1. Create `src/services/` directory with service modules:
   - `authService.ts` - handle all authentication operations
   - `businessService.ts` - handle business CRUD operations
   - `profileService.ts` - handle user profile operations
2. Move all Supabase calls from components into service functions
3. Implement consistent error handling and data transformation in services
4. Create custom React hooks (e.g., `useAuth`, `useBusinesses`) that wrap service calls with React Query
5. Add request/response type definitions for all service methods
6. Implement service-level caching and retry strategies
7. Refactor components to only call service hooks, never directly accessing Supabase client

---

### Item 4: React Query Installed But Completely Unused
**Category:** Architectural Debt  
**Description:** `@tanstack/react-query` is installed as a dependency and `QueryClient` is configured in `App.tsx`, but no components actually use `useQuery` or `useMutation` hooks. All data fetching is either hardcoded (Browse, BusinessDetail) or uses direct async/await with useState (Auth, AuthButton). This means the application lacks caching, automatic refetching, background updates, optimistic updates, and request deduplication - all features that React Query provides. The QueryClientProvider wrapper is essentially dead code, providing no value while adding bundle size.
**Remediation Plan:**
1. Replace all direct Supabase calls in components with React Query hooks
2. Create query key factories for consistent cache key management (e.g., `queryKeys.businesses()`, `queryKeys.business(id)`)
3. Implement `useQuery` for all read operations (fetching businesses, user profile, business details)
4. Implement `useMutation` for all write operations (signup, login, create business, update profile)
5. Add query invalidation strategies (e.g., invalidate businesses list after creating a new business)
6. Configure QueryClient with appropriate defaults (staleTime, cacheTime, retry logic)
7. Add React Query DevTools for development debugging
8. Remove unused QueryClientProvider if React Query adoption is not planned (but adoption is recommended)

---

### Item 5: Missing Documentation and Code Traceability
**Category:** Documentation Debt  
**Description:** The README.md is generic Lovable boilerplate with no project-specific information about the business domain, architecture decisions, or setup instructions. There are no code comments explaining complex business logic (e.g., the multi-step signup process in Auth.tsx, the verification status workflow). There's no traceability back to original Agile requirements or user stories. The codebase lacks JSDoc comments, architecture decision records (ADRs), or API documentation. The Supabase types file is empty (all tables show `never`), indicating the database schema types are not properly generated or documented. This makes the codebase difficult for new developers to understand, especially for AI-generated code where the original intent may not be obvious.
**Remediation Plan:**
1. Rewrite README.md with:
   - Project overview and business domain explanation
   - Architecture diagram and component structure
   - Local development setup instructions
   - Environment variables documentation
   - Database schema overview
2. Add JSDoc comments to all service functions, custom hooks, and complex business logic
3. Document the authentication flow, business verification process, and user role system
4. Create ADRs for key architectural decisions (e.g., why Supabase, why React Query, component structure)
5. Generate and maintain Supabase TypeScript types using `supabase gen types typescript`
6. Add inline comments explaining non-obvious code (e.g., why certain RLS policies exist, business rule rationale)
7. Create a CONTRIBUTING.md with coding standards and development workflow
8. Link code comments to original requirements/user stories where applicable
9. Document the relationship between database tables and how they relate to business entities

---

### Item 6: Non-Functional Filter System -- Resolved by Destiny (Lab 2 Submission)
**Category:** Architectural Debt  
**Description:** The `FilterSidebar` component in `Browse.tsx` renders filter UI (checkboxes for verification status, categories, price range, ratings) but the `onFilterChange` callback is never actually used to filter the businesses list. The `filters` state in Browse.tsx is initialized as an empty object and never updated, and the hardcoded businesses array is always displayed regardless of filter selections. The search input in the header also has no functionality. This creates a poor user experience where filters appear to work but don't actually affect the displayed results.
**Remediation Plan:**
1. Implement filter state management in Browse.tsx to track selected filters
2. Connect FilterSidebar checkboxes and sliders to update filter state
3. Create a filtering function that applies filters to the businesses query
4. Update the Supabase query in the service layer to accept filter parameters
5. Implement search functionality that queries business name, category, and description fields
6. Add URL query parameters to persist filter state (e.g., `?category=restaurant&verified=true`)
7. Implement debounced search input to avoid excessive API calls
8. Add "Clear Filters" functionality
9. Show active filter count/badges to users

---

### Item 7: Empty Supabase TypeScript Types -- Resolved by Karis (Lab 2 Submission)
**Category:** Architectural Debt  
**Description:** The `src/integrations/supabase/types.ts` file has a Database type definition where all tables, views, functions, and enums are typed as `never`, meaning TypeScript provides no type safety for database operations. Despite having a complete database schema with tables (profiles, user_roles, business_profiles) and enums (app_role), the TypeScript types don't reflect this structure. This means all Supabase queries are untyped, losing the benefits of TypeScript's type checking and autocomplete for database operations. Developers must manually remember table names and column types, leading to runtime errors that could be caught at compile time.
**Remediation Plan:**
1. Run Supabase CLI command to generate types: `supabase gen types typescript --local > src/integrations/supabase/types.ts` (or use remote database)
2. Set up automated type generation in package.json scripts that runs after migrations
3. Verify generated types match the actual database schema
4. Update all Supabase queries throughout the codebase to use proper typed queries (e.g., `supabase.from<'business_profiles'>`)
5. Create type aliases for commonly used table types (e.g., `type BusinessProfile = Tables<'business_profiles'>`)
6. Add type guards for runtime type checking where needed
7. Document the type generation process in README.md

---

---

## Part 2: Critical Risks

### Risk 1: Type Mismatch Between Empty TypeScript Types and Actual Database Schema
- **Category:** Reliability/Hallucination
- **Description:** The `src/integrations/supabase/types.ts` file defines all database tables as `never` types, while the actual database has a complete schema (profiles, user_roles, business_profiles tables, app_role enum). AI agents (Planner/Coder) may hallucinate correct table names and column structures when generating code, but TypeScript won't catch mismatches at compile time. For example, an AI might generate `supabase.from('business_profile')` (singular) instead of `'business_profiles'` (plural), or reference non-existent columns like `business_name` vs `name`. These errors will only surface at runtime, potentially causing production failures. The signup flow in `Auth.tsx` directly inserts into tables without type checking, so incorrect column names or types could silently fail or corrupt data.
- **Impact:** High - Runtime errors in production, data corruption risk, difficult debugging, loss of TypeScript's primary safety benefits
- **Mitigation Strategy:** 
  1. Immediately generate correct Supabase types using CLI: `supabase gen types typescript --local > src/integrations/supabase/types.ts`
  2. Set up automated type generation in CI/CD pipeline that runs after every migration
  3. Add pre-commit hooks to verify types are up-to-date
  4. Create a type validation test that compares generated types against actual database schema
  5. Update all existing Supabase queries to use typed queries with proper table/column names
  6. Add ESLint rules to prevent untyped Supabase queries

---

### Risk 2: Race Condition and Partial State in Multi-Step Signup Flow
- **Category:** Reliability/Hallucination
- **Description:** The signup process in `Auth.tsx` (lines 114-177) performs three sequential database operations: (1) create auth user, (2) create profile, (3) assign role. If step 2 or 3 fails after step 1 succeeds, the application is left in an inconsistent state - a user exists in `auth.users` but has no profile or role record. AI agents may not recognize this as a critical failure path and could generate code that doesn't handle rollback scenarios. Additionally, there's no transaction wrapping these operations, so partial failures create orphaned records. The error handling only shows a toast message but doesn't attempt cleanup, leaving the database in an invalid state that could prevent the user from retrying signup or cause authentication issues.
- **Impact:** High - Data integrity violations, user account creation failures, potential security issues if orphaned auth users can't be properly managed, poor user experience
- **Mitigation Strategy:**
  1. Wrap the entire signup flow in a database transaction or use Supabase database functions that handle all three operations atomically
  2. Implement a cleanup function that deletes the auth user if profile/role creation fails
  3. Add retry logic with exponential backoff for transient failures
  4. Create a background job or manual process to identify and clean up orphaned auth users
  5. Add database constraints or triggers to prevent orphaned records
  6. Implement comprehensive error logging to track partial signup failures
  7. Add integration tests that simulate failure scenarios at each step

---

### Risk 3: Privacy Violation Through Overly Permissive RLS Policy
- **Category:** Security & Ethics
- **Description:** The Row Level Security (RLS) policy on the `profiles` table (migration line 64-67) allows ALL authenticated users to view ALL profiles: `USING (true)`. This means any logged-in user can query and retrieve personal information (full_name, avatar_url, created_at) for every user in the system, creating a significant privacy violation. While this might have been generated for convenience during development, it exposes sensitive user data. Additionally, the `business_profiles` table allows any authenticated user to view verified businesses, but there's no rate limiting or access control, potentially allowing data scraping. The application also lacks input sanitization for user-generated content - fields like `full_name`, `business_name`, and `description` are stored as TEXT without validation, creating XSS risks if this data is rendered without proper escaping (though React typically handles this, it's not guaranteed for all rendering paths).
- **Impact:** High - GDPR/privacy compliance violations, potential data breach, user trust erosion, legal liability, XSS vulnerabilities if user content is rendered unsafely
- **Mitigation Strategy:**
  1. Restrict profile visibility policy to only show profiles that users have explicit permission to view (e.g., mutual connections, public profiles only)
  2. Implement field-level privacy controls (e.g., users can mark profile fields as private)
  3. Add input validation and sanitization for all user-generated content using libraries like DOMPurify
  4. Implement rate limiting on database queries to prevent data scraping
  5. Add audit logging for sensitive data access
  6. Review and restrict all RLS policies to follow principle of least privilege
  7. Add Content Security Policy (CSP) headers to prevent XSS attacks
  8. Conduct a security audit of all RLS policies and update documentation

---

### Risk 4: Hard Dependency on Lovable.dev Platform-Specific Tooling
- **Category:** Dependency Risk
- **Description:** The project has a hard dependency on `lovable-tagger` package (vite.config.ts line 4, 12) which is a Lovable.dev-specific development tool. The build configuration conditionally includes this plugin in development mode, but the dependency is still required in package.json. If Lovable.dev changes their API, discontinues the service, or modifies the tagger interface, the project could break. Additionally, the README.md references Lovable.dev URLs and workflows as the primary development method, creating vendor lock-in. The project structure and some code patterns (like the component organization) may be optimized for Lovable's AI code generation workflow rather than standard React development practices, making it difficult to migrate away from the platform.
- **Impact:** Medium - Vendor lock-in, potential build failures if Lovable changes, difficulty migrating to other development workflows, reduced team flexibility
- **Mitigation Strategy:**
  1. Make `lovable-tagger` dependency optional by wrapping it in try-catch and providing fallback behavior
  2. Document that the tagger is development-only and not required for production builds
  3. Create alternative development workflows that don't depend on Lovable.dev
  4. Regularly audit Lovable-specific code and refactor to use standard React/TypeScript patterns
  5. Set up monitoring/alerts for when Lovable dependencies update
  6. Create a migration plan to remove Lovable dependencies if needed
  7. Update README.md to include standard development workflows alongside Lovable instructions

---

### Risk 5: No Input Validation or Sanitization for Business Data
- **Category:** Security & Ethics
- **Description:** The application accepts user input for business profiles (business_name, description, address, phone, website) without server-side validation or sanitization. While client-side Zod validation exists for authentication forms, there's no validation layer for business profile creation/updates. Malicious users could inject SQL-like strings, XSS payloads, or extremely long strings that could cause database issues or UI rendering problems. The `website` field in particular accepts any string format without URL validation, which could be used for phishing if displayed as clickable links. Additionally, the verification status system relies on manual review, but there's no validation that prevents users from submitting fake or misleading business information, which could introduce bias or fraud into the platform.
- **Impact:** Medium - XSS vulnerabilities, data quality issues, potential for fraud/misrepresentation, phishing risks, database performance issues from malformed data
- **Mitigation Strategy:**
  1. Implement server-side validation using Supabase Edge Functions or database constraints
  2. Add Zod schemas for all business profile fields with appropriate validation rules (URL format, length limits, character restrictions)
  3. Sanitize all user input before storing in database using libraries like validator.js
  4. Implement content moderation for business descriptions to prevent spam/abuse
  5. Add URL validation and display warnings for non-standard website formats
  6. Create a verification workflow that requires documentation before business approval
  7. Add rate limiting on business profile creation to prevent spam
  8. Implement audit trails for all business profile changes

---

### Risk 6: AI-Generated Code May Miss Edge Cases in Error Handling
- **Category:** Reliability/Hallucination
- **Description:** AI agents generating code may focus on happy paths and miss critical error scenarios. For example, in `Auth.tsx`, the signup flow handles errors for each database operation individually but doesn't consider network timeouts, concurrent signup attempts with the same email, or Supabase service outages. The `AuthButton.tsx` component checks for session on mount but doesn't handle the case where the session expires during user interaction. AI-generated code often lacks comprehensive error boundaries, so a single component failure could crash the entire application. The hardcoded data in Browse/BusinessDetail pages means there's no error handling for data fetching at all - if these were connected to real APIs, network failures would cause blank screens with no user feedback.
- **Impact:** Medium - Poor user experience during failures, application crashes, data loss, difficulty debugging production issues
- **Mitigation Strategy:**
  1. Implement React Error Boundaries at the route level to catch and handle component errors gracefully
  2. Add comprehensive error handling for all async operations with user-friendly error messages
  3. Implement retry logic with exponential backoff for transient failures
  4. Add loading states and skeleton screens for all data-fetching operations
  5. Create error logging service (e.g., Sentry) to track and alert on production errors
  6. Write test cases specifically for error scenarios and edge cases
  7. Add timeout handling for all network requests
  8. Implement fallback UI states (empty states, error states) for all data-dependent components

---

## Summary

This codebase shows signs of rapid AI-assisted development with a functional database schema but incomplete integration between the data layer and presentation layer. The most critical issues are the hardcoded data (Item 1), lack of testing (Item 2), and missing service layer abstraction (Item 3). Addressing these three items would transform the application from a prototype into a production-ready system. The React Query underutilization (Item 4) and documentation gaps (Item 5) are also significant blockers for maintainability and scalability.

**Critical Risks Summary:** The highest priority risks are the privacy violation from overly permissive RLS policies (Risk 3) and the type mismatch issue (Risk 1), both of which could cause production failures or compliance violations. The race condition in signup (Risk 2) poses immediate data integrity concerns. Dependency risks (Risk 4) and input validation gaps (Risk 5) require attention but are lower priority for immediate remediation.
