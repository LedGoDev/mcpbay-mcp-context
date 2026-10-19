---
name: storage-module
description: Complete reference for the Storage module — bucket-based file operations with upload, download, and delete.
title: Storage Module Reference
mimeType: text/markdown
---

# Storage Module

The Storage module provides file storage operations using S3-compatible storage (supports Cloudflare R2). Files are organized into **buckets** with configurable access levels.

## Entity: IStorageObject

| Field | Type | Description |
|-------|------|-------------|
| `bucket` | `string` | Bucket name |
| `key` | `string` | Unique path/key within the bucket |
| `size` | `number` | File size in bytes |
| `mimeType` | `string` | MIME type (e.g., "image/png", "application/pdf") |
| `uploadedAt` | `string` | ISO 8601 upload timestamp |
| `url` | `string` | Publicly accessible download URL |

## Architecture

```
SDK ──▶ from(bucketName) ──▶ StorageBucket
                                │
                     ┌──────────┼──────────┐
                     ▼          ▼          ▼
                  upload()   download()   remove()
```

## SDK Methods

### StorageModule
- `from(bucketName)` → `StorageBucket` — Get a bucket instance for operations

### StorageBucket
- `upload({ path, file })` → `IStorageObject` — Upload with specific key
- `uploadAuto(file)` → `IStorageObject` — Upload with auto-generated key
- `download(path)` → `Blob` — Download file as blob
- `remove(path)` → `void` — Delete file

## Upload Methods

### Upload with Path
```typescript
const bucket = sdk.storage.from('documents');
const result = await bucket.upload({
  path: 'reports/2024/summary.pdf',
  file: fileObject // File (browser) or Blob (Node.js)
});
```

### Upload with Auto-Generated Key
```typescript
const result = await bucket.uploadAuto(fileObject);
// Server assigns a unique key and returns it in the response
```

## File Scope

Files can be stored in different bucket types:
- **Public buckets** — Files are publicly accessible via the returned URL
- **Private buckets** — Access requires authentication
- **Internal buckets** — Access restricted to organization members

## Storage Use Cases for AI Agents

- Store agent-generated documents (reports, summaries)
- Save conversation history exports
- Cache large data that doesn't fit in database records
- Manage uploaded assets (images, PDFs) from form submissions
- Store configuration files and agent knowledge artifacts
