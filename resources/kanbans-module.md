---
name: kanbans-module
description: Complete reference for the Kanbans module — dashboards, columns, panels, and cards CRUD plus blueprint boards (external providers, public scope, and signed access links).
title: Kanbans Module Reference
mimeType: text/markdown
---

# Kanbans Module

The Kanbans module provides a full Kanban-style board management system with four entity types organized hierarchically:

```
Dashboard ───▶ Column ───▶ Panel ───▶ Card
                 │                     │
                 └───── Cards ────────┘
```

## Entities

### IKanbanDashboard
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `organizationId` | `string` | Parent organization |
| `name` | `string` | Display name |
| `cardTemplate` | `IFormField[]?` | Field definitions for card data model |
| `createdAt` | `string?` | ISO 8601 creation timestamp |
| `updatedAt` | `string?` | ISO 8601 update timestamp |

### IKanbanColumn
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `dashboardId` | `string` | Parent dashboard |
| `name` | `string` | Display name (e.g. "To Do", "In Progress") |
| `order` | `number` | 0-indexed position (left to right) |
| `stateUpdates` | `Record<string, any>?` | Auto-state rules when a card enters this column |
| `createdAt` / `updatedAt` | `string?` | Timestamps |

### IKanbanPanel
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `columnId` | `string` | Parent column |
| `title` | `string` | Display title |
| `order` | `number` | 0-indexed position within column |
| `color` | `string?` | Hex color code for visual identification |
| `stateUpdates` | `Record<string, any>?` | Auto-state rules when a card enters this panel |

### IKanbanCard
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `dashboardId` | `string` | Parent dashboard |
| `columnId` | `string` | Current column |
| `organizationId` | `string` | Owner organization |
| `data` | `Record<string, any>` | Custom field values per dashboard template |
| `order` | `number` | Position within container |
| `panelId` | `string?` | Optional panel membership |

## SDK Methods

### Dashboards
- `listDashboards()` → `IKanbanDashboard[]`
- `createDashboard({ name, cardTemplate? })` → `IKanbanDashboard`
- `updateDashboard(id, { name?, cardTemplate? })` → `IKanbanDashboard`
- `deleteDashboard(id)` → `void`

### Items (Columns, Panels, Cards)
- `listItems(dashboardId)` → `{ columns, panels, cards }`
- `getItem(id)` → `IKanbanCard | IKanbanColumn | IKanbanPanel`
- `createItem(dashboardId, type, payload)` → created entity
- `updateItem(id, type, payload)` → updated entity
- `deleteItem(id, type)` → `void`
- `moveItem(id, type, targetId, position)` → `void`

### Discriminated Types for Items

`KanbanItemType` enum: `COLUMN`, `PANEL`, `CARD`

Each type has its own payload interface:
- **Column**: `ICreateKanbanColumnPayload` — `{ name, order?, stateUpdates? }`
- **Panel**: `ICreateKanbanPanelPayload` — `{ columnId, title, color?, order?, stateUpdates? }`
- **Card**: `ICreateKanbanCardPayload` — `{ columnId, data, panelId?, order? }`

## Card Template System

Each dashboard can have a `cardTemplate` — an array of `IFormField` definitions that specify the data model for cards within that board. Common template fields:
- `title` (STRING, required) — Card title
- `description` (STRING, uiWidget: 'textarea') — Detailed description
- `status` (STRING, enum options) — Status tracking
- `priority` (STRING, enum: low/medium/high/critical)
- `assignee` (STRING) — Responsible person
- `dueDate` (STRING, format: 'date-time') — Deadline
- `effort` (INTEGER) — Estimated hours
- `tags` (STRING, uiWidget: 'select', options) — Categorization

## Kanban Blueprints

A **blueprint** is a dashboard (`boardType: "blueprint"`) whose columns, panels, and cards are rendered from an external provider instead of living in LedGo. The provider is configured through a server-only public config and the board can be exposed through a public route protected by signed access links.

```
Blueprint dashboard ──▶ public config (provider, mapping, actions) ──▶ public route ──▶ signed access link
```

### Enums

| Enum | Values |
|------|--------|
| `KanbanBoardType` | `standard`, `blueprint` |
| `KanbanScopeType` | `public`, `organization`, `project` |
| `KanbanProviderType` | `http`, `internal`, `ledgo-database`, `static` |
| `KanbanAuthMode` | `signed`, `none`, `forward-token` |
| `KanbanLinkScope` | `view`, `edit` |
| `KanbanWriteEventType` | `card_moved`, `card_action` |

### IKanbanPublicConfig (server-only)

| Field | Type | Description |
|-------|------|-------------|
| `dashboardId` | `string` | Configured dashboard |
| `organizationId` / `projectId` | `string \| null` | Owners |
| `providerType` | `KanbanProviderType` | Provider that feeds the board |
| `providerManifestUrl` | `string \| null` | Optional provider manifest URL |
| `params` | `IKanbanParamDefinition[]` | Parameters accepted by the public read endpoint |
| `readSource` | `IKanbanSource \| null` | Request used to read the board |
| `writeSource` | `IKanbanSource \| null` | Request used to write the board back |
| `mapping` | `IKanbanMapping` | Maps the provider response to columns/panels/cards |
| `cardActions` | `IKanbanCardAction[]` | Declarative actions offered by cards |
| `authMode` | `KanbanAuthMode` | Auth mode of provider requests |
| `allowWrite` | `boolean` | Whether public callers may write |
| `singleUse` | `boolean` | Whether each write consumes a single-use token |
| `embedAllowedOrigins` | `string[] \| null` | Origins allowed to embed the board |
| `refreshIntervalMs` | `number \| null` | Auto-refresh interval of the public board |

`IKanbanSource` is `{ url, method, headers, body, timeoutMs, auth }`; `auth` is `{ mode, headerName, secret }`. `IKanbanMapping` holds JSON paths (`columns`, `panels`, `cards`, `version`) plus field maps (`columnFields`, `panelFields`, `cardFields`). `IKanbanParamDefinition` is `{ id, label, type: string|number|boolean, required, defaultValue, description }`.

### IKanbanAccessLink

| Field | Type | Description |
|-------|------|-------------|
| `jti` | `string` | Unique identifier of the link |
| `dashboardId` | `string` | Bound dashboard |
| `scope` | `KanbanLinkScope` | Granted scope (`view` or `edit`) |
| `singleUse` | `boolean` | Whether it can only be used once |
| `usedAt` / `revokedAt` | `string \| null` | Consumption and revocation timestamps |
| `expiresAt` | `string` | Expiration timestamp |
| `useCount` / `maxUses` / `windowStartedAt` | number/string | Rate-limit window state |

### IKanbanBoardData

Returned by the public usage methods: `{ columns, panels, cards, version?, canWrite?, cardActions?, refreshIntervalMs?, allowedColumns?, allowedPanels? }`.

### SDK Methods — Management (authenticated)

- `createBlueprint({ name, cardTemplate?, scope? })` → `IKanbanDashboard` (forces `boardType: "blueprint"`)
- `setScope(dashboardId, scope)` → `IKanbanDashboard`
- `getPublicConfig(dashboardId)` → `IKanbanPublicConfig | null`
- `updatePublicConfig(dashboardId, payload)` → `IKanbanPublicConfig` (only provided fields are written)
- `createAccessLink(dashboardId, payload?)` → `IKanbanAccessLinkResult` (`{ path, url, expiresAt }`)
- `listAccessLinks(dashboardId)` → `IKanbanAccessLink[]` (newest first)
- `revokeAccessLink(jti)` → `void`

### SDK Methods — Public Usage (no integration token)

- `getPublicBoard(dashboardId, { linkToken? })` → `IKanbanBoardData`
- `movePublicCard(dashboardId, { linkToken, cardId, to, data?, baseVersion? })` → `IKanbanBoardData`
- `runPublicCardAction(dashboardId, { linkToken, cardId, actionId, baseVersion? })` → `IKanbanBoardData`

`to` is `{ columnId, panelId }` and `panelId` is `null` for the column root. Writes require a link with `edit` scope and may return a `409` conflict when `baseVersion` is stale.

### Tools

| Tool | Purpose |
|------|---------|
| `kanbans_create_blueprint` | Create a blueprint dashboard |
| `kanbans_set_scope` | Change the visibility scope (publish/unpublish) |
| `kanbans_get_public_config` | Read the provider configuration |
| `kanbans_update_public_config` | Create/update the provider configuration |
| `kanbans_create_access_link` | Mint a signed access link |
| `kanbans_list_access_links` | List minted access links |
| `kanbans_revoke_access_link` | Revoke an access link |
| `kanbans_get_public_board` | Read a public board |
| `kanbans_move_public_card` | Move a card through a signed link |
| `kanbans_run_public_card_action` | Run a card action through a signed link |

### Provider Placeholders

HTTP `readSource` / `writeSource` URLs, headers, and bodies support `{{param.*}}`, `{{claim.*}}`, `{{card.id}}`, `{{from.columnId}}`, `{{to.columnId}}`, `{{to.panelId}}`, `{{token}}`, and `{{timestamp}}`. `authMode: "forward-token"` forwards the signed link token to the provider for validation.