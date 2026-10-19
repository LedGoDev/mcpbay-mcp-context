import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "kanbans_run_public_card_action",
    description:
      "Runs a declarative card action through a public signed link and returns the replacement board. The link " +
      "must grant edit scope.",
    inputSchema: z.object({
      dashboardId: z.string().describe("Dashboard identifier"),
      linkToken: z.string().describe("Signed access-link token with edit scope"),
      cardId: z.string().describe("Identifier of the card the action runs on"),
      actionId: z.string().describe("Identifier of the action executed"),
      baseVersion: z
        .string()
        .optional()
        .describe("Provider version the action is based on, for conflict detection"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { dashboardId, linkToken, cardId, actionId, baseVersion } = args as {
    dashboardId: string;
    linkToken: string;
    cardId: string;
    actionId: string;
    baseVersion?: string;
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.runPublicCardAction(dashboardId, {
    linkToken,
    cardId,
    actionId,
    baseVersion,
  });

  return { data: result };
}
