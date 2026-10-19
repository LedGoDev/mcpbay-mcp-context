---
name: analyze_organization_data
description: Guides the LLM through analyzing an organization's data across all modules to provide insights.
---

# Organization Data Analysis Guide

Use the following steps to analyze an organization's data:

## 1. Kanban Dashboards
Use `kanbans_list_dashboards` to see all boards, then `kanbans_list_items` for each board to understand workflow structure.

## 2. Forms and Responses
Use `forms_list_forms` to discover all forms, then `forms_list_responses` for each form to see collected data.

## 3. Databases
Use `databases_list_databases` to discover all databases, then `databases_list_records` for each database to examine stored records.

## 4. Diagrams
Use `diagrams_list_diagrams` to see all visual workflow diagrams.

## 5. Documents
Use `documents_list_documents` (with the project id) to see all project documents, then `documents_list_blocks` for each document to examine its content blocks.

## 6. Dashboard Widgets
Use `widgets_list_widgets` to see the home dashboard layout and configuration.

## 7. Report
After collecting all data, provide a comprehensive summary including:
- Number of dashboards and total cards
- Form response volume
- Database record counts
- Document and block counts per project
- Any notable patterns or findings
