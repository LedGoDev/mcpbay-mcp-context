import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "diagrams_list_diagrams",
    description: "Lists all diagrams for the organization.",
    inputSchema: z.object({}).toJSONSchema(),
  };
}

export async function toolHandler() {
  const sdk = createSDK(getConfig());
  const result = await sdk.diagrams.listDiagrams();

  return { data: result };
}
