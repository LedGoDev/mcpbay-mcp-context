import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "kanbans_get_public_config",
    description:
      "Reads the server-only public provider configuration of a blueprint dashboard. Returns null when the " +
      "dashboard has no configuration yet.",
    inputSchema: z.object({
      dashboardId: z.string().describe("Dashboard identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { dashboardId } = args as { dashboardId: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.getPublicConfig(dashboardId);

  return { data: result };
}
