import { LedGoSDK, type ILedGoConfig } from "@ledgo/sdk";

export function createSDK(config: ILedGoConfig): LedGoSDK {
  return new LedGoSDK(config);
}

export function getConfig(): ILedGoConfig {
  const baseUrl = Deno.env.get("LEDGO_BASE_URL");
  const token = Deno.env.get("LEDGO_TOKEN");

  if (!baseUrl || !token) {
    throw new Error(
      "Missing required environment variables: LEDGO_BASE_URL, LEDGO_TOKEN",
    );
  }

  const organizationId = Deno.env.get("LEDGO_ORGANIZATION_ID") || undefined;

  return organizationId ? { baseUrl, token, organizationId } : { baseUrl, token };
}
