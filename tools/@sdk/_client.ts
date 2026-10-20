import { LedGoSDK, type ILedGoConfig } from "@ledgo/sdk";

export function createSDK(config: ILedGoConfig): LedGoSDK {
  return new LedGoSDK(config);
}

export function getConfig(): ILedGoConfig {
  const token = Deno.env.get("LEDGO_TOKEN");
  const baseUrl = Deno.env.get("LEDGO_BASE_URL") || undefined;

  if (!token) {
    throw new Error("Missing required environment variable: LEDGO_TOKEN");
  }

  return baseUrl ? { token, baseUrl } : { token };
}
