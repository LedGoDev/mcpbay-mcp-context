---
name: create_kanban_blueprint_workflow
description: Guides the LLM through creating, configuring, publishing, and sharing a kanban blueprint board end to end.
---

# Kanban Blueprint Workflow Guide

Follow these steps to deliver a complete kanban blueprint for {{dashboard_name}}.

## Step 1: Create the Blueprint
Use `kanbans_create_blueprint` with:
- A descriptive `name`
- An optional `cardTemplate` defining the data fields rendered on cards
- An optional `scope` (defaults to `project`; publish later with `public`)

Blueprints render their columns, panels, and cards from an external provider, not from LedGo items.

## Step 2: Configure the Provider
Use `kanbans_update_public_config` with `dashboardId` and only the fields you want to set:
- `providerType`: `http`, `internal`, `ledgo-database`, or `static`
- `readSource` / `writeSource`: request `url`, `method`, `headers`, `body`, `timeoutMs`, `auth`
- `mapping`: JSON paths for `columns`, `panels`, `cards`, `version` and their field maps
- `params`: parameters accepted by the public read endpoint (`{{param.<id>}}`)
- `cardActions`: declarative buttons exposed on cards
- `authMode`: `signed`, `none`, or `forward-token`
- `allowWrite`, `singleUse`, `refreshIntervalMs`, `embedAllowedOrigins`

For a quick demo, use `providerType: "static"` and put the board payload in `readSource.body`.

Read the stored configuration back with `kanbans_get_public_config` (returns `null` when unset).

## Step 3: Publish the Board
Use `kanbans_set_scope` with `scope: "public"`. Publishing is subject to the organization plan limit.

## Step 4: Share with a Signed Link
Use `kanbans_create_access_link` to mint a link:
- `scope`: `view` or `edit`
- `ttlSeconds`, `singleUse`, `allowedColumns`, `allowedPanels`
- `params` and `claims` forwarded to the provider
- `baseUrl` to receive an absolute `url`

Manage issued links with `kanbans_list_access_links` and `kanbans_revoke_access_link`.

## Step 5: Use the Public Board
- `kanbans_get_public_board` with `{ linkToken }` for signed boards
- `kanbans_move_public_card` to move a card (requires `edit` scope)
- `kanbans_run_public_card_action` to run a declarative card action (requires `edit` scope)

Pass `baseVersion` from the last read to detect conflicts (a stale version returns `409`).

## Step 6: Verify
Use `kanbans_list_dashboards` to confirm the board, and `kanbans_get_public_board` to confirm the rendered content.
