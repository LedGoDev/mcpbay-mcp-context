---
name: explain_architecture
description: Explains the LedGo platform architecture, request flow, and module relationships in detail.
---

# LedGo Platform Architecture Explanation

The LedGo platform is organized into {{depth}} depth architectural layers:

1. **Client Layer** — The SDK (`@ledgo/sdk`) or direct HTTP calls from AI agents and applications
2. **API Layer** — RESTful endpoints organized by module (kanbans, forms, databases, diagrams, widgets, storage)
3. **Auth Layer** — Bearer token validation via `validate_integration_token` RPC
4. **Business Logic Layer** — Edge Function on InsForge that routes requests, checks permissions, and processes data
5. **Data Layer** — PostgreSQL with Row-Level Security and trigger-based permission synchronization

Key architectural patterns:
- All operations are scoped to an organization (org ID in URL path)
- The SDK handles automatic snake_case ↔ camelCase conversion via axios interceptors
- Permissions are stored as `text[]` in `organization_members` with wildcard `*` for admins
- Behind the scenes, the InsForge edge function validates the token, checks member permissions, and delegates to the appropriate handler
