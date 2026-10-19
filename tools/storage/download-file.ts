import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "storage_download_file",
    description: "Downloads a file from a storage bucket as a base64-encoded string.",
    inputSchema: z.object({
      bucketName: z.string().describe("Storage bucket name"),
      path: z.string().describe("Object key/path of the file to download"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { bucketName, path } = args as { bucketName: string; path: string };
  const sdk = createSDK(getConfig());
  const bucket = sdk.storage.from(bucketName);
  const blob = await bucket.download(path);

  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const base64 = btoa(binary);

  return { data: { fileName: path, contentBase64: base64, contentType: blob.type || "application/octet-stream" } };
}
