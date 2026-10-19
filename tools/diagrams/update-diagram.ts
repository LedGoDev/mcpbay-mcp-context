import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "diagrams_update_diagram",
    description: "Updates an existing diagram's name, description, or code.",
    inputSchema: z.object({
      id: z.string().describe("Diagram identifier"),
      name: z.string().optional().describe("New name"),
      code: z.string().optional().describe("New Mermaid.js code"),
      description: z.string().optional().describe("New description"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id, workspacePath, ...payload } = args as Record<string, unknown>;
  const sdk = createSDK(getConfig());
  const result = await sdk.diagrams.updateDiagram(id as string, payload);

  return { data: result };
}
