import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "kanbans_get_item",
    description: "Retrieves a single item (column, panel, or card) by its ID.",
    inputSchema: z.object({
      id: z.string().describe("Item identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id } = args as { id: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.getItem(id);

  return { data: result };
}