import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

const blockTypeSchema = z.enum([
  "metrics", "title", "toggle", "button", "image", "textarea",
  "code", "chart", "progress_bar", "progress_bar_list", "youtube", "link",
  "table", "list", "divider", "embed",
]);

const blockPositionSchema = z.object({
  x: z.number().describe("Horizontal grid column (0-indexed)"),
  y: z.number().describe("Vertical grid row (0-indexed)"),
  w: z.number().describe("Grid width in columns"),
  h: z.number().describe("Grid height in rows"),
  minW: z.number().optional().describe("Minimum grid width allowed when resizing"),
  minH: z.number().optional().describe("Minimum grid height allowed when resizing"),
  maxW: z.number().optional().describe("Maximum grid width allowed when resizing"),
  maxH: z.number().optional().describe("Maximum grid height allowed when resizing"),
});

export function toolMeta() {
  return {
    name: "documents_update_block",
    description: "Updates an existing block's widget type, config, or position.",
    inputSchema: z.object({
      documentId: z.string().describe("Document identifier"),
      blockId: z.string().describe("Block identifier"),
      widgetType: blockTypeSchema.optional().describe("New type of block"),
      config: z.record(z.any(), z.any()).optional().describe("New block configuration. Shape varies by widgetType."),
      position: blockPositionSchema.optional().describe("New grid position and size on the A4 sheet (12 columns grid)"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { documentId, blockId, workspacePath, ...payload } = args as {
    documentId: string;
    blockId: string;
    widgetType?: string;
    config?: Record<string, unknown>;
    position?: Record<string, unknown>;
    workspacePath: string;
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.documents.updateBlock(documentId, blockId, payload as any);

  return { data: result };
}