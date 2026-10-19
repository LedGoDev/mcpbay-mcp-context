import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "forms_list_forms",
    description: "Lists all forms for the organization.",
    inputSchema: z.object({}).toJSONSchema(),
  };
}

export async function toolHandler() {
  const sdk = createSDK(getConfig());
  const result = await sdk.forms.listForms();

  return { data: result };
}
