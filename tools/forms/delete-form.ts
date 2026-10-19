import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "forms_delete_form",
    description: "Deletes a form and all its associated responses.",
    inputSchema: z.object({
      id: z.string().describe("Form identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id } = args as { id: string };
  const sdk = createSDK(getConfig());

  await sdk.forms.deleteForm(id);

  return { data: { success: true } };
}
