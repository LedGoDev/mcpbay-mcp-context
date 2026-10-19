import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "kanbans_get_public_board",
    description:
      "Reads a public blueprint board. When the board requires a signed link, pass the token minted by " +
      "kanbans_create_access_link.",
    inputSchema: z.object({
      dashboardId: z.string().describe("Dashboard identifier"),
      linkToken: z
        .string()
        .optional()
        .describe("Signed access-link token, required for signed boards"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { dashboardId, linkToken } = args as { dashboardId: string; linkToken?: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.getPublicBoard(dashboardId, { linkToken });

  return { data: result };
}
