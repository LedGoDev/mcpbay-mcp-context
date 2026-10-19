import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";
import { createBlockSchema } from "../@sdk/_schemas.ts";

const documentStatusSchema = z.enum(["draft", "published"]);
const documentScopeSchema = z.enum(["public", "organization", "project"]);
const documentOrientationSchema = z.enum(["portrait", "landscape"]);

export function toolMeta() {
  return {
    name: "documents_create_document_with_blocks",
    description:
      "Creates a complete document with all its blocks in a single call (one server transaction). " +
      "Title, description, and blocks are created together; there is no separate block-creation step. " +
      "The sheet uses a 12-column grid and the title block is always full-width (w: 12).",
    inputSchema: z.object({
      title: z.string().describe("Display title of the document"),
      description: z.string().optional().describe("Short summary shown in the documents list"),
      orientation: documentOrientationSchema.optional().describe("Orientation of the A4 sheet (default portrait)"),
      status: documentStatusSchema.optional().describe("Publication status (default published)"),
      scope: documentScopeSchema.optional().describe("Sharing scope (default project)"),
      blocks: z.array(createBlockSchema).describe("Blocks created inside the document in the same transaction"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { workspacePath, ...payload } = args;
  const sdk = createSDK(getConfig());
  const result = await sdk.documents.createDocumentWithBlocks(payload as any);

  return { data: result };
}