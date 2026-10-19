---
name: architecture
description: Architecture overview of the LedGo platform — request flow, authentication, organization scoping, and module relationships.
title: Platform Architecture
mimeType: text/markdown
---

# Platform Architecture

## High-Level Flow

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  AI Agent   │────▶│  LedGo SDK       │────▶│  LedGo API      │
│  / Client   │     │  (@ledgo/sdk)    │     │  (REST + JSON)  │
└─────────────┘     └──────────────────┘     └─────────────────┘
                                                    │
                                                    ▼
                                            ┌─────────────────┐
                                            │  Edge Function   │
                                            │  (InsForge)      │
                                            │  - Auth Check    │
                                            │  - Perm Check    │
                                            │  - Route Handler │
                                            └────────┬────────┘
                                                     │
                                                     ▼
                                            ┌─────────────────┐
                                            │   PostgreSQL    │
                                            │  + RLS Policies │
                                            └─────────────────┘
```

## Authentication & Authorization

1. **Integration Token** — Generated in Organization Settings. Used as Bearer token in all requests.
2. **Validation** — The API validates the token via `validate_integration_token` RPC call.
3. **Scoping** — All operations are scoped to the organization ID in the URL path: `/organizations/{orgId}/...`
4. **RBAC** — Permissions are stored as `text[]` in `organization_members`. Admin role uses wildcard `*` permission. Permissions are synchronized via PostgreSQL triggers.

## Module Architecture

Each SDK module maps to a specific API path:

| Module | Base Path | Entities |
|--------|-----------|----------|
| Kanbans | `/kanbans/dashboards` | Dashboards, Columns, Panels, Cards |
| Forms | `/forms` | Forms, Responses |
| Databases | `/databases` | Databases, Records |
| Diagrams | `/diagrams` | Diagrams |
| Documents | `/documents` (project resolved from token) | Documents, Blocks |
| Widgets | `/widgets` | Widgets |
| Storage | `/storage/buckets/{bucket}/objects` | Files |

## Data Transformation

The SDK automatically handles **snake_case ↔ camelCase** conversion:
- **Outgoing**: SDK converts `camelCase` keys to `snake_case` before sending
- **Incoming**: SDK converts `snake_case` API responses to `camelCase` via axios interceptor

## Error Handling

The API returns standard HTTP status codes:
- `200` — Success
- `201` — Created
- `204` — Deleted (no content)
- `400` — Bad request
- `401` — Unauthorized (invalid/missing token)
- `403` — Forbidden (insufficient permissions)
- `404` — Not found
- `500` — Internal server error
