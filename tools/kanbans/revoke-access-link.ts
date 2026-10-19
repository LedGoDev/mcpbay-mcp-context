import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "kanbans_revoke_access_link",
    description: "Revokes a signed access link so it can no longer be used.",
    inputSchema: z.object({
      jti: z.string().describe("Unique identifier of the access link (also carried by the token as jti)"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { jti } = args as { jti: string };
  const sdk = createSDK(getConfig());

  await sdk.kanbans.revokeAccessLink(jti);

  return { data: { success: true } };
}
