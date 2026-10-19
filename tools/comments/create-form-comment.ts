import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "comments_create_form_comment",
    description:
      "Creates a comment (or a reply with parentId) anchored to a form response.",
    inputSchema: z.object({
      formId: z.string().describe("Identifier of the form the response belongs to"),
      kind: z
        .enum(["response"])
        .describe("Kind of the commented element. Forms only support response comments."),
      responseId: z
        .string()
        .describe("Identifier of the form response the comment is anchored to"),
      body: z.string().describe("Text content of the comment"),
      parentId: z
        .string()
        .optional()
        .describe("Identifier of the parent comment to reply to, omitted for a top-level comment"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { formId, kind, responseId, body, parentId } = args as {
    formId: string;
    kind: "response";
    responseId: string;
    body: string;
    parentId?: string;
  };
  const sdk = createSDK(getConfig());
  const target = { kind, responseId };
  const result = await sdk.comments.createForForm(formId, {
    target,
    body,
    parentId,
  });

  return { data: result };
}
