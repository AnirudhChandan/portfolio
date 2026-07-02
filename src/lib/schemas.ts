import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
