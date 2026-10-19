import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

const documentStatusSchema = z.enum(["draft", "published"]);
const documentScopeSchema = z.enum(["public", "organization", "project"]);
const documentOrientationSchema = z.enum(["portrait", "landscape"]);

export function toolMeta() {
  return {
    name: "documents_update_document",
    description: "Updates an existing document's title, description, orientation, status, scope, or password.",
    inputSchema: z.object({
      documentId: z.string().describe("Document identifier"),
      title: z.string().optional().describe("New display title"),
      description: z.string().optional().describe("New short summary"),
      orientation: documentOrientationSchema.optional().describe("New A4 sheet orientation"),
      status: documentStatusSchema.optional().describe("New publication status"),
      scope: documentScopeSchema.optional().describe("New sharing scope"),
      passwordHash: z.string().nullable().optional().describe("SHA-256 hex hash of the password protecting the document; pass null to remove it"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { documentId, workspacePath, ...payload } = args as {
    documentId: string;
    title?: string;
    description?: string;
    orientation?: string;
    status?: string;
    scope?: string;
    passwordHash?: string | null;
    workspacePath: string;
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.documents.updateDocument(documentId, payload as any);

  return { data: result };
}