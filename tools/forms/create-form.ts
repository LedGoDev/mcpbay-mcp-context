import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";
import { FormVisibilityType, type IFormField, type IFormOption } from "@ledgo/sdk";

const gateConditionSchema = z.object({
  fieldId: z.string().describe("Field id (or session data key / webhook event key) whose value is compared"),
  value: z.any().describe("Value the field must equal for the condition to pass"),
});

const waitForSchema = z.object({
  path: z.string().describe("JSON path inside the form session data that resolves the async button"),
  equals: z.any().optional().describe("Exact value the path must equal for the button to resolve"),
});

const dataSourceMappingSchema = z.object({
  optionsPath: z.string().optional().describe("JSON path to the array of items used as select/multiselect options"),
  labelPath: z.string().optional().describe("JSON path on each option item used as the displayed label"),
  valuePath: z.string().optional().describe("JSON path on each option item used as the stored value"),
  autofill: z.record(z.string(), z.string()).optional().describe("fieldId -> JSON path pairs used to fill other fields from the response"),
});

const dataSourceSchema = z.object({
  url: z.string().describe("Endpoint invoked when the data source triggers. Supports {{field_id}}, {SESSION_KEY} and {{session_key}} placeholders"),
  method: z.enum(["GET", "POST"]).optional().describe("HTTP method (defaults to GET)"),
  headers: z.record(z.string(), z.string()).optional().describe("Request headers. Values support {{field_id}}, {SESSION_KEY} placeholders"),
  body: z.string().optional().describe("Request body template for POST. Supports {{field_id}}, {SESSION_KEY} placeholders"),
  trigger: z.enum(["on-load", "on-change", "manual"]).optional().describe("When the fetch happens: on-load (default), on-change (with dependsOn), manual (user clicks the action button)"),
  dependsOn: z.array(z.string()).optional().describe("Field ids that re-trigger the fetch when their values change (for trigger: on-change)"),
  timeoutMs: z.number().optional().describe("Abort timeout in milliseconds (default 15000)"),
  refreshable: z.boolean().optional().describe("Whether the user can manually re-run the data source"),
  waitForWebhook: z.boolean().optional().describe("LEGACY: wait for a webhook event after a manual run before resolving. Prefer async buttons with form sessions"),
  mapping: dataSourceMappingSchema.optional().describe("How the response is applied to the form"),
});

const buttonSchema = z.object({
  url: z.string().optional().describe("URL opened when the button is clicked. Supports {{field_id}}, {SESSION_KEY} and {{session_key}} placeholders"),
  openInNewTab: z.boolean().optional().describe("Whether the URL opens in a new browser tab (defaults to true)"),
  setValues: z.record(z.string(), z.string()).optional().describe("fieldId -> template pairs filled on click"),
  async: z.boolean().optional().describe("Whether the button enters a waiting state after the click and resolves when the form session data satisfies waitFor (async CTA)"),
  waitFor: waitForSchema.optional().describe("Condition on the form session data that resolves an async button"),
});

const fieldSchema = z.object({
  id: z.string().describe("Field identifier"),
  type: z.enum(["string", "integer", "boolean", "array", "number", "null", "information", "button"]).describe("Field data type"),
  title: z.string().describe("Display label"),
  description: z.string().optional().describe("Help text"),
  required: z.boolean().optional().describe("Is field mandatory?"),
  enum: z.array(z.string()).optional().describe("Allowed values"),
  options: z.array(z.object({
    id: z.string().describe("Option identifier"),
    label: z.string().describe("Display label"),
    key: z.string().optional().describe("External mapping key"),
  })).optional().describe("Structured options for select/multiselect"),
  format: z.string().optional().describe("Format hint (date-time, email, uri)"),
  uiWidget: z.string().optional().describe("UI hint (textarea, select, checkbox)"),
  placeholder: z.string().optional().describe("Placeholder text"),
  visible: z.boolean().optional().describe("Visibility"),
  defaultValue: z.any().optional().describe("Default value"),
  enabled: z.boolean().optional().describe("Is interactive?"),
  minLength: z.number().optional().describe("Minimum string length"),
  maxLength: z.number().optional().describe("Maximum string length"),
  pattern: z.string().optional().describe("Regex pattern"),
  minimum: z.number().optional().describe("Minimum numeric value"),
  maximum: z.number().optional().describe("Maximum numeric value"),
  multipleOf: z.number().optional().describe("Numeric values must be multiples of this; 1 also marks multi-file uploads"),
  minItems: z.number().optional().describe("Minimum number of items for array fields"),
  maxItems: z.number().optional().describe("Maximum number of items for array fields"),
  uniqueItems: z.boolean().optional().describe("Whether array items must be unique"),
  formatMinimum: z.string().optional().describe("Lower bound for date-time format values"),
  formatMaximum: z.string().optional().describe("Upper bound for date-time format values"),
  visibleInCard: z.boolean().optional().describe("Whether the field is shown inside kanban cards"),
  dataSource: dataSourceSchema.optional().describe("External API configuration to load options, autofill values or run actions"),
  button: buttonSchema.optional().describe("Button field configuration: opens links, fills fields, and/or waits for async session updates (CTA)"),
  enableWhen: z.array(gateConditionSchema).optional().describe("Conditions that must pass for the field to accept user input"),
  visibleWhen: z.array(gateConditionSchema).optional().describe("Conditions that must pass for the field to be rendered"),
});

export function toolMeta() {
  return {
    name: "forms_create_form",
    description: "Creates a new form with field definitions, including API-backed fields (dataSource), async CTA buttons (button.async + waitFor with {SESSION_KEY}), conditional gating (enableWhen/visibleWhen) and legacy webhook waits.",
    inputSchema: z.object({
      title: z.string().describe("Display title of the form"),
      slug: z.string().describe("URL-friendly unique identifier"),
      description: z.string().optional().describe("Longer description shown at top"),
      visibility: z.enum(["public", "private"]).optional().describe("Access level"),
      fields: z.array(fieldSchema).optional().describe("Field definitions"),
      jsonSchema: z.record(z.any(), z.any()).optional().describe("Advanced JSON Schema validation"),
      uiSchema: z.record(z.any(), z.any()).optional().describe("UI rendering hints"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { title, slug, description, visibility, fields, jsonSchema, uiSchema } = args as {
    title: string;
    slug: string;
    description?: string;
    visibility?: string;
    fields?: unknown[];
    jsonSchema?: Record<string, unknown>;
    uiSchema?: Record<string, unknown>;
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.forms.createForm({
    title,
    slug,
    description,
    visibility: visibility as FormVisibilityType | undefined,
    fields: fields as IFormField[] | undefined,
    jsonSchema,
    uiSchema,
  });

  return { data: result };
}