
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  teamMembers: z.array(z.string().email("Invalid email format")).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser, state } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [isInvited, setIsInvited] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("");
  const [isTeamMembersOpen, setIsTeamMembersOpen] = useState(false);
  const [teamMemberInput, setTeamMemberInput] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);

  useEffect(() => {
    // Parse query parameters for invitation
    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    
    if (email) {
      setIsInvited(true);
      setInvitedEmail(email);
    }
  }, [location]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: invitedEmail || "",
      companyName: "",
      password: "",
      teamMembers: [],
    },
  });

  // Update form when invited email changes
  useEffect(() => {
    if (invitedEmail) {
      form.setValue("email", invitedEmail);
    }
  }, [invitedEmail, form]);

  const addTeamMember = () => {
    if (teamMemberInput && teamMemberInput.includes("@")) {
      if (!teamMembers.includes(teamMemberInput)) {
        const newTeamMembers = [...teamMembers, teamMemberInput];
        setTeamMembers(newTeamMembers);
        form.setValue("teamMembers", newTeamMembers);
      }
      setTeamMemberInput("");
    }
  };

  const removeTeamMember = (email: string) => {
    const newTeamMembers = teamMembers.filter((member) => member !== email);
    setTeamMembers(newTeamMembers);
    form.setValue("teamMembers", newTeamMembers);
  };

  const handleTeamMemberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTeamMember();
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Register the user
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
      });

      // In a real implementation, we would also send invitations to team members here
      if (data.teamMembers && data.teamMembers.length > 0) {
        console.log("Would send invitations to:", data.teamMembers);
      }

      setRegistrationComplete(true);
      toast({
        title: "Registration successful",
        description: "Account created successfully. Awaiting approval.",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative">
      {/* Dynamic background */}
      <AuthBackground />
      
      <div className="w-full max-w-md relative z-10">
        <Card className="w-full shadow-lg border-green-base/20 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <img
                src="/lovable-uploads/6a698e8c-e0d7-4380-bf89-d405719f85fc.png"
                alt="Revify Logo"
                className="w-48 h-auto object-contain"
              />
            </div>
            <CardDescription className="text-center">
              {isInvited 
                ? "Complete your registration to join your organization" 
                : "Create an account to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrationComplete ? (
              <div className="space-y-4">
                <Alert className="border-green-base/50 bg-green-base/10">
                  <AlertTitle className="text-green-base">Registration successful!</AlertTitle>
                  <AlertDescription>
                    Your account has been created and is pending admin approval. You will be notified when your account is approved.
                    {teamMembers.length > 0 && (
                      <p className="mt-2">
                        Invitations have been sent to {teamMembers.length} team member{teamMembers.length > 1 ? 's' : ''}.
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={() => navigate("/login")} 
                  className="w-full bg-green-base hover:bg-green-hover"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
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
                          <Input 
                            type="email" 
                            placeholder="john@example.com" 
                            disabled={isInvited}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Collapsible
                    open={isTeamMembersOpen}
                    onOpenChange={setIsTeamMembersOpen}
                    className="border rounded-md p-3"
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex w-full justify-between"
                      >
                        <span>Want to invite your team?</span>
                        <span>{isTeamMembersOpen ? "Hide" : "Show"}</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      <div className="text-sm text-muted-foreground mb-2">
                        Add email addresses of team members you'd like to invite
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {teamMembers.map((email) => (
                          <Badge key={email} variant="secondary" className="flex items-center gap-1">
                            {email}
                            <X
                              size={14}
                              className="cursor-pointer"
                              onClick={() => removeTeamMember(email)}
                            />
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="team.member@example.com"
                          value={teamMemberInput}
                          onChange={(e) => setTeamMemberInput(e.target.value)}
                          onKeyDown={handleTeamMemberKeyDown}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addTeamMember}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Button type="submit" className="w-full bg-green-base hover:bg-green-hover" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                  
                  {state.error && (
                    <p className="text-sm text-destructive text-center">{state.error}</p>
                  )}
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-green-base font-semibold hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
