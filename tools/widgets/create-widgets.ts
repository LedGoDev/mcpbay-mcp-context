import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";
import { createWidgetSchema } from "../@sdk/_schemas.ts";

export function toolMeta() {
  return {
    name: "widgets_create_widgets",
    description:
      "Creates several widgets on the organization home dashboard in a single request (one server transaction). " +
      "Use it when a dashboard needs many widgets at once instead of one creation per widget. " +
      "Each widget's config shape is validated against its widgetType.",
    inputSchema: z.object({
      widgets: z.array(createWidgetSchema).describe("Widgets to create"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { widgets } = args as { widgets: Array<Record<string, unknown>> };
  const sdk = createSDK(getConfig());
  const result = await sdk.widgets.createWidgets(widgets as any);

  return { data: result };
}