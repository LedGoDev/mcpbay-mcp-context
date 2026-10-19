---
name: create_kanban_workflow
description: Guides the LLM through creating a complete kanban workflow with dashboards, columns, panels, and cards.
---

# Kanban Workflow Creation Guide

Follow these steps to create a complete kanban workflow for {{dashboard_name}}:

## Step 1: Create the Dashboard
Use `kanbans_create_dashboard` with:
- A descriptive name
- An optional card template defining the data fields for cards

The template defines what data each card holds (title, priority, assignee, status, etc.).

## Step 2: Create Columns
Use `kanbans_create_item` with `type: "column"` for each workflow stage:
- Start with columns like "To Do", "In Progress", "Review", "Done"
- Set the `order` field to control left-to-right positioning
- Optionally add `stateUpdates` to auto-set card fields when moved to a column

## Step 3: Create Panels (Optional)
Use `kanbans_create_item` with `type: "panel"` to group cards within columns:
- Panels help categorize cards (e.g., "Bugs", "Features", "Chores")
- Panels support `color` for visual identification

## Step 4: Create Cards
Use `kanbans_create_item` with `type: "card"`:
- The `columnId` must reference an existing column
- The `data` object keys must match the dashboard's `cardTemplate` field IDs
- Optionally assign to a `panelId`

## Step 5: Verify
Use `kanbans_list_items` to verify the complete structure.