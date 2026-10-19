import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";
import { kanbanMoveTargetSchema } from "../@sdk/_kanban-blueprint-schemas.ts";

export function toolMeta() {
  return {
    name: "kanbans_move_public_card",
    description:
      "Moves a card through a public signed link and returns the replacement board. The link must grant edit scope.",
    inputSchema: z.object({
      dashboardId: z.string().describe("Dashboard identifier"),
      linkToken: z.string().describe("Signed access-link token with edit scope"),
      cardId: z.string().describe("Identifier of the card being moved"),
      to: kanbanMoveTargetSchema.describe("Destination container of the card"),
      data: z
        .record(z.any(), z.any())
        .optional()
        .describe("Card data after merging the destination state updates"),
      baseVersion: z
        .string()
        .optional()
        .describe("Provider version the move is based on, for conflict detection"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { dashboardId, linkToken, cardId, to, data, baseVersion } = args as {
    dashboardId: string;
    linkToken: string;
    cardId: string;
    to: { columnId: string; panelId: string | null };
    data?: Record<string, unknown>;
    baseVersion?: string;
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.movePublicCard(dashboardId, {
    linkToken,
    cardId,
    to,
    data,
    baseVersion,
  });

  return { data: result };
}
