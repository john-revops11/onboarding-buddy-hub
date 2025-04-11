
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Elevate Your Business with Revify
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The complete business analytics and consulting platform designed to optimize your operations and boost your growth.
          </p>
          <div>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="px-8"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Powerful Features for Your Business</h2>
            <p className="text-gray-600 mt-2">Explore what Revify can do for your company</p>
          </div>

          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="insights">Business Insights</TabsTrigger>
              <TabsTrigger value="diagnostics">Diagnostic Reviews</TabsTrigger>
              <TabsTrigger value="onboarding">Streamlined Onboarding</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data-Driven Business Insights</CardTitle>
                  <CardDescription>
                    Transform your data into actionable business intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Comprehensive Analytics</h3>
                    <p className="text-sm text-gray-600">
                      Deep analytics to help you understand performance trends, customer behavior, and growth opportunities
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Custom Reporting</h3>
                    <p className="text-sm text-gray-600">
                      Generate tailored reports that focus on your specific business metrics and KPIs
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="diagnostics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comprehensive Diagnostic Reviews</CardTitle>
                  <CardDescription>
                    In-depth analysis of your business operations and performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Operational Assessment</h3>
                    <p className="text-sm text-gray-600">
                      Detailed evaluation of your processes to identify inefficiencies and improvement opportunities
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Strategic Recommendations</h3>
                    <p className="text-sm text-gray-600">
                      Expert recommendations based on industry best practices and your specific business context
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="onboarding" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Streamlined Client Onboarding</CardTitle>
                  <CardDescription>
                    Efficient and user-friendly onboarding process for clients
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Guided Setup</h3>
                    <p className="text-sm text-gray-600">
                      Step-by-step onboarding process with clear instructions and support
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Team Collaboration</h3>
                    <p className="text-sm text-gray-600">
                      Easy team member invitations and role assignments to get your whole team on board
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Revify</h3>
            <p className="text-gray-400">
              The complete business analytics and consulting platform for growth-oriented companies.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/login" className="text-gray-400 hover:text-white">Login</a></li>
              <li><a href="/register" className="text-gray-400 hover:text-white">Register</a></li>
              <li><a href="/client-registration" className="text-gray-400 hover:text-white">Client Registration</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">
              Have questions? Reach out to our support team for assistance.
            </p>
            <Button variant="outline" className="mt-4 bg-transparent text-white border-white hover:bg-white hover:text-gray-800">
              Contact Support
            </Button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Revify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
