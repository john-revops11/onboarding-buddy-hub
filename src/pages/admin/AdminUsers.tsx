
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Edit, Eye, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/auth";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["user", "admin"]),
});

type FormValues = z.infer<typeof formSchema>;

type UserWithPassword = User & {
  password?: string;
  onboardingStatus?: number;
};

const AdminUsers = () => {
  const { toast } = useToast();
  const { getAllUsers, approveUser, rejectUser } = useAuth();
  const [users, setUsers] = useState<UserWithPassword[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithPassword | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    const fetchUsers = () => {
      const fetchedUsers = getAllUsers().map((user: any) => ({
        ...user,
        onboardingStatus: user.onboardingStatus || (user.status === "approved" ? Math.floor(Math.random() * 70) + 30 : 0),
      }));
      setUsers(fetchedUsers as UserWithPassword[]);
    };

    fetchUsers();
  }, [getAllUsers]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
    },
  });

  const handleSearch = () => {
    refreshUsers();
  };
  
  const refreshUsers = () => {
    let fetchedUsers = getAllUsers();
    
    fetchedUsers = fetchedUsers.map((user: any) => ({
      ...user,
      onboardingStatus: user.onboardingStatus || (user.status === "approved" ? Math.floor(Math.random() * 70) + 30 : 0),
    }));
    
    // Apply status filtering
    let filteredUsers = [...fetchedUsers];
    if (statusFilter !== "all") {
      filteredUsers = filteredUsers.filter((user: any) => user.status === statusFilter);
    }
    
    // Apply search term filtering
    if (searchTerm) {
      filteredUsers = filteredUsers.filter((user: any) => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setUsers(filteredUsers as UserWithPassword[]);
  };

  const handleEdit = (user: UserWithPassword) => {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleApprove = (userId: string) => {
    approveUser(userId);
    refreshUsers();
    toast({
      title: "User approved",
      description: "User can now log in to the platform.",
    });
  };

  const handleReject = (userId: string) => {
    rejectUser(userId);
    refreshUsers();
    toast({
      title: "User rejected",
      description: "User registration has been rejected.",
    });
  };

  const onSubmit = (data: FormValues) => {
    if (selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...data } 
          : user
      ));
      
      toast({
        title: "User updated",
        description: `${data.name}'s information has been updated.`
      });
    } else {
      const newUser: UserWithPassword = {
        id: `${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: new Date().toISOString(),
        status: "approved",
        onboardingStatus: 0,
      };
      
      setUsers([...users, newUser]);
      
      toast({
        title: "User added",
        description: `${data.name} has been added to the system.`
      });
    }
    
    form.reset({
      name: "",
      email: "",
      role: "user",
    });
    setSelectedUser(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          View, search, and manage users in the system.
        </p>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Input 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button variant="outline" size="icon" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <select 
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "all" | "pending" | "approved" | "rejected");
                setTimeout(refreshUsers, 0);
              }}
            >
              <option value="all">All Users</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedUser ? "Edit User" : "Add New User"}</DialogTitle>
                  <DialogDescription>
                    {selectedUser 
                      ? "Edit user information and role." 
                      : "Fill in the details to add a new user to the system."}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <select
                              className="w-full h-10 px-3 rounded-md border border-input bg-background"
                              {...field}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">
                        {selectedUser ? "Update User" : "Add User"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              A list of all users registered in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Role</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Onboarding Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4 capitalize">{user.role}</td>
                      <td className="py-3 px-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-200 w-24 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${user.onboardingStatus}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{user.onboardingStatus}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {user.status === "pending" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-green-500 hover:bg-green-50 text-green-600"
                                onClick={() => handleApprove(user.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-red-500 hover:bg-red-50 text-red-600"
                                onClick={() => handleReject(user.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {user.status === "rejected" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-green-500 hover:bg-green-50 text-green-600"
                              onClick={() => handleApprove(user.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "User details",
                                description: `Viewing details for ${user.name}`,
                              });
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEdit(user)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-muted-foreground">
                        No users found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
