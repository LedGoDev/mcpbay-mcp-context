import { z } from "zod";
import { WidgetTextFormat } from "@ledgo/sdk";
import { createSDK, getConfig } from "../@sdk/_client.ts";

const formatSchema = z.enum(["ai", "markdown", "plain"]);

export function toolMeta() {
  return {
    name: "documents_read_content",
    description:
      "Reads the content of a document as text readable by AI models. " +
      "Fetches the blocks of the document and converts each one, ordered top to bottom and left to right. " +
      "Format 'ai' (default) produces the block id followed by its Markdown inside a fenced block; 'markdown' returns raw Markdown; 'plain' returns text without Markdown syntax.",
    inputSchema: z.object({
      documentId: z.string().describe("Document identifier"),
      format: formatSchema.optional().describe("Output format (default: ai)"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { documentId, format } = args as {
    documentId: string;
    format?: "ai" | "markdown" | "plain";
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.documents.readContent(documentId, format ? { format: format as WidgetTextFormat } : {});

  return { data: result };
}
