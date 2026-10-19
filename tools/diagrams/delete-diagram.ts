import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "diagrams_delete_diagram",
    description: "Deletes a diagram.",
    inputSchema: z.object({
      id: z.string().describe("Diagram identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id } = args as { id: string };
  const sdk = createSDK(getConfig());

  await sdk.diagrams.deleteDiagram(id);

  return { data: { success: true } };
}
