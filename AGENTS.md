# LedGo Platform Context — LLM Instructions

You have access to the **LedGo AI Agent Engineering Platform** through this context.

## How to use this context

1. **Authentication**: All tools require a single environment variable:
   - `LEDGO_TOKEN` — An integration token generated in the organization settings
   - `LEDGO_BASE_URL` *(optional)* — Override the API host. Defaults to `https://papi.ledgo.dev` (the SDK appends `/api-v1-new` for API calls; module-specific edge functions use the bare host).

   The **organization** and the **project** (needed by the documents module) are resolved from the token itself, so no organization or project id is needed.

2. **Resources**: Read the relevant resource before using tools from a module:
   - `CONCEPT` — Understanding what LedGo is and does
   - `quickstart` — Getting started with the SDK and API
   - `kanbans-module` — Kanban dashboard CRUD, item management, and blueprint boards (providers, public scope, signed access links)
   - `forms-module` — Dynamic form creation and response collection
   - `databases-module` — Custom database and record management
   - `diagrams-module` — Mermaid.js diagram management
   - `documents-module` — Project documents (A4 sheets) and block management
   - `comments-module` — Cross-cutting comments anchored to databases, kanbans, forms and documents
   - `widgets-module` — Home dashboard widget management
   - `storage-module` — File storage operations (upload, download, delete)

3. **Tools**: Each SDK module has its own set of tools under `tools/{module}/`. Tool names follow the pattern `{module}_{action}` (e.g., `kanbans_list_dashboards`, `forms_create_form`, `documents_create_document_with_blocks`).

4. **Best practices**:
   - Use `list*` tools first to discover existing entities before creating new ones
   - All CRUD operations are scoped by the integration token: the organization and project are resolved from it.
   - When creating dashboards/forms/databases, consider the schema/field structure carefully
   - Create documents with `documents_create_document_with_blocks` (document + blocks in one transaction); do not create empty documents
   - Add blocks to an existing document with `documents_create_block` (single) or `documents_create_blocks` (several in one transaction)
   - When creating document blocks, remember the sheet uses a 12-column grid and the `title` block is always full-width (`w: 12`)
   - Create/update home dashboard widgets with the batch tools (`widgets_create_widgets`, `widgets_update_widgets`)
   - Storage operations (upload/download) work with base64-encoded data via the tools
   - Diagrams use Mermaid.js syntax for diagram definitions
   - Blueprint boards are created with `kanbans_create_blueprint`; configure the provider with `kanbans_update_public_config`, publish with `kanbans_set_scope` (`public`), and grant access with `kanbans_create_access_link`
   - Comments are cross-cutting: use `comments_list_*`/`comments_create_*` per root resource (database, kanban, form, document). Use `comments_update_comment`/`comments_delete_comment` with the `rootType` of the comment to edit or delete your own comments

5. **Error handling**: Tools return the API response directly. If an error occurs, it will include an error message. Network/configuration errors indicate missing or invalid environment variables.
