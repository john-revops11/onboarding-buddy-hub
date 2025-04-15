
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Award, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { getSubscriptionTiers } from "@/lib/subscription-management";
import { getAddons } from "@/lib/addon-management";
import { SubscriptionTier, Addon } from "@/lib/types/client-types";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SubscriptionDetailsProps {
  currentSubscriptionId?: string;
  currentAddonIds?: string[];
  isReadOnly?: boolean;
}

export default function SubscriptionDetails({ 
  currentSubscriptionId, 
  currentAddonIds = [], 
  isReadOnly = false 
}: SubscriptionDetailsProps) {
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [subscriptions, setSubscriptions] = useState<SubscriptionTier[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | undefined>(currentSubscriptionId);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(currentAddonIds);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [subscriptionData, addonData] = await Promise.all([
          getSubscriptionTiers(),
          getAddons()
        ]);
        
        setSubscriptions(subscriptionData);
        setAddons(addonData);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const currentSubscription = subscriptions.find(sub => sub.id === selectedSubscriptionId);
  const currentAddons = addons.filter(addon => selectedAddonIds.includes(addon.id));
  
  const totalMonthlyPrice = (
    (currentSubscription?.price || 0) + 
    currentAddons.reduce((total, addon) => total + (addon.price || 0), 0)
  );

  const toggleAddon = (addonId: string) => {
    if (isReadOnly) return;
    
    setSelectedAddonIds(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId) 
        : [...prev, addonId]
    );
  };

  const selectSubscription = (subscriptionId: string) => {
    if (isReadOnly) return;
    setSelectedSubscriptionId(subscriptionId);
  };

  const handleSaveChanges = () => {
    // This would be implemented when connecting to a payment processor
    toast({
      title: "Changes Saved",
      description: "Your subscription changes have been saved.",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <p>Loading subscription details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
          <CardDescription>
            Current plan and add-ons
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {currentSubscription ? (
              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-brand mt-0.5" />
                    <div>
                      <h3 className="font-medium text-lg">{currentSubscription.name}</h3>
                      <p className="text-sm text-muted-foreground">{currentSubscription.description}</p>
                      
                      {currentSubscription.features && currentSubscription.features.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Included features:</p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                            {currentSubscription.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-brand flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <span className="text-2xl font-bold">${currentSubscription.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                </div>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No subscription plan selected</AlertTitle>
                <AlertDescription>
                  Please select a subscription plan below.
                </AlertDescription>
              </Alert>
            )}

            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Additional Services</h3>
              
              {currentAddons.length > 0 ? (
                <div className="space-y-3">
                  {currentAddons.map(addon => (
                    <div key={addon.id} className="border rounded-md p-3 flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Tag className="h-5 w-5 text-brand mt-0.5" />
                        <div>
                          <h4 className="font-medium">{addon.name}</h4>
                          <p className="text-sm text-muted-foreground">{addon.description}</p>
                          {addon.tags && addon.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {addon.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">${addon.price}</span>
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No additional services selected.</p>
              )}
            </div>

            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total Monthly Cost</span>
              <div>
                <span className="text-2xl font-bold">${totalMonthlyPrice.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </div>
          </div>
        </CardContent>

        {!isReadOnly && (
          <CardFooter className="flex justify-end">
            <Button variant="brand" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>

      {!isReadOnly && (
        <>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Available Subscription Plans</CardTitle>
              <CardDescription>
                Choose a plan that fits your needs
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptions.map(subscription => (
                  <div 
                    key={subscription.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedSubscriptionId === subscription.id 
                        ? "border-brand bg-brand-50" 
                        : "hover:border-brand-200"
                    }`}
                    onClick={() => selectSubscription(subscription.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{subscription.name}</h3>
                      <Badge variant={selectedSubscriptionId === subscription.id ? "brand" : "outline"}>
                        {selectedSubscriptionId === subscription.id ? "Current" : "Select"}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{subscription.description}</p>
                    
                    <div className="mb-3">
                      <span className="text-xl font-bold">${subscription.price}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                    
                    {subscription.features && subscription.features.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Included features:</p>
                        <ul className="space-y-1">
                          {subscription.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3.5 w-3.5 text-brand flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Available Add-ons</CardTitle>
              <CardDescription>
                Enhance your subscription with additional services
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addons.map(addon => (
                  <div 
                    key={addon.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedAddonIds.includes(addon.id) 
                        ? "border-brand bg-brand-50" 
                        : "hover:border-brand-200"
                    }`}
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{addon.name}</h3>
                      <Badge variant={selectedAddonIds.includes(addon.id) ? "brand" : "outline"}>
                        {selectedAddonIds.includes(addon.id) ? "Selected" : "Add"}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{addon.description}</p>
                    
                    <div className="mb-2">
                      <span className="text-lg font-bold">${addon.price}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                    
                    {addon.tags && addon.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {addon.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
