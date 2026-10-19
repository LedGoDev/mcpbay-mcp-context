---
name: comments-module
description: Complete reference for the cross-cutting comments layer — comments anchored to databases, kanbans, forms and documents.
title: Comments Module Reference
mimeType: text/markdown
---

# Comments Module

The comments layer is a **cross-cutting collaboration feature**, not a standalone module: comments are anchored to an existing resource plus one of its fine-grained targets. The supported root resources are:

| Root resource | Anchors (`target.kind`) | Extra fields |
|---------------|-------------------------|--------------|
| Database | `database`, `column`, `record`, `cell` | `field`, `recordId` |
| Kanban | `card` | `cardId` |
| Form | `response` | `responseId` |
| Document | `block` | `blockId` |

## Entity: IComment

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `organizationId` / `projectId` | `string` | Scoping of the root resource |
| `rootResourceType` | `string` | `database`, `kanban`, `form` or `document` |
| `rootResourceId` | `string` | Identifier of the root resource |
| `target` | `ICommentTarget` | Fine-grained anchor (see below) |
| `targetKey` | `string` | Deterministic key derived from the anchor, used for grouping |
| `parentId` | `string?` | Parent comment id; non-null means reply |
| `authorId` | `string?` | Author profile id |
| `body` | `string` | Text content |
| `bodyFormat` | `string` | `markdown` or `plain` |
| `editedAt` / `deletedAt` | `string?` | Edit / soft-delete timestamps |
| `createdAt` | `string` | Creation timestamp |

## Anchors (`target`)

| Root resource | Element | `kind` | Extra fields |
|---------------|---------|--------|--------------|
| Database | Database | `database` | — |
| Database | Column | `column` | `field` (schema property name) |
| Database | Record | `record` | `recordId` |
| Database | Cell | `cell` | `recordId`, `field` |
| Kanban | Card | `card` | `cardId` |
| Form | Response | `response` | `responseId` |
| Document | Block | `block` | `blockId` |

## SDK Methods

- `comments.listForDatabase(databaseId, targetKey?)` → `IComment[]`
- `comments.createForDatabase(databaseId, { target, body, parentId? })` → `IComment`
- `comments.listForKanban(dashboardId, targetKey?)` → `IComment[]`
- `comments.createForKanban(dashboardId, { target, body, parentId? })` → `IComment`
- `comments.listForForm(formId, targetKey?)` → `IComment[]`
- `comments.createForForm(formId, { target, body, parentId? })` → `IComment`
- `comments.listForDocument(documentId, targetKey?)` → `IComment[]`
- `comments.createForDocument(documentId, { target, body, parentId? })` → `IComment`
- `comments.update(commentId, body, rootType = 'database')` → `IComment`
- `comments.remove(commentId, rootType = 'database')` → `void`

## API Routes

| Root resource | List / create | Edit / delete |
|---------------|---------------|---------------|
| Database | `/databases/{databaseId}/comments` | `/databases/comments/{commentId}` |
| Kanban | `/kanbans/dashboards/{dashboardId}/comments` | `/kanbans/comments/{commentId}` |
| Form | `/forms/{formId}/comments` | `/forms/comments/{commentId}` |
| Document | `/documents/{documentId}/comments` | `/documents/comments/{commentId}` |

The edit/delete routes are interchangeable: the API resolves the permission from the comment's own root resource, so the same comment can be managed through any module prefix. The `rootType` argument only selects the route.

## Authorization

- Reading and creating require view access on the root resource (`databases:view`, `kanbans:view`, `forms:view` or `documents:view`).
- Editing and deleting are restricted to the comment author and still require view access on the root resource.
- Replies inherit the anchor (and scope) of their parent.
- Invalid anchors are rejected by the backend (unknown column, foreign record, foreign card/response/block).
