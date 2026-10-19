---
name: concept
description: High-level concept and purpose of the LedGo platform. Read this first to understand what LedGo is.
title: LedGo Platform Concept
mimeType: text/markdown
---

# LedGo — AI Agent Engineering Platform

LedGo is a full-stack SaaS platform that provides **infrastructure for developers building and deploying autonomous AI agents**. It serves as the operational layer between AI agents and the real-world systems they need to interact with.

## Core Philosophy

AI agents need more than just LLM capabilities — they need persistent storage, kanban management, structured data, visual workflow builders, file handling, and human-in-the-loop interaction. LedGo provides all of these as modular, API-first services.

## Platform Modules

| Module | Purpose |
|--------|---------|
| **Kanbans** | Kanban-style board management with columns, panels, and cards. Supports custom JSON-schema-driven templates per board for flexible data models. |
| **Forms** | Dynamic form builder and renderer. Forms defined by JSON Schema + UI Schema can be embedded, shared, or used for agent-to-human data collection. |
| **Databases** | Custom structured storage designed for RAG and agent memory. Each database has its own JSON Schema for typed records. |
| **Diagrams** | Mermaid.js-based diagramming for creating flowcharts, sequence diagrams, and visual agent workflows. |
| **Documents** | Project-scoped A4 documents (wiki pages) with a block grid: titles, text, tables, lists, images, charts, and embeds of other platform resources. |
| **Widgets** | Customizable home dashboard with 13 widget types (Metrics, Title, Container, Toggle, Button, Image, Textarea, Code, Chart, Progress Bar, Progress Bar List, YouTube, Link). |
| **Storage** | S3-compatible file storage with public/internal/private scoping. Upload, download, and delete files by bucket. |

## How an AI Agent Uses LedGo

1. **Plan** — Create kanban dashboards with workflows, columns (To Do, In Progress, Done), and panels for grouping
2. **Remember** — Use Databases for RAG memory, storing vector-suitable structured data with custom schemas
3. **Interact** — Deploy forms to collect human input, use diagrams to explain reasoning
4. **Integrate** — Use webhook connectors to notify external systems of any platform event
5. **Report** — Build dashboards with Metrics, Charts, and Progress Bars to visualize outcomes

## API Architecture

All operations are scoped to an **Organization**. Authentication uses **Bearer tokens** (integration tokens generated in org settings). The API is RESTful and returns JSON. The SDK handles snake_case↔camelCase conversion automatically.
