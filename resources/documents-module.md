---
name: documents-module
description: Complete reference for the Documents module — project-scoped A4 documents with a block grid (widget types plus table, list, divider, and embed).
title: Documents Module Reference
mimeType: text/markdown
---

# Documents Module

The Documents module manages **project-scoped documents** (wiki pages). Each document is an **A4 sheet** (`794px` portrait / `1123px` landscape) filled with **blocks** arranged on a 12-column grid (`rowHeight 80px`). Blocks reuse the widget system plus four document-specific types.

## Scoping

Documents are project-scoped, but the **project is resolved from the integration token** itself (same as the organization) — no project identifier is needed in tools or environment variables. The server validates the project scope against the token on every request.

## Entity: IDocument

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `organizationId` | `string` | Parent organization |
| `projectId` | `string` | Parent project |
| `title` | `string` | Display title |
| `description` | `string?` | Short summary shown in the documents list |
| `orientation` | `DocumentOrientation` | `portrait` (default) \| `landscape` |
| `status` | `DocumentStatus` | `draft` \| `published` (default `published`) |
| `scope` | `DocumentScopeType` | `public` \| `organization` \| `project` (default `project`) |
| `passwordHash` | `string?` | SHA-256 hex hash of the password protecting the document |
| `createdAt` / `updatedAt` | `string?` | Timestamps |

## Entity: IDocumentBlock

A block is a widget instance positioned on the A4 sheet grid.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `documentId` | `string` | Parent document |
| `widgetType` | `DocumentBlockWidgetType` | Widget type or document-specific type |
| `config` | `Record<string, any>` | Type-specific configuration |
| `position` | `IDocumentBlockPosition` | Grid position and size (`x`, `y`, `w`, `h`, `minW?`, `minH?`, `maxW?`, `maxH?`) |
| `createdAt` / `updatedAt` | `string?` | Timestamps |

## Block Types

All widget types are valid block types (`metrics`, `title`, `toggle`, `button`, `image`, `textarea`, `code`, `chart`, `progress_bar`, `progress_bar_list`, `youtube`, `link`) plus the document-specific ones:

### table
`config: { columns: string[], rows: string[][], columnAlignments?: ..., cellAlignments?: ... }`

### list
`config: { items: [{ text, checked }], style: "bullets" | "numbered" | "checklist", itemAlignments?: ... }`

### divider
`config: { color }`

### embed
`config: { resourceType: "kanban_dashboard" | "form" | "database" | "diagram" | "storage_file", resourceId, showTitle }`

### title — special rule
The `title` block is **full-width**: it always spans the whole sheet (`x: 0, w: 12, minW: 12, maxW: 12`). A new document starts with a default title block whose content is the document title.

## SDK Methods

- `listDocuments()` → `IDocument[]`
- `getDocument(documentId)` → `IDocument`
- `createDocumentWithBlocks({ title, description?, orientation?, status?, scope?, blocks: [{ widgetType, config, position }] })` → `{ document, blocks }` — creates a complete document with all its blocks in ONE call (single server transaction). This is the recommended way to create documents.
- `updateDocument(documentId, { title?, description?, orientation?, status?, scope?, passwordHash? })` → `IDocument`
- `deleteDocument(documentId)` → `void`
- `listBlocks(documentId)` → `IDocumentBlock[]`
- `createBlock(documentId, { widgetType, config, position })` → `IDocumentBlock` — creates a single block inside an EXISTING document (one server transaction)
- `createBlocks(documentId, [{ widgetType, config, position }])` → `IDocumentBlock[]` — creates several blocks inside an existing document in ONE request (single server transaction)
- `updateBlock(documentId, blockId, { widgetType?, config?, position? })` → `IDocumentBlock`
- `updateBlockPositions(documentId, [{ blockId, position }])` → `void` — updates the positions of several blocks in ONE request (single server transaction; ideal when auto-sizing one block pushes the ones below)
- `deleteBlock(documentId, blockId)` → `void`
- `readContent(documentId, { format? })` → `string` — reads the document as AI-readable text (see below)

## AI-Readable Content

`readContent` fetches the blocks of a document and converts each one, ordered in reading order (top to bottom, left to right) by grid position:

- `format: "ai"` (default) — block id followed by its Markdown inside a fenced code block:

  ```
  4f38f3e8-bb28-4888-93a6-5724f737796d:
  ```md
  ### 10. Preguntas abiertas
  ```
  ```
- `format: "markdown"` — raw Markdown of each block (headings, links, tables, code fences, etc.)
- `format: "plain"` — the same information without Markdown syntax