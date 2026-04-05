# Contributing Guidelines

## Coding Standards
- Use TypeScript strict mode
- No direct Supabase calls in components
- All database calls must go through services/
- Add JSDoc for non-trivial functions

## Commit Standards
- feat:
- fix:
- docs:
- refactor:

## Pull Request Requirements
- Must not reduce type safety
- Must not bypass RLS
- Must include documentation updates if behavior changes
