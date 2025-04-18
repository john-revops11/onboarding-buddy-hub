// src/pages/dashboard/DashboardPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useAnalyticsDashboards } from "@/hooks/use-analytics-dashboards";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const user = state.user;

  const clientId = user?.id ?? "";
  const tier = user?.platformTier ?? "Standard";
  const fullName = user?.fullName ?? "there";
  const isOnboardingComplete = user?.onboardingStatus === "Complete";

  const { dashboards, loading, error } = useAnalyticsDashboards(tier, clientId);

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-in">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {fullName}!</p>
        </header>

        {/* Quick Actions */}
        <QuickActions
          showOnboardingButton={!isOnboardingComplete}
          supportUrl={user?.supportUrl ?? "#"}
          kbUrl={user?.kbUrl ?? "#"}
          meetingUrl={user?.meetingUrl}
        />

        {/* Analytics Hub */}
        <AnimatePresence>
          {isOnboardingComplete && (
            <motion.section
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <BarChart3 size={20} />
                  Revify Analytics Hub
                </h2>
                <p className="text-muted-foreground text-sm">
                  Access your performance dashboards and analytics on Tableau Online.
                </p>
              </div>

              {/* Dashboards */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-36 w-full rounded-xl animate-pulse" />
                  ))}
                </div>
              )}

              {error && (
                <motion.div
                  className="text-destructive bg-destructive/10 p-4 rounded-lg"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                >
                  Could not load dashboard links. Please try again later or contact support.
                </motion.div>
              )}

              {!loading && dashboards.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Your analytics dashboards are being prepared or are not yet available.
                </p>
              )}

              {!loading && dashboards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dashboards.map((dash) => (
                    <motion.div
                      key={dash.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader>
                          <CardTitle>{dash.name}</CardTitle>
                          {dash.description && (
                            <CardDescription>{dash.description}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <Button
                            asChild
                            variant="secondary"
                            className="gap-2 mt-2 w-full justify-center"
                          >
                            <a
                              href={dash.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open Dashboard
                              <ArrowRight size={16} />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Onboarding Prompt */}
        {!isOnboardingComplete && (
          <motion.div
            className="mt-6 border border-muted rounded-lg p-6 bg-muted/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-2">Finish Setting Up</h3>
            <p className="text-muted-foreground mb-4">
              You still have a few onboarding steps to complete before unlocking your analytics dashboard.
            </p>
            <Button onClick={() => navigate("/onboarding")}>
              Continue Onboarding
            </Button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;