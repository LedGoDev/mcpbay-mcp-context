import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";
import { updateWidgetSchema } from "../@sdk/_schemas.ts";

export function toolMeta() {
  return {
    name: "widgets_update_widgets",
    description:
      "Updates several widgets' configuration and/or position in a single request (one server transaction). " +
      "Provide the widgetType of each widget so the config shape is validated; only provided fields are updated.",
    inputSchema: z.object({
      widgets: z.array(updateWidgetSchema).describe("Widget updates to apply in one transaction"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { widgets } = args as { widgets: Array<Record<string, unknown>> };
  const sdk = createSDK(getConfig());
  const result = await sdk.widgets.updateWidgets(widgets as any);

  return { data: result };
}