import { z } from "zod";
import { WidgetTextFormat } from "@ledgo/sdk";
import { createSDK, getConfig } from "../@sdk/_client.ts";

const formatSchema = z.enum(["ai", "markdown", "plain"]);

export function toolMeta() {
  return {
    name: "widgets_read_content",
    description:
      "Reads the home dashboard content as text readable by AI models. " +
      "Fetches all widgets and converts each one, ordered top to bottom and left to right. " +
      "Format 'ai' (default) produces the widget id followed by its Markdown inside a fenced block; 'markdown' returns raw Markdown; 'plain' returns text without Markdown syntax.",
    inputSchema: z.object({
      format: formatSchema.optional().describe("Output format (default: ai)"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { format } = args as { format?: "ai" | "markdown" | "plain" };
  const sdk = createSDK(getConfig());
  const result = await sdk.widgets.readContent(format ? { format: format as WidgetTextFormat } : {});

  return { data: result };
}
