
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckSquare, Circle, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ViewAssignedChecklist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock data - in a real app would be fetched from API based on the id
  const assignment = {
    id,
    progress: 30,
    assignedDate: "2023-06-15",
    user: {
      name: "Test User",
      email: "user@example.com",
      avatar: ""
    },
    checklist: {
      title: "New Client Onboarding",
      description: "Standard onboarding process for new clients",
      items: [
        {
          id: "1",
          text: "Collect client information",
          description: "Gather basic contact and business details",
          completed: true
        },
        {
          id: "2",
          text: "Set up initial meeting",
          description: "Schedule kickoff call with the client",
          completed: true
        },
        {
          id: "3",
          text: "Document requirements",
          description: "Capture detailed project requirements",
          completed: false
        },
        {
          id: "4",
          text: "Create project plan",
          description: "Develop timeline and milestones",
          completed: false
        },
      ]
    }
  };

  const completedItems = assignment.checklist.items.filter(item => item.completed).length;
  const totalItems = assignment.checklist.items.length;
  const progressPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/checklists")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            View Assigned Checklist
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={assignment.user.avatar} />
                  <AvatarFallback>
                    {assignment.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{assignment.user.name}</p>
                  <p className="text-sm text-muted-foreground">{assignment.user.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned Date</p>
                <p className="font-medium">{assignment.assignedDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-200 w-24 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{progressPercentage}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">{assignment.checklist.title}</h2>
              <p className="text-muted-foreground mb-4">{assignment.checklist.description}</p>
              
              <div className="space-y-3 mt-6">
                {assignment.checklist.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3 border rounded-lg ${
                      item.completed ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="mt-0.5">
                      {item.completed ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                        {item.text}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                    <div className="ml-auto">
                      {item.completed ? (
                        <Badge variant="success">Completed</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate("/admin/checklists")}
          >
            Back to Checklists
          </Button>
          <Button
            onClick={() => navigate(`/admin/checklists/edit/${id}`)}
          >
            Edit Assignment
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewAssignedChecklist;
