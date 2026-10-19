import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "widgets_update_widget",
    description: "Updates an existing widget's configuration and/or position.",
    inputSchema: z.object({
      id: z.string().describe("Widget identifier"),
      config: z.record(z.any(), z.any()).optional().describe("Updated configuration. Shape must match the widget type."),
      position: z.object({
        x: z.number().optional(),
        y: z.number().optional(),
        w: z.number().optional(),
        h: z.number().optional(),
        minW: z.number().optional(),
        minH: z.number().optional(),
      }).optional().describe("Updated grid position and dimensions"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id, workspacePath, ...payload } = args as Record<string, unknown>;
  const sdk = createSDK(getConfig());
  const result = await sdk.widgets.updateWidget(id as string, payload);

  return { data: result };
}
