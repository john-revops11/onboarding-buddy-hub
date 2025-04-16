import { z } from "zod";

const emailSchema = z.string().email("Invalid email format");

export const ClientFormSchema = z.object({
  email: emailSchema.min(1, "Client email is required"),
  companyName: z.string().optional(),
  subscriptionId: z.string().min(1, "Subscription tier is required"),
  
  addons: z.array(z.string()).default([]),
  
  teamMembers: z.array(
    z.object({
      email: emailSchema.min(1, "Team member email is required"),
    })
  ).default([{ email: "" }]),

  notes: z.string().optional(),

  // ✅ New fields added
  industry: z.string().optional(),
  contactPerson: z.string().optional(),
  position: z.string().optional(),
  companySize: z.enum([
    "1-10",
    "11-50",
    "51-250",
    "251-1000",
    "1001+"
  ]).optional(),
});

export type ClientFormValues = z.infer<typeof ClientFormSchema>;
