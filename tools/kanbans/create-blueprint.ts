import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";
import {
  kanbanFieldSchema,
  kanbanScopeSchema,
} from "../@sdk/_kanban-blueprint-schemas.ts";

export function toolMeta() {
  return {
    name: "kanbans_create_blueprint",
    description:
      "Creates a blueprint kanban dashboard whose structure and cards are rendered from an external provider " +
      "configured later with kanbans_update_public_config.",
    inputSchema: z.object({
      name: z.string().describe("Display name of the dashboard"),
      cardTemplate: z
        .array(kanbanFieldSchema)
        .optional()
        .describe("Field definitions for the card data model"),
      scope: kanbanScopeSchema.optional().describe("Visibility scope, defaults to project"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { name, cardTemplate, scope } = args as {
    name: string;
    cardTemplate?: Array<Record<string, unknown>>;
    scope?: "public" | "organization" | "project";
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.createBlueprint({
    name,
    cardTemplate: cardTemplate as any,
    scope: scope as any,
  });

  return { data: result };
}
