---
name: quickstart
description: Quick start guide for using the LedGo SDK. Read this to understand authentication and basic operations.
title: Quick Start Guide
mimeType: text/markdown
---

# Quick Start Guide

## Installation

The LedGo SDK is a TypeScript package published as `@ledgo/sdk`.

```bash
npm install @ledgo/sdk
# or
pnpm add @ledgo/sdk
```

## Authentication

Initialize the SDK with your organization's integration token. The host defaults to the stable `https://papi.ledgo.dev` alias (API calls use `/api-v1-new`, while module-specific edge functions use the bare host) and the organization/project are resolved from the token, so no other configuration is required:

```typescript
import { LedGoSDK } from '@ledgo/sdk';

const sdk = new LedGoSDK({
  token: 'your-integration-token'
});
```

- **token**: Integration token from Organization Settings → Integrations
- **baseUrl** *(optional)*: Only needed to target a different deployment. Both `https://papi.ledgo.dev` and the full `https://papi.ledgo.dev/api-v1-new` are accepted.
- **organizationId** *(deprecated)*: No longer needed; the API resolves it from the token.

## Basic Usage Examples

### Kanban Management

```typescript
// List all dashboards
const dashboards = await sdk.kanbans.listDashboards();

// Create a dashboard
const dashboard = await sdk.kanbans.createDashboard({
  name: 'Sprint Board',
  cardTemplate: [
    { id: 'title', type: FieldType.STRING, title: 'Title', required: true },
    { id: 'priority', type: FieldType.STRING, title: 'Priority', enum: ['low', 'medium', 'high'] },
    { id: 'effort', type: FieldType.INTEGER, title: 'Effort (hours)' }
  ]
});

// Add a column
const column = await sdk.kanbans.createItem(
  dashboard.id,
  KanbanItemType.COLUMN,
  { name: 'To Do', order: 0 }
);

// Add a card
const card = await sdk.kanbans.createItem(
  dashboard.id,
  KanbanItemType.CARD,
  { columnId: column.id, data: { title: 'Fix login bug', priority: 'high', effort: 3 } }
);
```

### Forms

```typescript
// Create a feedback form
const form = await sdk.forms.createForm({
  title: 'User Feedback',
  slug: 'user-feedback',
  visibility: FormVisibilityType.PUBLIC,
  fields: [
    { id: 'name', type: FieldType.STRING, title: 'Your Name', required: true },
    { id: 'rating', type: FieldType.INTEGER, title: 'Rating (1-5)', minimum: 1, maximum: 5 },
    { id: 'comments', type: FieldType.STRING, title: 'Comments', uiWidget: 'textarea' }
  ]
});

// List responses
const responses = await sdk.forms.listResponses(form.id);
```

### Databases

```typescript
// Create a database for agent memory
const db = await sdk.databases.createDatabase({
  name: 'Agent Memory',
  schema: {
    type: 'object',
    properties: {
      topic: { type: 'string' },
      summary: { type: 'string' },
      relevance: { type: 'number', minimum: 0, maximum: 1 },
      timestamp: { type: 'string', format: 'date-time' }
    },
    required: ['topic', 'summary']
  }
});

// Store a memory record
const record = await sdk.databases.createRecord(db.id, {
  topic: 'User Preferences',
  summary: 'User prefers dark mode and concise responses',
  relevance: 0.85
});
```

### Diagrams

```typescript
// Create a Mermaid.js diagram
const diagram = await sdk.diagrams.createDiagram({
  name: 'Agent Workflow',
  code: `graph TD
    A[Receive Query] --> B{Classify Intent}
    B -->|Code| C[Generate Code]
    B -->|Data| D[Query Database]
    C --> E[Format Response]
    D --> E`,
  description: 'Main agent processing workflow'
});
```

### Widgets

```typescript
// Create a Metrics widget
const widget = await sdk.widgets.createWidget({
  widgetType: WidgetType.METRICS,
  config: {
    title: 'Total Cards',
    value: 42,
    unit: 'cards',
    trend: 'up',
    prefix: '',
    suffix: ''
  },
  position: { x: 0, y: 0, w: 3, h: 2 }
});
```

### Documents

```typescript
// Create a document (A4 sheet). The project is resolved from the token.
const document = await sdk.documents.createDocument({
  title: 'Agent Runbook',
  description: 'Procedures for agent deployments',
  status: DocumentStatus.PUBLISHED,
  scope: DocumentScopeType.PROJECT
});

// List documents
const documents = await sdk.documents.listDocuments();

// Add a table block to the document
await sdk.documents.createBlock(document.id, {
  widgetType: DocumentBlockType.TABLE,
  config: {
    columns: ['Step', 'Owner', 'Status'],
    rows: [['Deploy', 'Platform', 'Done']]
  },
  position: { x: 0, y: 0, w: 12, h: 4 }
});

// Update and delete blocks and documents
await sdk.documents.updateBlock(document.id, blockId, { position: { x: 0, y: 4, w: 12, h: 2 } });
await sdk.documents.deleteBlock(document.id, blockId);
await sdk.documents.deleteDocument(document.id);
```

### Storage

```typescript
// Upload a file
const bucket = sdk.storage.from('documents');
const file = new Blob(['file content'], { type: 'text/plain' });
const uploaded = await bucket.upload({ path: 'reports/summary.txt', file });

// Download a file
const downloaded = await bucket.download('reports/summary.txt');

// Delete a file
await bucket.remove('reports/summary.txt');
```
