
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ClientInfoForm from "./form-tabs/ClientInfoForm";
import SubscriptionForm from "./form-tabs/SubscriptionForm";
import AddonsForm from "./form-tabs/AddonsForm";
import TeamMembersForm from "./form-tabs/TeamMembersForm";
import ConfirmationTab from "./form-tabs/ConfirmationTab";
import FormNavigation from "./form-tabs/FormNavigation";
import { useClientOnboarding } from "./hooks/useClientOnboarding";
import { FormTabs } from "./components/FormTabs";
import { LoadingIndicator } from "./components/LoadingIndicator";
import { SubmitActions } from "./components/SubmitActions";

export function ClientOnboardingForm() {
  const {
    form,
    isLoading,
    isSubmitting,
    activeTab,
    subscriptions,
    addons,
    selectedAddons,
    handleTabChange,
    nextTab,
    prevTab,
    toggleAddon,
    onSubmit
  } = useClientOnboarding();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <FormTabs />
          </TabsList>

          <TabsContent value="client-info" className="space-y-4 mt-4">
            <Card>
              <ClientInfoForm form={form} />
            </Card>
            <FormNavigation nextTab={nextTab} showPrevious={false} />
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4 mt-4">
            <Card>
              <SubscriptionForm form={form} subscriptions={subscriptions} />
            </Card>
            <FormNavigation prevTab={prevTab} nextTab={nextTab} />
          </TabsContent>

          <TabsContent value="addons" className="space-y-4 mt-4">
            <Card>
              <AddonsForm 
                form={form} 
                addons={addons} 
                selectedAddons={selectedAddons} 
                toggleAddon={toggleAddon}
              />
            </Card>
            <FormNavigation prevTab={prevTab} nextTab={nextTab} />
          </TabsContent>

          <TabsContent value="team" className="space-y-4 mt-4">
            <Card>
              <TeamMembersForm form={form} />
            </Card>
            <FormNavigation prevTab={prevTab} nextTab={nextTab} />
          </TabsContent>

          <TabsContent value="confirm" className="space-y-4 mt-4">
            <Card>
              <ConfirmationTab 
                form={form} 
                subscriptions={subscriptions} 
                addons={addons}
                selectedAddons={selectedAddons}
              />
            </Card>
            <SubmitActions 
              isSubmitting={isSubmitting} 
              onPrev={prevTab} 
            />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}

export default ClientOnboardingForm;
