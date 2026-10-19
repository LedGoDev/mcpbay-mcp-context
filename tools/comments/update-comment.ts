import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "comments_update_comment",
    description:
      "Updates the body of an existing comment. Only the author of the comment can update it.",
    inputSchema: z.object({
      commentId: z.string().describe("Identifier of the comment to update"),
      body: z.string().describe("New text content of the comment"),
      rootType: z
        .enum(["database", "kanban", "form", "document"])
        .optional()
        .describe("Module route used to reach the comment. Defaults to database; the API resolves the permission from the comment root resource."),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { commentId, body, rootType } = args as {
    commentId: string;
    body: string;
    rootType?: "database" | "kanban" | "form" | "document";
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.comments.update(commentId, body, rootType);

  return { data: result };
}
