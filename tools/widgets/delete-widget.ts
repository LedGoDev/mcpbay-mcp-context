import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "widgets_delete_widget",
    description: "Deletes a widget from the organization home dashboard.",
    inputSchema: z.object({
      id: z.string().describe("Widget identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id } = args as { id: string };
  const sdk = createSDK(getConfig());

  await sdk.widgets.deleteWidget(id);

  return { data: { success: true } };
}
