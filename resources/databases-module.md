---
name: databases-module
description: Complete reference for the Databases module — custom database schemas, typed records, and CRUD operations.
title: Databases Module Reference
mimeType: text/markdown
---

# Databases Module

The Databases module provides custom structured storage designed for RAG (Retrieval-Augmented Generation) and agent memory. Each database has its own JSON Schema for typed records.

## Entity: IDatabase

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `organizationId` | `string` | Parent organization |
| `name` | `string` | Display name |
| `description` | `string?` | Purpose description |
| `schema` | `Record<string, any>` | JSON Schema defining record structure |
| `uiSchema` | `Record<string, any>` | UI layout/presentation rules |
| `createdAt` / `updatedAt` | `string?` | Timestamps |

## Entity: IDatabaseRecord

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `databaseId` | `string` | Parent database |
| `data` | `Record<string, any>` | Record data (must conform to parent schema) |
| `createdAt` / `updatedAt` | `string?` | Timestamps |

## Schema Design Guidelines

The `schema` field uses JSON Schema format:

```json
{
  "type": "object",
  "properties": {
    "fieldName": {
      "type": "string",
      "description": "Field description"
    }
  },
  "required": ["fieldName"]
}
```

Common schema patterns for RAG/agent memory:
- **Document store**: `{ title, content, summary, tags, source_url, embedding? }`
- **Conversation memory**: `{ role, message, timestamp, context_id }`
- **Knowledge base**: `{ topic, subtopic, content, confidence, last_accessed }`
- **User profiles**: `{ user_id, preferences, traits, interaction_count }`

## SDK Methods

### Databases
- `listDatabases()` → `IDatabase[]`
- `createDatabase({ name, description?, schema?, uiSchema? })` → `IDatabase`
- `updateDatabase(id, partialPayload)` → `IDatabase`
- `deleteDatabase(id)` → `void`

### Records
- `listRecords(databaseId)` → `IDatabaseRecord[]`
- `createRecord(databaseId, data)` → `IDatabaseRecord`
- `updateRecord(databaseId, recordId, data)` → `IDatabaseRecord`
- `deleteRecord(databaseId, recordId)` → `void`
