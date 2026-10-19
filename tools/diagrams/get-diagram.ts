import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "diagrams_get_diagram",
    description: "Retrieves a single diagram by its ID.",
    inputSchema: z.object({
      id: z.string().describe("Diagram identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id } = args as { id: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.diagrams.getDiagram(id);

  return { data: result };
}
