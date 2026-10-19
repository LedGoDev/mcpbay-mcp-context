import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "comments_delete_comment",
    description:
      "Deletes an existing comment. Only the author of the comment can delete it.",
    inputSchema: z.object({
      commentId: z.string().describe("Identifier of the comment to delete"),
      rootType: z
        .enum(["database", "kanban", "form", "document"])
        .optional()
        .describe("Module route used to reach the comment. Defaults to database; the API resolves the permission from the comment root resource."),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { commentId, rootType } = args as {
    commentId: string;
    rootType?: "database" | "kanban" | "form" | "document";
  };
  const sdk = createSDK(getConfig());
  await sdk.comments.remove(commentId, rootType);

  return { data: { deleted: true } };
}
