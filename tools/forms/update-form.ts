import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "forms_update_form",
    description: "Updates an existing form's configuration.",
    inputSchema: z.object({
      id: z.string().describe("Form identifier"),
      title: z.string().optional().describe("New title"),
      slug: z.string().optional().describe("New slug"),
      description: z.string().optional().describe("New description"),
      visibility: z.enum(["public", "private"]).optional().describe("New access level"),
      fields: z.array(z.record(z.any(), z.any())).optional().describe("New field definitions (full IFormField objects; supports dataSource, button (async CTA + waitFor), enableWhen, visibleWhen, options, validation props)"),
      jsonSchema: z.record(z.any(), z.any()).optional().describe("New JSON Schema"),
      uiSchema: z.record(z.any(), z.any()).optional().describe("New UI Schema"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id, workspacePath, ...payload } = args as Record<string, unknown>;
  const sdk = createSDK(getConfig());
  const result = await sdk.forms.updateForm(id as string, payload);

  return { data: result };
}
