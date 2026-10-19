import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "widgets_list_widgets",
    description: "Lists all widgets on the organization home dashboard.",
    inputSchema: z.object({}).toJSONSchema(),
  };
}

export async function toolHandler() {
  const sdk = createSDK(getConfig());
  const result = await sdk.widgets.listWidgets();

  return { data: result };
}
