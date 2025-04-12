
import { z } from "zod";

const emailSchema = z.string().email("Invalid email format");

// Define schema with required fields
export const ClientFormSchema = z.object({
  email: emailSchema.min(1, "Client email is required"),
  companyName: z.string().optional(),
  subscriptionTierId: z.string().min(1, "Subscription tier is required"),
  addons: z.array(z.string()).default([]),
  teamMembers: z.array(
    z.object({
      email: emailSchema.min(1, "Team member email is required"),
    })
  ).default([{ email: "" }]),
});

export type ClientFormValues = z.infer<typeof ClientFormSchema>;
