import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "storage_upload_auto",
    description: "Uploads a file with an auto-generated unique key.",
    inputSchema: z.object({
      bucketName: z.string().describe("Storage bucket name"),
      fileName: z.string().describe("Original file name for MIME type detection"),
      fileContentBase64: z.string().describe("File content encoded as base64"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { bucketName, fileName, fileContentBase64 } = args as {
    bucketName: string;
    fileName: string;
    fileContentBase64: string;
  };
  const sdk = createSDK(getConfig());
  const bucket = sdk.storage.from(bucketName);

  const mimeType = fileName.endsWith(".json")
    ? "application/json"
    : fileName.endsWith(".txt")
    ? "text/plain"
    : fileName.endsWith(".png")
    ? "image/png"
    : fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")
    ? "image/jpeg"
    : fileName.endsWith(".pdf")
    ? "application/pdf"
    : fileName.endsWith(".html")
    ? "text/html"
    : fileName.endsWith(".md")
    ? "text/markdown"
    : "application/octet-stream";

  const binaryData = Uint8Array.from(atob(fileContentBase64), (char) => char.charCodeAt(0));
  const blob = new Blob([binaryData], { type: mimeType });
  const result = await bucket.uploadAuto(blob);

  return { data: result };
}
