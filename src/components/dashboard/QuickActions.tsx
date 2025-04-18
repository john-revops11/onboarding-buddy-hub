import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageSquare, Calendar } from 'lucide-react';
import { isOnboardingComplete } from '@/utils/onboardingUtils';

type QuickActionsProps = {
  showTitle?: boolean;
};

export const QuickActions = ({ showTitle = true }: QuickActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [onboardingComplete, setOnboardingComplete] = useState(isOnboardingComplete());
  const [clientTier, setClientTier] = useState('basic');
  const [supportConfig, setSupportConfig] = useState({
    supportUrl: 'mailto:support@revify.com',
    knowledgeBaseUrl: '/knowledge-hub',
    bookingUrl: 'https://calendly.com/revify/support',
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = {
          clientTier: 'premium',
          supportConfig: {
            supportUrl: 'https://revify.com/support',
            knowledgeBaseUrl: 'https://revify.notion.site/Knowledge-Base',
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
    <div className="flex flex-col items-center gap-4 w-full my-[5px]">
      {showTitle && (
        <h2 className="text-lg md:text-xl font-semibold text-center">Quick Actions</h2>
      )}
      {!onboardingComplete && (
        <Button
          variant="outline"
          className="w-[80%] bg-[#F2FCE2] border-[#68b046] text-[#68b046] hover:bg-[#68b046]/10 px-6 py-2 rounded-full flex items-center justify-center"
          onClick={() => navigate('/onboarding')}
        >
          <BookOpen className="h-4 w-4 mr-2 text-[#68b046]" />
          <span>View Onboarding Progress</span>
        </Button>
      )}
      <Button
        variant="outline"
        className="w-[80%] bg-[#F2FCE2] border-[#68b046] text-[#68b046] hover:bg-[#68b046]/10 px-6 py-2 rounded-full flex items-center justify-center"
        onClick={handleKnowledgeBaseClick}
      >
        <BookOpen className="h-4 w-4 mr-2 text-[#68b046]" />
        <span>Access Knowledge Base</span>
      </Button>
      <Button
        variant="secondary"
        className="w-[80%] bg-[#68b046]/20 border-[#68b046] hover:bg-[#68b046]/30 text-[#68b046] px-6 py-2 rounded-full flex items-center justify-center"
        onClick={handleSupportClick}
      >
        <MessageSquare className="h-4 w-4 mr-2 text-[#68b046]" />
        <span>Contact Support</span>
      </Button>
      {clientTier === 'premium' && (
        <Button
          variant="outline"
          className="w-[80%] bg-[#F2FCE2] border-[#68b046] text-[#68b046] hover:bg-[#68b046]/10 px-6 py-2 rounded-full flex items-center justify-center"
          onClick={() => window.open(supportConfig.bookingUrl, '_blank')}
        >
          <Calendar className="h-4 w-4 mr-2 text-[#68b046]" />
          <span>Schedule Ad-hoc Call</span>
        </Button>
      )}
    </div>
  );
};
