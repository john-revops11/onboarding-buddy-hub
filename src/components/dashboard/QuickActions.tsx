import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ExternalLink, MoveRight } from 'lucide-react';
import { isOnboardingComplete } from '@/utils/onboardingUtils';

export const QuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [onboardingComplete, setOnboardingComplete] = useState(isOnboardingComplete());
  const [clientTier, setClientTier] = useState('basic'); // Example: Fetch from API
  const [supportConfig, setSupportConfig] = useState({
    supportUrl: 'mailto:support@revify.com',
    knowledgeBaseUrl: '/knowledge-hub', // Default to internal route
    bookingUrl: 'https://calendly.com/revify/support',
  });

  // Fetch client tier and support config from Admin Portal
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Replace with actual API call, e.g., const response = await api.get('/admin/config');
        const response = {
          clientTier: 'premium', // Example
          supportConfig: {
            supportUrl: 'https://revify.com/support',
            knowledgeBaseUrl: 'https://revify.notion.site/Knowledge-Base', // External URL example
            bookingUrl: 'https://calendly.com/revify/support',
          },
        };
        setClientTier(response.clientTier);
        setSupportConfig(response.supportConfig);
      } catch (error) {
        console.error('Failed to fetch config:', error);
        toast({
          title: 'Error',
          description: 'Failed to load quick action configurations.',
          variant: 'destructive',
        });
      }
    };
    fetchConfig();
  }, [toast]);

  const handleSupportClick = () => {
    window.open(supportConfig.supportUrl, '_blank');
    toast({
      title: 'Support Request',
      description: 'Redirecting to support channel.',
    });
  };

  const handleKnowledgeBaseClick = () => {
    if (supportConfig.knowledgeBaseUrl.startsWith('/')) {
      navigate(supportConfig.knowledgeBaseUrl);
    } else {
      window.open(supportConfig.knowledgeBaseUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {!onboardingComplete && (
        <Button
          variant="outline"
          className="bg-[#F2FCE2] border-[#68b046] text-[#68b046] hover:bg-[#68b046]/10 px-6 py-2 rounded-full flex items-center"
          onClick={() => navigate('/onboarding')}
        >
          <span className="mr-3">View Onboarding Progress</span>
          <MoveRight className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="outline"
        className="bg-[#F2FCE2] border-[#68b046] text-[#68b046] hover:bg-[#68b046]/10 px-6 py-2 rounded-full flex items-center"
        onClick={handleKnowledgeBaseClick}
      >
        <span className="mr-3">Access Knowledge Base</span>
        {supportConfig.knowledgeBaseUrl.startsWith('/') ? (
          <MoveRight className="h-4 w-4" />
        ) : (
          <ExternalLink className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="secondary"
        className="bg-[#68b046]/20 hover:bg-[#68b046]/30 text-[#68b046] px-6 py-2 rounded-full flex items-center"
        onClick={handleSupportClick}
      >
        <span className="mr-3">Contact Support</span>
        <ExternalLink className="h-4 w-4" />
      </Button>
      {clientTier === 'premium' && (
        <Button
          variant="outline"
          className="bg-[#F2FCE2] border-[#68b046] text-[#68b046] hover:bg-[#68b046]/10 px-6 py-2 rounded-full flex items-center"
          onClick={() => window.open(supportConfig.bookingUrl, '_blank')}
        >
          <span className="mr-3">Schedule Ad-hoc Call</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
