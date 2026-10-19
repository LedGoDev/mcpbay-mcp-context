import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "widgets_delete_widgets",
    description:
      "Deletes several widgets from the organization home dashboard in a single request (one transaction on the server). " +
      "Use it when a dashboard cleanup removes many widgets at once instead of one DELETE per widget.",
    inputSchema: z.object({
      ids: z.array(z.string()).describe("Identifiers of the widgets to delete"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { ids } = args as { ids: string[] };
  const sdk = createSDK(getConfig());

  await sdk.widgets.deleteWidgets(ids);

  return { data: { success: true, deleted: ids.length } };
}
