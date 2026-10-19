---
name: diagrams-module
description: Complete reference for the Diagrams module — Mermaid.js diagram CRUD for flowcharts, sequence diagrams, and more.
title: Diagrams Module Reference
mimeType: text/markdown
---

# Diagrams Module

The Diagrams module allows creating and managing diagrams using **Mermaid.js** syntax. Supports all Mermaid diagram types including flowcharts, sequence diagrams, class diagrams, state diagrams, entity-relationship diagrams, Gantt charts, pie charts, and more.

## Entity: IDiagram

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `organizationId` | `string` | Parent organization |
| `name` | `string` | Display name |
| `code` | `string` | Mermaid.js diagram definition code |
| `createdBy` | `string` | Creator/modifier user ID |
| `description` | `string?` | Purpose description |
| `createdAt` / `updatedAt` | `string?` | Timestamps |

## Common Mermaid.js Examples

### Flowchart
```
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```

### Sequence Diagram
```
sequenceDiagram
    Agent->>Database: Query memory
    Database-->>Agent: Return results
    Agent->>Human: Request clarification
    Human-->>Agent: Provide feedback
```

### Class Diagram
```
classDiagram
    class Agent {
        +String name
        +String model
        +executeTask() bool
    }
    class Task {
        +String title
        +String status
        +run() void
    }
    Agent "1" --> "*" Task
```

## SDK Methods

- `listDiagrams()` → `IDiagram[]`
- `getDiagram(id)` → `IDiagram`
- `createDiagram({ name, code, description? })` → `IDiagram`
- `updateDiagram(id, { name?, code?, description? })` → `IDiagram`
- `deleteDiagram(id)` → `void`
