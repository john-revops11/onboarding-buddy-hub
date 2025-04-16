import { z } from "zod";

const emailSchema = z.string().email("Invalid email format");

export const ClientFormSchema = z.object({
  email: emailSchema.min(1, "Client email is required"),
  companyName: z.string().optional(),
  contactPerson: z.string().optional(),
  position: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.enum([
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+"
  ]).optional(),
  subscriptionId: z.string().min(1, "Subscription tier is required"),
  addons: z.array(z.string()).default([]),
  teamMembers: z.array(
    z.object({
      email: emailSchema.min(1, "Team member email is required"),
    })
  ).default([{ email: "" }]),
  notes: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof ClientFormSchema>;
