import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "diagrams_create_diagram",
    description: "Creates a new diagram with Mermaid.js code.",
    inputSchema: z.object({
      name: z.string().describe("Display name of the diagram"),
      code: z.string().describe("Mermaid.js diagram definition code"),
      description: z.string().optional().describe("Purpose description"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { name, code, description } = args as {
    name: string;
    code: string;
    description?: string;
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.diagrams.createDiagram({ name, code, description });

  return { data: result };
}
