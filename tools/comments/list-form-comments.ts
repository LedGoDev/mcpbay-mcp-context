import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "comments_list_form_comments",
    description:
      "Lists the cross-cutting comments anchored to a form, optionally filtered to one response target key.",
    inputSchema: z.object({
      formId: z.string().describe("Identifier of the form the comments belong to"),
      targetKey: z
        .string()
        .optional()
        .describe("Optional deterministic target key to filter a single response"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { formId, targetKey } = args as { formId: string; targetKey?: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.comments.listForForm(formId, targetKey);

  return { data: result };
}
