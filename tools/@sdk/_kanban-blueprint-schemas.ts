import { z } from "zod";

/**
 * Shared zod schemas for the kanban blueprint tools.
 * Blueprint boards render their structure and cards from an external provider
 * configured through the public config, and are exposed through signed links.
 */

/** Visibility scope of a kanban board. */
export const kanbanScopeSchema = z
  .enum(["public", "organization", "project"])
  .describe("Visibility scope of the board");

/** Kind of data provider that feeds a blueprint dashboard. */
export const kanbanProviderTypeSchema = z
  .enum(["http", "internal", "ledgo-database", "static"])
  .describe("Provider that feeds the board");

/** Authentication mode used when calling a provider endpoint. */
export const kanbanAuthModeSchema = z
  .enum(["signed", "none", "forward-token"])
  .describe("Authentication mode of the provider requests");

/** Scope granted by a signed access link. */
export const kanbanLinkScopeSchema = z
  .enum(["view", "edit"])
  .describe("Scope granted by the link");

/** Field definition of the card data model of a dashboard. */
export const kanbanFieldSchema = z.object({
  id: z.string().describe("Field identifier"),
  type: z
    .enum(["string", "integer", "boolean", "array", "number", "null"])
    .describe("Field data type"),
  title: z.string().describe("Display label"),
  description: z.string().optional().describe("Help text"),
  required: z.boolean().optional().describe("Whether the field is mandatory"),
  enum: z.array(z.string()).optional().describe("Allowed values"),
  options: z
    .array(
      z.object({
        id: z.string().describe("Option identifier"),
        label: z.string().describe("Display label"),
        key: z.string().optional().describe("External mapping key"),
      }),
    )
    .optional()
    .describe("Structured options for select/multiselect widgets"),
  format: z.string().optional().describe("Data format hint (e.g. date-time, email, uri)"),
  uiWidget: z
    .string()
    .optional()
    .describe("UI component hint (e.g. textarea, select, checkbox)"),
  placeholder: z.string().optional().describe("Placeholder text displayed inside an empty input"),
  visible: z.boolean().optional().describe("Whether the field is visible in the rendered form"),
  defaultValue: z.any().optional().describe("Initial value when the form loads"),
  enabled: z.boolean().optional().describe("Whether the field accepts user interaction"),
  minLength: z.number().optional().describe("Minimum allowed length for string values"),
  maxLength: z.number().optional().describe("Maximum allowed length for string values"),
  pattern: z.string().optional().describe("Regex pattern that string values must match"),
  minimum: z.number().optional().describe("Minimum allowed numerical value (inclusive)"),
  maximum: z.number().optional().describe("Maximum allowed numerical value (inclusive)"),
});

/** Parameter accepted by the public read endpoint of a blueprint. */
export const kanbanParamSchema = z.object({
  id: z.string().describe("Identifier used inside {{param.<id>}} placeholders"),
  label: z.string().describe("Display label shown in the editor"),
  type: z
    .enum(["string", "number", "boolean"])
    .describe("Primitive type expected for the parameter value"),
  required: z.boolean().describe("Whether the parameter must be provided by the caller"),
  defaultValue: z
    .union([z.string(), z.number(), z.boolean(), z.null()])
    .describe("Default value applied when the caller omits the parameter"),
  description: z.string().describe("Help text shown next to the parameter"),
});

/** Authentication configuration of a provider endpoint. */
export const kanbanSourceAuthSchema = z.object({
  mode: kanbanAuthModeSchema.describe("Authentication mode applied to the request"),
  headerName: z
    .string()
    .nullable()
    .describe("Header carrying the signature, null when the mode does not use one"),
  secret: z
    .string()
    .nullable()
    .describe("Shared secret used to sign the request, null for unsigned modes"),
});

/** HTTP request performed against a provider endpoint. */
export const kanbanSourceSchema = z.object({
  url: z.string().describe("Endpoint URL, may contain {{...}} placeholders"),
  method: z
    .enum(["GET", "POST", "PUT", "PATCH", "DELETE"])
    .describe("HTTP method of the request"),
  headers: z.record(z.any(), z.any()).describe("Headers forwarded with the request"),
  body: z.any().describe("Request body template, null or empty when the method sends no body"),
  timeoutMs: z.number().describe("Abort timeout of the request in milliseconds"),
  auth: kanbanSourceAuthSchema
    .nullable()
    .describe("Authentication applied to the request, null when unsigned"),
});

/** Mapping between a provider response and the board collections. */
export const kanbanMappingSchema = z.object({
  columns: z
    .string()
    .optional()
    .describe("JSON path to the array of columns in the provider response"),
  panels: z
    .string()
    .optional()
    .describe("JSON path to the array of panels in the provider response"),
  cards: z
    .string()
    .optional()
    .describe("JSON path to the array of cards in the provider response"),
  version: z
    .string()
    .optional()
    .describe("JSON path to the provider version used for conflict detection"),
  columnFields: z
    .record(z.any(), z.any())
    .optional()
    .describe("Output field to JSON path map applied to each column"),
  panelFields: z
    .record(z.any(), z.any())
    .optional()
    .describe("Output field to JSON path map applied to each panel"),
  cardFields: z
    .record(z.any(), z.any())
    .optional()
    .describe("Output field to JSON path map applied to each card"),
});

/** Declarative action offered by every card of a blueprint board. */
export const kanbanCardActionSchema = z.object({
  id: z.string().describe("Identifier sent to the provider as {{action.id}}"),
  label: z.string().describe("Button label shown on the card"),
  variant: z
    .enum(["primary", "secondary", "danger"])
    .describe("Visual variant applied to the button"),
  requiresConfirm: z
    .boolean()
    .describe("Whether the action asks for confirmation before running"),
  allowedColumns: z
    .array(z.string())
    .nullable()
    .describe("Columns where the action is available, null for any column"),
  allowedPanels: z
    .array(z.string())
    .nullable()
    .describe("Panels where the action is available, null for any panel"),
});

/** Public provider configuration of a blueprint dashboard (partial update). */
export const kanbanPublicConfigSchema = z.object({
  providerType: kanbanProviderTypeSchema.optional().describe("Provider that feeds the board"),
  providerManifestUrl: z
    .string()
    .nullable()
    .optional()
    .describe("URL of the provider manifest, null to clear it"),
  params: z
    .array(kanbanParamSchema)
    .optional()
    .describe("Parameters accepted by the public read endpoint"),
  readSource: kanbanSourceSchema
    .nullable()
    .optional()
    .describe("Request used to read the board, null to clear it"),
  writeSource: kanbanSourceSchema
    .nullable()
    .optional()
    .describe("Request used to write the board back, null to clear it"),
  mapping: kanbanMappingSchema.optional().describe("Mapping applied to the provider response"),
  cardActions: z
    .array(kanbanCardActionSchema)
    .optional()
    .describe("Declarative actions offered by the cards of the board"),
  authMode: kanbanAuthModeSchema.optional().describe("Authentication mode of the provider requests"),
  allowWrite: z
    .boolean()
    .optional()
    .describe("Whether public callers may write to the board"),
  singleUse: z
    .boolean()
    .optional()
    .describe("Whether each write consumes a single-use token"),
  embedAllowedOrigins: z
    .array(z.string())
    .nullable()
    .optional()
    .describe("Origins allowed to embed the public board, null for any origin"),
  refreshIntervalMs: z
    .number()
    .nullable()
    .optional()
    .describe("Auto-refresh interval of the public board in milliseconds"),
});

/** Payload for minting a signed access link for a blueprint dashboard. */
export const kanbanAccessLinkSchema = z.object({
  scope: kanbanLinkScopeSchema.optional().describe("Scope granted by the link, defaults to view"),
  params: z
    .record(z.any(), z.any())
    .optional()
    .describe("Provider params forwarded to the public route as query string values"),
  claims: z
    .record(z.any(), z.any())
    .optional()
    .describe("Claims exposed to the provider as {{claim.*}} placeholders"),
  singleUse: z.boolean().optional().describe("Whether the link can only be used once"),
  ttlSeconds: z
    .number()
    .optional()
    .describe("Lifetime of the link in seconds, clamped by the server"),
  baseUrl: z
    .string()
    .optional()
    .describe("Base URL used to build the absolute url of the result, optional"),
  allowedColumns: z
    .array(z.string())
    .optional()
    .describe("Columns the link may move cards into, omitted for any column"),
  allowedPanels: z
    .array(z.string())
    .optional()
    .describe("Panels the link may move cards into, omitted for any panel"),
});

/** Destination container of a public board move. */
export const kanbanMoveTargetSchema = z.object({
  columnId: z.string().describe("Identifier of the destination column"),
  panelId: z
    .string()
    .nullable()
    .describe("Identifier of the destination panel, null for the column root"),
});
