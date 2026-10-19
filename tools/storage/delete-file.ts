import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "storage_delete_file",
    description: "Deletes a file from a storage bucket.",
    inputSchema: z.object({
      bucketName: z.string().describe("Storage bucket name"),
      path: z.string().describe("Object key/path of the file to delete"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { bucketName, path } = args as { bucketName: string; path: string };
  const sdk = createSDK(getConfig());
  const bucket = sdk.storage.from(bucketName);

  await bucket.remove(path);

  return { data: { success: true } };
}
