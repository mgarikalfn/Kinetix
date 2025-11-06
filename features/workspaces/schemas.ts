// features/workspaces/schemas.ts

import { z } from "zod";

// NOTE: You do not need to import 'file' from 'zod', as it's not a Zod utility.
// The import should look like this: import { z } from "zod";

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    image: z.union([
        // FIX: Replaced File with Blob, as Blob is available in Node.js runtime.
        z.instanceof(Blob), 
        z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});  

export const updateWorkspaceSchema = z.object({
    name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
    image: z.union([
        // FIX: Replaced File with Blob.
        z.instanceof(Blob),
        z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});