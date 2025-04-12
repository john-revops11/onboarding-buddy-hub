
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, User, Building, Package, Plus as PlusIcon, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/client-management";
import { getSubscriptionTiers } from "@/lib/subscription-management";
import { getAddons } from "@/lib/addon-management";
import { ClientFormValues as ClientFormValueType } from "@/lib/types/client-types";
import { Loader2 } from "lucide-react";

const emailSchema = z.string().email("Invalid email format");

// Define schema with required fields matching ClientFormValueType
const clientSchema = z.object({
  email: emailSchema.min(1, "Client email is required"),
  companyName: z.string().optional(),
  subscriptionTierId: z.string().min(1, "Subscription tier is required"),
  addons: z.array(z.string()),
  teamMembers: z.array(
    z.object({
      email: emailSchema.min(1, "Team member email is required"),
    })
  ),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export function ClientOnboardingForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("client-info");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      email: "",
      companyName: "",
      subscriptionTierId: "",
      addons: [],
      teamMembers: [{ email: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });

  const selectedAddons = form.watch("addons");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [subscriptionsData, addonsData] = await Promise.all([
          getSubscriptionTiers(),
          getAddons()
        ]);
        
        setSubscriptions(subscriptionsData);
        setAddons(addonsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Failed to load data",
          description: "Could not load subscription tiers and add-ons",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [toast]);

  const handleTabChange = (value: string) => {
    form.trigger();
    setActiveTab(value);
  };

  const nextTab = async () => {
    const tabOrder = ["client-info", "subscription", "addons", "team", "confirm"];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    if (currentIndex < tabOrder.length - 1) {
      // Validate the current tab's fields before proceeding
      let shouldProceed = false;
      
      switch(activeTab) {
        case "client-info":
          shouldProceed = await form.trigger(["email", "companyName"]);
          break;
        case "subscription":
          shouldProceed = await form.trigger("subscriptionTierId");
          break;
        case "addons":
          shouldProceed = true; // Addons are optional
          break;
        case "team":
          // Validate all team member emails
          shouldProceed = await form.trigger("teamMembers");
          break;
        default:
          shouldProceed = true;
      }
      
      if (shouldProceed) {
        setActiveTab(tabOrder[currentIndex + 1]);
      }
    }
  };

  const prevTab = () => {
    const tabOrder = ["client-info", "subscription", "addons", "team", "confirm"];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  const toggleAddon = (addonId: string) => {
    const current = form.getValues("addons");
    if (current.includes(addonId)) {
      form.setValue(
        "addons",
        current.filter((id) => id !== addonId)
      );
    } else {
      form.setValue("addons", [...current, addonId]);
    }
  };

  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      // Cast data to ClientFormValueType to ensure compatibility
      const clientData: ClientFormValueType = {
        email: data.email,
        companyName: data.companyName,
        subscriptionTierId: data.subscriptionTierId,
        addons: data.addons,
        teamMembers: data.teamMembers
      };
      
      await createClient(clientData);
      
      toast({
        title: "Client onboarding initiated",
        description: "Invitations have been sent to the client and team members.",
      });
      
      // Navigate back to admin dashboard
      navigate("/admin/onboarding");
    } catch (error) {
      console.error("Error submitting client onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to onboard client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading data...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="client-info" className="flex gap-2 items-center">
              <Building size={16} /> Client Info
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex gap-2 items-center">
              <Package size={16} /> Subscription
            </TabsTrigger>
            <TabsTrigger value="addons" className="flex gap-2 items-center">
              <PlusIcon size={16} /> Add-ons
            </TabsTrigger>
            <TabsTrigger value="team" className="flex gap-2 items-center">
              <Users size={16} /> Team
            </TabsTrigger>
            <TabsTrigger value="confirm" className="flex gap-2 items-center">
              <User size={16} /> Confirm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="client-info" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="client@company.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Primary contact email for the client
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp" {...field} />
                      </FormControl>
                      <FormDescription>
                        Client's company or organization name (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="button" onClick={nextTab}>Next: Subscription</Button>
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="subscriptionTierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription Tier *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subscription tier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subscriptions.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name} - ${sub.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the subscription plan for this client
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevTab}>
                Previous: Client Info
              </Button>
              <Button type="button" onClick={nextTab}>
                Next: Add-ons
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="addons" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <FormLabel>Available Add-ons</FormLabel>
                <FormDescription className="mb-4">
                  Select any additional services for this client
                </FormDescription>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addons.map((addon) => (
                    <div
                      key={addon.id}
                      className={`border rounded-md p-4 cursor-pointer transition-colors ${
                        selectedAddons.includes(addon.id)
                          ? "border-primary bg-primary/10"
                          : "hover:border-muted-foreground"
                      }`}
                      onClick={() => toggleAddon(addon.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedAddons.includes(addon.id)}
                          onCheckedChange={() => toggleAddon(addon.id)}
                        />
                        <div>
                          <p className="font-medium">{addon.name} - ${addon.price}</p>
                          <p className="text-sm text-muted-foreground">
                            {addon.description}
                          </p>
                          {addon.tags && addon.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {addon.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevTab}>
                Previous: Subscription
              </Button>
              <Button type="button" onClick={nextTab}>
                Next: Team Members
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>Team Member Emails</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ email: "" })}
                    className="flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Team Member
                  </Button>
                </div>
                <FormDescription>
                  Add emails of team members who should have access
                </FormDescription>

                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`teamMembers.${index}.email`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input 
                              placeholder="team.member@company.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (fields.length > 1) {
                          remove(index);
                        }
                      }}
                      disabled={fields.length <= 1}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevTab}>
                Previous: Add-ons
              </Button>
              <Button type="button" onClick={nextTab}>
                Next: Confirm
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="confirm" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Client Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Email:</div>
                    <div>{form.getValues("email")}</div>
                    <div className="text-sm text-muted-foreground">Company:</div>
                    <div>{form.getValues("companyName") || "Not specified"}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Subscription</h3>
                  <div>
                    {subscriptions.find(
                      (s) => s.id === form.getValues("subscriptionTierId")
                    )?.name || "None selected"}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Add-ons</h3>
                  {selectedAddons.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedAddons.map((addonId) => (
                        <Badge key={addonId} variant="secondary">
                          {addons.find((a) => a.id === addonId)?.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div>No add-ons selected</div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                  {form.getValues("teamMembers").length > 0 ? (
                    <ul className="space-y-1">
                      {form.getValues("teamMembers").map((member, index) => (
                        <li key={index}>{member.email}</li>
                      ))}
                    </ul>
                  ) : (
                    <div>No team members added</div>
                  )}
                </div>

                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm">
                    An invitation email will be sent to the client and all team members
                    upon submission.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevTab}>
                Previous: Team Members
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit & Send Invitations"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
