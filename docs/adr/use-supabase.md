# ADR 001: Use Supabase as Backend

## Status
Accepted

## Context
The project requires authentication, database storage, and role-based access.

## Decision
Use Supabase to consolidate:
- Postgres database
- Authentication
- Row-Level Security (RLS)

## Consequences
+ Simplifies backend architecture
+ Built-in auth and RLS
- Vendor lock-in risk
