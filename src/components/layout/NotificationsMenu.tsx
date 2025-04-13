
import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, X, Info, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  getPendingNotifications, 
  markNotificationAsRead, 
  clearAllNotifications 
} from "@/utils/onboardingUtils";

export function NotificationsMenu() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  // Load notifications on mount and every 30 seconds
  useEffect(() => {
    loadNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Load notifications from localStorage (or API in real implementation)
  const loadNotifications = () => {
    const loadedNotifications = getPendingNotifications();
    setNotifications(loadedNotifications);
    
    // Count unread notifications
    const unread = loadedNotifications.filter((n: any) => !n.read).length;
    setUnreadCount(unread);
  };

  // Mark a notification as read
  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    loadNotifications();
  };

  // Clear all notifications
  const handleClearAll = () => {
    clearAllNotifications();
    loadNotifications();
    setOpen(false);
    
    toast({
      title: "Notifications cleared",
      description: "All notifications have been cleared.",
    });
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="notification-icon h-5 w-5 text-green-500" />;
      case "info":
        return <Info className="notification-icon h-5 w-5 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="notification-icon h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="notification-icon h-5 w-5 text-blue-500" />;
    }
  };

  // Format notification time
  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 1) {
      return "Just now";
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? "min" : "mins"} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-primary-100">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-lg border-2" align="end">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Notifications</CardTitle>
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearAll}
                className="h-8 px-2 text-xs hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900"
              >
                Clear All
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <CardDescription className="text-primary-700 font-medium">{unreadCount} unread notifications</CardDescription>
          )}
        </CardHeader>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <Bell className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                You don't have any notifications yet.
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification: any) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? "unread" : ""}`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="notification-title">
                        {notification.title}
                      </p>
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      <p className="notification-timestamp">
                        {formatNotificationTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="absolute top-1 right-1 h-6 w-6 hover:bg-neutral-200 opacity-70 hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
