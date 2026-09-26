import { z } from "zod";

export const updateCodeSchema = z.object({
    active: z.boolean()
}).strict();