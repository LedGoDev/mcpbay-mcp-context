---
name: rbac-permissions
description: Complete reference for the RBAC permission system — roles, permission identifiers, database schema, RLS policies, frontend hooks, components, and server utilities. Read PERMISSIONS.md first.
title: RBAC Permission System Reference
mimeType: text/markdown
---

# RBAC Permission System

Profitable uses a **Role-Based Access Control (RBAC)** system with automatic synchronization at the database level via PostgreSQL triggers.

## Architecture Overview

The core design stores **effective permissions** directly in `organization_members.permissions` (a `text[]` column), avoiding costly joins at query time. A database trigger (`recalculate_member_permissions`) keeps this column in sync whenever roles, role definitions, or direct permissions change.

### Data Flow

```
organization_roles (custom role definitions)
        |
        v
organization_member_roles (member <-> role assignments)
        |
        +--- UNION ---> organization_members.permissions (text[])
        |
organization_member_permissions (direct per-member grants)
        |
        v
Frontend: PermissionProvider (React Context)
        |
        +---> <Can> component (declarative JSX)
        +---> usePermissions() hook (programmatic)
        +---> Layout: sidebar filtering & route guards
        |
Backend: checkPermission() utility (server-compatible)
```

## Roles

| Role | Source | Description |
|------|--------|-------------|
| `admin` | `organization_members.role` | Full access — trigger assigns `*` wildcard automatically |
| `member` | `organization_members.role` | Base role; permissions come from custom roles + direct grants |
| Custom roles | `organization_roles` table | Per-organization named roles (e.g. "Editor", "Viewer"), each with its own `permissions` JSONB array |

## Database Schema

### `public.organization_roles`
Custom role definitions, created per-organization.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID PK` | Default `gen_random_uuid()` |
| `organization_id` | `UUID FK` | References `organizations(id)` ON DELETE CASCADE |
| `name` | `TEXT NOT NULL` | Role display name |
| `permissions` | `JSONB NOT NULL DEFAULT '[]'` | Array of permission strings (e.g. `["kanbans:view", "forms:create"]`) |
| `created_at` / `updated_at` | `TIMESTAMPTZ` | Auto timestamps |
| **UNIQUE** | `(organization_id, name)` | |

### `public.organization_member_roles`
Junction table linking members to custom roles.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID PK` | Default `gen_random_uuid()` |
| `organization_id` | `UUID FK` | References `organizations(id)` ON DELETE CASCADE |
| `member_id` | `UUID FK` | References `profiles(id)` ON DELETE CASCADE |
| `role_id` | `UUID FK` | References `organization_roles(id)` ON DELETE CASCADE |
| `created_at` | `TIMESTAMPTZ` | Auto timestamp |
| **UNIQUE** | `(organization_id, member_id, role_id)` | |

### `public.organization_member_permissions`
Stores direct permission grants to individual members (bypasses roles).

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID PK` | Default `gen_random_uuid()` |
| `organization_id` | `UUID FK` | References `organizations(id)` ON DELETE CASCADE |
| `member_id` | `UUID FK` | References `profiles(id)` ON DELETE CASCADE |
| `permission` | `TEXT NOT NULL` | Single permission string (e.g. `"storage:upload"`) |
| `created_at` | `TIMESTAMPTZ` | Auto timestamp |
| **UNIQUE** | `(organization_id, member_id, permission)` | |

### `public.organization_members` (core table)

| Column | Type | Description |
|--------|------|-------------|
| `role` | `TEXT` | `'admin'` or `'member'` |
| `permissions` | `JSONB` | **Effective permissions array** — auto-maintained by trigger. Admins get `["*"]`. |

## Database Function: `get_user_organization_permissions`

Returns the union of direct + role-based permissions for a user:

```sql
SELECT p.permission FROM organization_member_permissions p WHERE ...
UNION
SELECT jsonb_array_elements_text(r.permissions)
FROM organization_roles r
JOIN organization_member_roles mr ON r.id = mr.role_id WHERE ...
```

Uses `SECURITY DEFINER` to bypass RLS.

## Database Function: `is_org_admin`

Used by RLS policies to check if the current user is an org admin:

```sql
RETURNS boolean
RETURN EXISTS (
  SELECT 1 FROM organization_members
  WHERE organization_id = org_id AND user_id = auth.uid() AND role = 'admin'
);
```

Defined in `20260528112624_fix-s3-settings-rls.sql:4-18`.

## Row-Level Security (RLS)

| Table | SELECT | INSERT/UPDATE/DELETE |
|-------|--------|---------------------|
| `organization_roles` | Any member can view | Only admins |
| `organization_member_roles` | Any member can view | Only admins |
| `organization_member_permissions` | Any member can view | Only admins |
| `organization_s3_settings` | Any member can view | Only admins |
| `org_home_widgets` | Any member | Any member |

RLS policies use EXISTS subqueries on `organization_members` (no expensive joins).

## Permission Identifiers

Defined as constants in `src/types/permissions.ts:5-60`. All follow the pattern `resource:action`.

### Kanbans
| Constant | Identifier |
|----------|-----------|
| `KANBANS_VIEW` | `kanbans:view` |
| `KANBANS_CREATE` | `kanbans:create` |
| `KANBANS_EDIT` | `kanbans:edit` |
| `KANBANS_DELETE` | `kanbans:delete` |
| `KANBANS_MANAGE_COLUMNS` | `kanbans:manage_columns` |

### Members & Roles
| Constant | Identifier |
|----------|-----------|
| `MEMBERS_VIEW` | `members:view` |
| `MEMBERS_INVITE` | `members:invite` |
| `MEMBERS_REMOVE` | `members:remove` |
| `ROLES_VIEW` | `roles:view` |
| `ROLES_MANAGE` | `roles:manage` |
| `PERMISSIONS_MANAGE` | `permissions:manage` |

### Forms
| Constant | Identifier |
|----------|-----------|
| `FORMS_VIEW` | `forms:view` |
| `FORMS_CREATE` | `forms:create` |
| `FORMS_EDIT` | `forms:edit` |
| `FORMS_DELETE` | `forms:delete` |
| `FORMS_RESPONSES_VIEW` | `forms:responses_view` |

### Databases
| Constant | Identifier |
|----------|-----------|
| `DATABASES_VIEW` | `databases:view` |
| `DATABASES_CREATE` | `databases:create` |
| `DATABASES_EDIT` | `databases:edit` |
| `DATABASES_DELETE` | `databases:delete` |

### Storage
| Constant | Identifier |
|----------|-----------|
| `STORAGE_VIEW` | `storage:view` |
| `STORAGE_UPLOAD` | `storage:upload` |
| `STORAGE_EDIT` | `storage:edit` |
| `STORAGE_DELETE` | `storage:delete` |
| `STORAGE_MANAGE_BUCKETS` | `storage:manage_buckets` |

### Diagrams
| Constant | Identifier |
|----------|-----------|
| `DIAGRAMS_VIEW` | `diagrams:view` |
| `DIAGRAMS_CREATE` | `diagrams:create` |
| `DIAGRAMS_EDIT` | `diagrams:edit` |
| `DIAGRAMS_DELETE` | `diagrams:delete` |

### Home / Dashboard
| Constant | Identifier |
|----------|-----------|
| `HOME_VIEW` | `home:view` |
| `HOME_MANAGE` | `home:manage` |

### Connections & Integrations
| Constant | Identifier |
|----------|-----------|
| `CONNECTIONS_VIEW` | `connections:view` |
| `CONNECTIONS_MANAGE` | `connections:manage` |
| `INTEGRATIONS_VIEW` | `integrations:view` |
| `INTEGRATIONS_MANAGE` | `integrations:manage` |

### Calendars
| Constant | Identifier |
|----------|-----------|
| `CALENDARS_VIEW` | `calendars:view` |
| `CALENDARS_MANAGE` | `calendars:manage` |

**Type**: `Permission` = union of all 32+ identifiers (`src/types/permissions.ts:62`)

**Wildcard**: `"*"` grants all permissions (auto-assigned to admins).

**Permission Groups**: Organized by UI section with Spanish labels in `PERMISSION_GROUPS` at `src/types/permissions.ts:66-118`.

## Frontend Permission Checking

### `PermissionProvider` (React Context)

**File**: `src/components/providers/permission-provider.tsx`

Wraps the organization layout and exposes:

```typescript
interface PermissionContextType {
  permissions: string[];    // Effective permission strings
  roles: any[];             // Custom roles assigned to user
  isAdmin: boolean;         // Whether user has role='admin'
  isLoading: boolean;
  organization: any;
  profile: any;
  user: any;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  refreshPermissions: () => Promise<void>;
}
```

**Permission check logic** (lines 101-116):
- `hasPermission`: `true` if `isAdmin`, or permissions include `"*"`, or the specific string is in the array
- `hasAnyPermission`: `true` if admin, wildcard, or **any** listed permission matches
- `hasAllPermissions`: `true` if admin, wildcard, or **all** listed permissions match

### `usePermissions()` Hook

**File**: `src/components/providers/permission-provider.tsx:139-145`

Consumes the context. Throws if used outside `PermissionProvider`.

### `<Can>` Component

**File**: `src/components/auth/can.tsx`

Declarative conditional rendering based on permissions:

```tsx
// Single permission
<Can permission={PERMISSIONS.FORMS_CREATE}>
  <button>New Form</button>
</Can>

// Any of the listed permissions
<Can any={[PERMISSIONS.FORMS_CREATE, PERMISSIONS.FORMS_EDIT]}>
  <button>Manage</button>
</Can>

// All listed permissions required
<Can all={[PERMISSIONS.FORMS_VIEW, PERMISSIONS.FORMS_CREATE]}>
  <button>Full Access</button>
</Can>

// With fallback UI when denied
<Can permission={PERMISSIONS.STORAGE_EDIT} fallback={<DisabledButton />}>
  <button>Edit</button>
</Can>
```

### Route-Level Enforcement

**File**: `src/app/organizations/[id]/layout.tsx`

- **Sidebar filtering** (line 175): `navItems` are filtered by `hasPermission(item.permission)`
- **Route guard** (lines 155-173): If the current path matches a nav item and the user lacks its permission, redirect to `/organizations/{orgId}/home`
- **Page-level redirect** (e.g. forms/new/page.tsx:69): `useEffect` redirects if the user lacks the creation permission

### Page-Level Usage Patterns

1. **Redirect guard**: `useEffect` with `router.push()` when permission is missing
2. **Conditional rendering**: `<Can>` wraps action buttons, links, and controls
3. **Disabled links**: `href="#"` + `cursor-not-allowed` + `e.preventDefault()` when permission denied
4. **Hidden navigation**: Sidebar items filtered by permission

## Server Permission Checking

### `checkPermission(orgId, permission)`

**File**: `src/utils/permissions.ts:7-31`

Async function suitable for server actions. Fetches the current user, queries `organization_members.permissions`, and checks for `"*"` or exact match.

### `checkSectionPermission(orgId, sectionName, permission)`

**File**: `src/utils/permissions.ts:55-62`

Legacy bridge — maps old section+action labels (Spanish) to the new permission identifiers.

### `getSectionPermissions(orgId, sectionName)`

**File**: `src/utils/permissions.ts:64-99`

Returns a `Record<string, boolean>` combining admin status, wildcard status, and all mapped permissions for a section.

## Integration Tokens & Bots

Tokens are unified with the member system:
1. Each token links to a profile with `is_bot = true`
2. The bot is a regular `organization_members` record
3. It can have custom roles and direct permissions
4. Permissions are read from its `organization_members.permissions` column, same as human users
5. API Gateway uses `validate_integration_token` RPC for validation

## Permission Management UI

- **Members & Roles Page** (`src/app/organizations/[id]/members/page.tsx`): Kanban board for inviting members, creating/deleting custom roles, assigning members to roles via drag-and-drop
- **Permissions Page** (`src/app/organizations/[id]/members/permissions/page.tsx`): Generic Kanban (`SectionPermissionsKanban.tsx`) for granting permissions to members and roles
- Admins are shown as locked in all permission columns

## Adding a New Permission

1. Add constant to `PERMISSIONS` in `src/types/permissions.ts`
2. Optionally add to `PERMISSION_GROUPS` for UI visibility
3. Use in frontend: `<Can permission={PERMISSIONS.NEW_PERM}>` or `hasPermission(PERMISSIONS.NEW_PERM)`
4. Use in backend: `await checkPermission(orgId, PERMISSIONS.NEW_PERM)`

## Key Files

| File | Purpose |
|------|---------|
| `migrations/20260530130000_refactor_permissions_system.sql` | Creates RBAC tables, RLS policies, `get_user_organization_permissions` function |
| `migrations/20260528112624_fix-s3-settings-rls.sql` | Creates `is_org_admin` function, S3 settings RLS |
| `src/types/permissions.ts` | Permission constants, `Permission` type, `PERMISSION_GROUPS` |
| `src/components/providers/permission-provider.tsx` | React context provider, `usePermissions()` hook |
| `src/components/auth/can.tsx` | Declarative `<Can>` component |
| `src/utils/permissions.ts` | Server-compatible `checkPermission()`, legacy helpers |
| `src/app/organizations/[id]/layout.tsx` | Sidebar nav filtering, route guards |
| `src/app/organizations/[id]/members/page.tsx` | Members & Roles Kanban UI |
| `src/components/permissions/SectionPermissionsKanban.tsx` | Generic permission assignment UI |
| `PERMISSIONS.md` | Developer documentation for the RBAC system |
