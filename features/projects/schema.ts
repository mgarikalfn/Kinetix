import { z } from "zod";

// FIX: z.instanceof(File) is replaced with z.instanceof(Blob)
// to avoid a ReferenceError on the Node.js server.

export const createProjectSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    image: z.union([
        z.instanceof(Blob), // ⬅️ Corrected: Use Blob for server-side validation
        z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
    workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
    name: z.string().trim().min(1, "minimum 1 character Required"),
    image: z.union([
        z.instanceof(Blob), // ⬅️ Corrected: Use Blob for server-side validation
        z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
    workspaceId: z.string(),
});