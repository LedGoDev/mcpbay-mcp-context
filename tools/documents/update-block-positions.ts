import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

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
    name: "documents_update_block_positions",
    description:
      "Updates the positions of several document blocks in a single request (one transaction on the server). " +
      "Use it when a layout change affects many blocks at once, e.g. auto-sizing one block pushes the ones below it.",
    inputSchema: z.object({
      documentId: z.string().describe("Document identifier"),
      positions: z.array(z.object({
        blockId: z.string().describe("Block identifier"),
        position: blockPositionSchema.describe("New grid position and size on the A4 sheet (12 columns grid)"),
      })).describe("Position updates to apply in one transaction"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { documentId, positions, workspacePath } = args as {
    documentId: string;
    positions: Array<{ blockId: string; position: Record<string, unknown> }>;
    workspacePath: string;
  };
  const sdk = createSDK(getConfig());
  await sdk.documents.updateBlockPositions(documentId, positions as any);

  return { data: { success: true } };
}