import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "comments_create_kanban_comment",
    description:
      "Creates a comment (or a reply with parentId) anchored to a kanban card.",
    inputSchema: z.object({
      dashboardId: z.string().describe("Identifier of the kanban dashboard the card belongs to"),
      kind: z
        .enum(["card"])
        .describe("Kind of the commented element. Kanbans only support card comments."),
      cardId: z
        .string()
        .describe("Identifier of the card the comment is anchored to"),
      body: z.string().describe("Text content of the comment"),
      parentId: z
        .string()
        .optional()
        .describe("Identifier of the parent comment to reply to, omitted for a top-level comment"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { dashboardId, kind, cardId, body, parentId } = args as {
    dashboardId: string;
    kind: "card";
    cardId: string;
    body: string;
    parentId?: string;
  };
  const sdk = createSDK(getConfig());
  const target = { kind, cardId };
  const result = await sdk.comments.createForKanban(dashboardId, {
    target,
    body,
    parentId,
  });

  return { data: result };
}
