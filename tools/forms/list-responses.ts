import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "forms_list_responses",
    description: "Retrieves all submissions/responses for a specific form.",
    inputSchema: z.object({
      formId: z.string().describe("Form identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { formId } = args as { formId: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.forms.listResponses(formId);

  return { data: result };
}
