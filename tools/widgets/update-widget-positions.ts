import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

const widgetPositionSchema = z.object({
  x: z.number().describe("Horizontal grid column (0-indexed)"),
  y: z.number().describe("Vertical grid row (0-indexed)"),
  w: z.number().describe("Width in grid columns"),
  h: z.number().describe("Height in grid rows"),
  minW: z.number().optional().describe("Minimum grid width allowed when resizing"),
  minH: z.number().optional().describe("Minimum grid height allowed when resizing"),
});

export function toolMeta() {
  return {
    name: "widgets_update_widget_positions",
    description:
      "Updates the positions of several home dashboard widgets in a single request (one transaction on the server). " +
      "Use it when a dashboard layout change affects many widgets at once.",
    inputSchema: z.object({
      positions: z.array(z.object({
        widgetId: z.string().describe("Widget identifier"),
        position: widgetPositionSchema.describe("New grid position and dimensions"),
      })).describe("Position updates to apply in one transaction"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { positions, workspacePath } = args as {
    positions: Array<{ widgetId: string; position: Record<string, unknown> }>;
    workspacePath: string;
  };
  const sdk = createSDK(getConfig());
  await sdk.widgets.updateWidgetPositions(positions as any);

  return { data: { success: true } };
}