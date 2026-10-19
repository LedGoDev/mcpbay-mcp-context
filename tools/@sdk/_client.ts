import { LedGoSDK, type ILedGoConfig } from "@ledgo/sdk";

export function createSDK(config: ILedGoConfig): LedGoSDK {
  return new LedGoSDK(config);
}

export function getConfig(): ILedGoConfig {
  const baseUrl = Deno.env.get("MONDA_BASE_URL");
  const token = Deno.env.get("MONDA_TOKEN");

  if (!baseUrl || !token) {
    throw new Error(
      "Missing required environment variables: MONDA_BASE_URL, MONDA_TOKEN",
    );
  }

  const organizationId = Deno.env.get("MONDA_ORGANIZATION_ID") || undefined;

  return organizationId ? { baseUrl, token, organizationId } : { baseUrl, token };
}
