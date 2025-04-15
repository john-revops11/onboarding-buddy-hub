
import { z } from "zod";

const emailSchema = z.string().email("Invalid email format");

// Define schema with required fields and proper type validation
export const ClientFormSchema = z.object({
  email: emailSchema.min(1, "Client email is required"),
  companyName: z.string().optional(),
  subscriptionId: z.string().min(1, "Subscription tier is required"),
  // Explicitly define addons as string array with default empty array
  addons: z.array(z.string()).default([]),
  teamMembers: z.array(
    z.object({
      email: emailSchema.min(1, "Team member email is required"),
    })
  ).default([{ email: "" }]),
  notes: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof ClientFormSchema>;
