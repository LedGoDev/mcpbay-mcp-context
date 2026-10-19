---
name: forms-module
description: Complete reference for the Forms module — form creation, field types, API data sources, async CTA sessions (form_sessions), field gating, webhooks, and response collection.
title: Forms Module Reference
mimeType: text/markdown
---

# Forms Module

The Forms module provides dynamic form building and submission handling. Forms support custom field definitions, JSON Schema validation, UI Schema customization, **API-backed fields** (fields that load options, autofill values, or run actions against external APIs), **conditional gating** (show/enable fields based on other values), **async CTA sessions** (buttons that stay waiting until an external provider updates a per-fill session store), and the **legacy webhook flow**.

## Entity: IForm

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `organizationId` | `string` | Parent organization |
| `title` | `string` | Display title |
| `description` | `string?` | Longer description shown at the top |
| `slug` | `string` | URL-friendly unique identifier (e.g., "feedback-form-2024") |
| `visibility` | `FormVisibilityType` | Access level: `PUBLIC` or `PRIVATE` |
| `fields` | `IFormField[]` | Array of field definitions |
| `sessionTtlHours` | `number?` | TTL of async form sessions in hours (default `24`) |
| `jsonSchema` | `Record<string, any>?` | Advanced JSON Schema validation |
| `uiSchema` | `Record<string, any>?` | UI rendering hints |
| `createdBy` | `string?` | Creator user ID |
| `createdAt` / `updatedAt` | `string?` | Timestamps |

## Entity: IFormResponse

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `formId` | `string` | Submitted form |
| `data` | `Record<string, any>` | Submitted field values (keyed by field ID) |
| `sessionId` | `string?` | Async session the response came from (traceability) |
| `userId` | `string?` | Authenticated submitter ID |
| `createdAt` / `updatedAt` | `string?` | Timestamps |

## Field Types (FieldType enum)

| Enum Value | Type | Description |
|------------|------|-------------|
| `STRING` | `"string"` | Free text string |
| `INTEGER` | `"integer"` | Whole number |
| `BOOLEAN` | `"boolean"` | True/false |
| `ARRAY` | `"array"` | Ordered list (multiselect) |
| `NUMBER` | `"number"` | Decimal number |
| `INFORMATION` | `"information"` | No user input; informational label field (legacy alias: `"null"`) |
| `BUTTON` | `"button"` | No user input; button that opens links, fills fields, and/or waits for async session updates |

## IFormField Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Field identifier (key in response data) |
| `type` | `FieldType` | Data type |
| `title` | `string` | Display label |
| `description` | `string?` | Help text |
| `required` | `boolean?` | Is field mandatory? |
| `enum` | `string[]?` | Allowed string values for simple selection |
| `options` | `IFormOption[]?` | Structured options (with id, label, key) |
| `format` | `string?` | Format hint (e.g., 'date-time', 'email', 'uri') |
| `uiWidget` | `string?` | UI hint (e.g., 'textarea', 'select', 'checkbox') |
| `placeholder` | `string?` | Placeholder text |
| `visible` | `boolean?` | Visibility (false hides the field) |
| `defaultValue` | `any?` | Default value |
| `enabled` | `boolean?` | Interactive? |
| `minLength` / `maxLength` | `number?` | String length constraints |
| `pattern` | `string?` | Regex validation |
| `minimum` / `maximum` | `number?` | Numeric range constraints |
| `multipleOf` | `number?` | Numeric values must be multiples of this; `1` also marks multi-file uploads for FileWidget |
| `minItems` / `maxItems` | `number?` | Array item count constraints |
| `uniqueItems` | `boolean?` | Whether array items must be unique |
| `formatMinimum` / `formatMaximum` | `string?` | Lower/upper bound for 'date-time' format values |
| `visibleInCard` | `boolean?` | Whether the field is shown inside kanban cards |
| `dataSource` | `IFormDataSource?` | External API configuration (load options, autofill, actions) |
| `button` | `IFormButtonConfig?` | Button field configuration (link, setValues, async CTA) |
| `enableWhen` | `IFormFieldGateCondition[]?` | Conditions that must pass for the field to accept input |
| `visibleWhen` | `IFormFieldGateCondition[]?` | Conditions that must pass for the field to be rendered |

**Note:** `dataSource` is only supported on non-`information`/non-`button` fields. Informational (`information`) fields render as labels; buttons (`button`) have their own configuration.

## API Data Sources (`dataSource`)

A `dataSource` makes a field API-backed: it can load select options from an endpoint, autofill other fields from the response, or run a manual action (verify/check/pay). The platform is provider-agnostic: it only invokes a URL and maps the response — no provider-specific code.

### Entity: IFormDataSource

| Property | Type | Description |
|----------|------|-------------|
| `url` | `string` | Endpoint invoked when the data source triggers. Supports `{{field_id}}` and `{{webhook_ref}}` placeholders |
| `method` | `FormDataSourceMethodType?` | HTTP method: `"GET"` (default) or `"POST"` |
| `headers` | `Record<string, string>?` | Request headers. Values support `{{field_id}}` placeholders |
| `body` | `string?` | Request body template for POST. Supports `{{field_id}}` placeholders |
| `trigger` | `FormDataSourceTriggerType?` | When the fetch happens: `"on-load"` (default), `"on-change"`, `"manual"` |
| `dependsOn` | `string[]?` | Field ids that re-trigger the fetch when their values change (only for `trigger: "on-change"`) |
| `timeoutMs` | `number?` | Abort timeout in milliseconds (default `15000`) |
| `refreshable` | `boolean?` | Whether the user can manually re-run the data source |
| `waitForWebhook` | `boolean?` | **Legacy.** Wait for a webhook event after a manual run before resolving. New async flows use button CTAs with form sessions instead |
| `mapping` | `IFormDataSourceMapping?` | How the response is applied to the form |

### Entity: IFormDataSourceMapping

| Property | Type | Description |
|----------|------|-------------|
| `optionsPath` | `string?` | JSON path to the array of items used as select/multiselect options (makes the field render as a select) |
| `labelPath` | `string?` | JSON path on each option item used as the displayed label |
| `valuePath` | `string?` | JSON path on each option item used as the stored value |
| `autofill` | `Record<string, string>?` | **`fieldId -> JSON path`** pairs used to fill other fields from the response (keys are FIELD IDS, values are JSON PATHS) |

### Placeholders

- `{{field_id}}` — replaced with the current value of another field (e.g. `https://api.example.com/cities?country={{country}}`).
- `{SESSION_KEY}` (alias `{{session_key}}`) — the async form session token (see Async CTA Sessions below). Injectable in data source URLs/headers/bodies and button URLs. Using it in a template triggers the lazy session creation on first use.
- `{{webhook_ref}}` — **legacy** session token for webhook correlation (see Webhook Flow below).

### Usage patterns

**1. Dynamic options (select / multiselect)** — a select field loads its options from an API:

```json
{
  "id": "city",
  "type": "string",
  "title": "City",
  "uiWidget": "select",
  "dataSource": {
    "url": "https://api.example.com/cities?country={{country}}",
    "trigger": "on-change",
    "dependsOn": ["country"],
    "mapping": { "optionsPath": "data", "labelPath": "name", "valuePath": "id" }
  }
}
```

**2. Autofill (enrich other fields)** — one fetch fills several fields (e.g. postal code lookup):

```json
{
  "id": "zip",
  "type": "string",
  "title": "Postal code",
  "dataSource": {
    "url": "https://api.example.com/zip/{{zip}}",
    "trigger": "on-change",
    "mapping": {
      "autofill": {
        "street": "address.street",
        "city": "address.city",
        "province": "address.province"
      }
    }
  }
}
```

**3. Manual action / verification** — the user clicks a button that invokes the URL and writes the result back into fields:

```json
{
  "id": "verify",
  "type": "string",
  "title": "Verification",
  "dataSource": {
    "url": "https://api.example.com/verify/{{tax_id}}",
    "trigger": "manual",
    "refreshable": true,
    "mapping": { "autofill": { "verify_result": "status" } }
  }
}
```

### Runtime behavior

- `on-load` fetches once when the form renders; `on-change` fetches when all `dependsOn` fields are filled (or immediately if none); `manual` fetches only when the user clicks the field's action button.
- On success the response is applied: options are rendered by the widget from local state (never written into the JSON Schema), and `mapping.autofill` fills the mapped fields.
- On failure the field shows a visible error with retry when `refreshable` or `manual`.
- If the endpoint URL is empty/unconfigured, the field still renders and shows a warning message instead of making a request.

## Field Gating (`enableWhen` / `visibleWhen`)

Both are arrays of `IFormFieldGateCondition`: `{ "fieldId": string, "value": any }`. The field must be gated on a value; `fieldId` refers to another field id, a session data key, or (legacy) a webhook event key. Every condition must pass (`==` comparison).

- `enableWhen` — conditions that must pass for the field to accept user input (disabled otherwise).
- `visibleWhen` — conditions that must pass for the field to be rendered (hidden otherwise).

In async flows the current form session data is merged into the gating values, so fields can unlock when the provider confirms a step (e.g. show the rest of the form only when `payment.status === "success"`).

Example — show "Combo" only when the "pais" field equals "mx":

```json
{
  "id": "combo",
  "type": "string",
  "title": "Combo",
  "visibleWhen": [{ "fieldId": "pais", "value": "mx" }]
}
```

## Button Fields (`button`)

Button fields render a CTA that opens a link and/or fills other fields. Async buttons (CTAs) are the standard way to run async flows: the form waits until an external provider updates the session store.

### Entity: IFormButtonConfig

| Property | Type | Description |
|----------|------|-------------|
| `url` | `string?` | URL opened when clicked. Supports `{{field_id}}`, `{SESSION_KEY}` and `{{session_key}}` placeholders |
| `openInNewTab` | `boolean?` | Open the URL in a new tab (default `true`) |
| `setValues` | `Record<string, string>?` | `fieldId -> template` pairs filled on click |
| `async` | `boolean?` | Whether the button enters a waiting state after the click and resolves when the session data satisfies `waitFor` |
| `waitFor` | `IFormSessionWaitCondition?` | `{ path: string, equals?: any }` — JSON path (and optional expected value) in the session data that resolves the button |

### Button examples

**Simple link button** — opens a URL with values from other fields:

```json
{
  "id": "docs",
  "type": "button",
  "title": "Ver documentación",
  "button": { "url": "https://docs.example.com?id={{user_id}}" }
}
```

**Async CTA** — creates the session, opens the checkout with the token, and waits for the provider confirmation:

```json
{
  "id": "pay",
  "type": "button",
  "title": "Pagar ahora",
  "button": {
    "url": "https://pay.example.com/checkout?session={SESSION_KEY}",
    "async": true,
    "waitFor": { "path": "payment.status", "equals": "success" }
  }
}
```

## Async CTA Sessions (form sessions)

For flows where the truth lives on the provider's server (redirect checkout, payments, long verifications), the browser cannot verify the result. The standard mechanism is a **form session**: a per-fill state store (`form_sessions`) keyed by a capability token.

### Flow

1. The user clicks an **async button** (`button.async: true`) whose URL contains `{SESSION_KEY}`.
2. On first use, the form creates a session row (id = random UUID, the **session token**) and stores it in the form URL query: `?session=<uuid>`. The token is a capability: whoever knows it can read/update the session.
3. The form opens the button URL with `{SESSION_KEY}` resolved, so the provider learns the token.
4. The button enters **"Esperando actualización externa..."** and the form polls the session.
5. The provider updates the session via HTTP (see contract below). The button resolves (shows "Completado") when the `waitFor` condition is met; gated fields can unlock against the session data.
6. On submit, the response stores `session_id` and the session is marked `completed` (closed sessions are immutable).

Sessions are **lazy**: the URL stays clean until the first async interaction. TTL is configurable per form (`sessionTtlHours`, default 24h). Async behavior is exclusive to the public forms page; inline hosts (kanban, databases) run async buttons as plain links.

### Session endpoint contract

Edge function `form-session` (same host as the form webhook: `https://{appKey}.function2.insforge.app/form-session`, or `{baseUrl}/functions/form-session`):

| Method | Body / Query | Behavior |
|--------|--------------|----------|
| `POST` | `{ id?, formId, data? }` | Upsert a session. If `id` is given (client-generated token) it is used; otherwise one is generated. `expires_at = now() + form.session_ttl_hours`. Returns `{ success, session }` |
| `PATCH` | `{ id, data?, status? }` | Shallow-merges `data` into the session store, bumps `updated_at`. Status transitions `active → completed \| cancelled`. Rejects with `410` if expired **or** closed (completed/cancelled sessions are immutable) |
| `GET` | `?id=` | Returns the session record (`{ success, session }`) |

Errors: `400` malformed · `404` session/form not found · `410` expired or closed · `500` internal.

### Provider example (payment method)

```bash
PATCH https://{app}.function2.insforge.app/form-session
Content-Type: application/json

{ "id": "3d27edde-108c-4cb4-ae4d-fd6efd00f8de",
  "data": { "payment": { "status": "success", "id": "p_123" } } }
```

The provider receives the token from the checkout URL opened by the button (`?session=<token>`). The form resolves when `payment.status === "success"` (the button's `waitFor`). `GET /form-session?id=<token>` returns the current state at any time.

## Legacy Webhook Flow (`waitForWebhook`)

> **Deprecated.** The previous async mechanism (`waitForWebhook: true` + `{{webhook_ref}}` + the HMAC-signed per-form webhook endpoint) remains supported for existing forms but is no longer offered for new fields. Use async button CTAs with form sessions instead.

Legacy flow (kept for existing forms):

1. The field uses `trigger: "manual"` + `waitForWebhook: true`, and its URL includes the `{{webhook_ref}}` placeholder.
2. The user clicks the action button; the request runs and the field enters a "waiting for confirmation" state.
3. The provider does its async work and calls the form's webhook URL with `{ formId, ref, data }` signed with HMAC (`X-LedGo-Signature: sha256=...` header, form secret).
4. The form polls for the event; when it arrives, the field resolves, shows "Completado", and `mapping.autofill` fills the mapped fields from the event `data`.

The `ref` correlates the browser session with the provider callback; the HMAC signature prevents forged events. Its endpoint and signing contract are unchanged.

## Form Visibility

- **PUBLIC** — Anyone with the form link can submit (no auth needed)
- **PRIVATE** — Only authenticated organization members can submit

## SDK Methods

- `getFormSessionUrl()` → `string` — URL of the form session endpoint (POST/PATCH/GET) used by external providers to update a session by its token
- `getFormSessionReadUrl(sessionId)` → `string` — URL to read a session record by its token (GET `?id=`)
- `listForms()` → `IForm[]`
- `createForm({ title, slug, description?, visibility?, fields?, jsonSchema?, uiSchema? })` → `IForm`
- `updateForm(id, partialPayload)` → `IForm`
- `deleteForm(id)` → `void`
- `listResponses(formId)` → `IFormResponse[]`

## Complete Example

Form with a dynamic options field (country → city), an autofilled field, a gated field, and an async payment CTA:

```json
{
  "title": "Shipping",
  "slug": "shipping",
  "visibility": "public",
  "fields": [
    {
      "id": "country",
      "type": "string",
      "title": "Country",
      "required": true,
      "uiWidget": "select",
      "dataSource": {
        "url": "https://api.example.com/countries",
        "trigger": "on-load",
        "mapping": { "optionsPath": "data", "labelPath": "name", "valuePath": "code" }
      }
    },
    {
      "id": "city",
      "type": "string",
      "title": "City",
      "uiWidget": "select",
      "dataSource": {
        "url": "https://api.example.com/cities?country={{country}}",
        "trigger": "on-change",
        "dependsOn": ["country"],
        "mapping": { "optionsPath": "data", "labelPath": "name", "valuePath": "id" }
      }
    },
    {
      "id": "zip",
      "type": "string",
      "title": "Postal code",
      "dataSource": {
        "url": "https://api.example.com/zip/{{zip}}",
        "trigger": "on-change",
        "mapping": {
          "autofill": {
            "street": "address.street",
            "city": "address.city"
          }
        }
      }
    },
    {
      "id": "delivery_note",
      "type": "string",
      "title": "Delivery note",
      "visibleWhen": [{ "fieldId": "country", "value": "mx" }]
    },
    {
      "id": "pay",
      "type": "button",
      "title": "Pagar ahora",
      "button": {
        "url": "https://pay.example.com/checkout?session={SESSION_KEY}",
        "async": true,
        "waitFor": { "path": "payment.status", "equals": "success" }
      }
    }
  ]
}
```