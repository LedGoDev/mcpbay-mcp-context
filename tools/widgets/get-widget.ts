import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "widgets_get_widget",
    description: "Retrieves a single widget by its ID.",
    inputSchema: z.object({
      id: z.string().describe("Widget identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id } = args as { id: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.widgets.getWidget(id);

  return { data: result };
}
