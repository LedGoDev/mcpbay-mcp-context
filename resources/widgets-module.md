---
name: widgets-module
description: Complete reference for the Widgets module — 16 widget types for the organization home dashboard with grid layout, batch operations, and AI-readable content.
title: Widgets Module Reference
mimeType: text/markdown
---

# Widgets Module

The Widgets module manages widgets on the organization's **home dashboard**. Widgets are placed on a grid layout with configurable position and size.

## Entity: IWidgetInstance

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `organizationId` | `string` | Parent organization |
| `widgetType` | `WidgetType` | Determines rendering and config shape |
| `config` | `Record<string, any>` | Type-specific configuration |
| `position` | `IWidgetPosition` | Grid position and dimensions |
| `createdAt` / `updatedAt` | `string?` | Timestamps |

## Widget Types and Configs

All 16 widget types available via the `WidgetType` enum:

### METRICS (`WidgetType.METRICS`)
Config: `{ title, value, unit, trend: "up"|"down"|"neutral", prefix, suffix }`

### TITLE (`WidgetType.TITLE`)
Config: `{ content, level: 1|2|3|4|5, alignment: "left"|"center"|"right" }`

### TOGGLE (`WidgetType.TOGGLE`)
Config: `{ label, defaultValue, currentValue, onLabel, offLabel }`

### BUTTON (`WidgetType.BUTTON`)
Config: `{ label, variant: "primary"|"secondary"|"outline"|"ghost", size: "sm"|"md"|"lg", action, icon }`

### IMAGE (`WidgetType.IMAGE`)
Config: `{ src, alt, fit: "cover"|"contain"|"fill"|"scroll", rounded }`

### TEXTAREA (`WidgetType.TEXTAREA`)
Config: `{ content }`

### CODE (`WidgetType.CODE`)
Config: `{ code, language }`

### CHART (`WidgetType.CHART`)
Config: `{ type: "bar"|"line"|"pie"|"area", title, labels, data }`
Labels and data are comma-separated strings.

### PROGRESS_BAR (`WidgetType.PROGRESS_BAR`)
Config: `{ label, value (0-100), color, showPercentage }`

### PROGRESS_BAR_LIST (`WidgetType.PROGRESS_BAR_LIST`)
Config: `{ items: [{ label, value, color }], showPercentage }`

### YOUTUBE (`WidgetType.YOUTUBE`)
Config: `{ url }`

### LINK (`WidgetType.LINK`)
Config: `{ label, url }`

### TABLE (`WidgetType.TABLE`)
Config: `{ columns: string[], rows: string[][], columnAlignments?, cellAlignments? }`

### LIST (`WidgetType.LIST`)
Config: `{ items: [{ text, checked }], style: "bullets"|"numbered"|"checklist", itemAlignments? }`

### DIVIDER (`WidgetType.DIVIDER`)
Config: `{ color }`

### EMBED (`WidgetType.EMBED`)
Config: `{ resourceType: "kanban_dashboard"|"form"|"database"|"diagram"|"storage_file", resourceId, showTitle }`

## Position (`IWidgetPosition`)

| Field | Type | Description |
|-------|------|-------------|
| `x` | `number` | Horizontal grid column (0-indexed) |
| `y` | `number` | Vertical grid row (0-indexed) |
| `w` | `number` | Width in grid columns |
| `h` | `number` | Height in grid rows |
| `minW` | `number?` | Minimum width constraint |
| `minH` | `number?` | Minimum height constraint |

## SDK Methods

- `listWidgets()` → `IWidgetInstance[]`
- `getWidget(id)` → `IWidgetInstance`
- `createWidgets([{ widgetType, config?, position? }, ...])` → `IWidgetInstance[]` — creates several widgets in ONE request (single server transaction; ideal when a dashboard needs many widgets at once)
- `updateWidget(id, { config?, position? })` → `IWidgetInstance`
- `updateWidgets([{ id, widgetType, config?, position? }, ...])` → `IWidgetInstance[]` — updates several widgets' config and/or position in ONE request (single server transaction; only provided fields are updated per widget)
- `updateWidgetPositions([{ widgetId, position }])` → `void` — updates the positions of several widgets in ONE request (single server transaction; ideal when a dashboard layout change affects many widgets at once)
- `deleteWidget(id)` → `void`
- `deleteWidgets([id, ...])` → `void` — deletes several widgets in ONE request (single server transaction)
- `readContent({ format? })` → `string` — reads the whole dashboard as AI-readable text (see below)

### Widget-Specific Create Payloads

Each widget type has its own creation interface:
- `ICreateMetricsWidgetPayload` — `{ widgetType: WidgetType.METRICS, config?: IMetricsConfig, position?: IWidgetPosition }`
- `ICreateTitleWidgetPayload` — `{ widgetType: WidgetType.TITLE, config?: ITitleConfig, position?: IWidgetPosition }`
- `I*WidgetPayload` — Same pattern for all 16 types.

## AI-Readable Content

`readContent` converts every widget to text readable by AI models, ordered in reading order (top to bottom, left to right) by grid position:

- `format: "ai"` (default) — widget id followed by its Markdown inside a fenced code block:

  ```
  4f38f3e8-bb28-4888-93a6-5724f737796d:
  ```md
  ### 10. Preguntas abiertas
  ```
  ```
- `format: "markdown"` — raw Markdown of each widget (headings, links, tables, code fences, etc.)
- `format: "plain"` — the same information without Markdown syntax
