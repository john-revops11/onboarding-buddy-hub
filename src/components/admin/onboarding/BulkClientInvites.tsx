
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Trash2, Download, FileUp, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getOnboardingTemplates } from "@/utils/onboardingUtils";

// CSV format example: client@email.com,Company Name,subscription_id,teammember1@email.com;teammember2@email.com
// Email validation schema
const emailSchema = z.string().email("Invalid email format");

// Bulk invite form schema for paste method
const bulkInviteSchema = z.object({
  inviteData: z.string().min(1, "Client data is required"),
  templateId: z.string().min(1, "Template selection is required"),
});

// Bulk invite form schema for CSV upload
const csvUploadSchema = z.object({
  file: z.any(),
  templateId: z.string().min(1, "Template selection is required"),
});

export function BulkClientInvites() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("paste");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Get onboarding templates
  const templates = getOnboardingTemplates();

  // Form for paste method
  const pasteForm = useForm<z.infer<typeof bulkInviteSchema>>({
    resolver: zodResolver(bulkInviteSchema),
    defaultValues: {
      inviteData: "",
      templateId: "",
    },
  });

  // Form for CSV upload
  const uploadForm = useForm<z.infer<typeof csvUploadSchema>>({
    resolver: zodResolver(csvUploadSchema),
    defaultValues: {
      file: undefined,
      templateId: "",
    },
  });

  // Download CSV template
  const downloadTemplate = () => {
    const csvContent = "client_email,company_name,subscription_tier_id,team_member_emails\nexample@company.com,Example Inc,1,team1@example.com;team2@example.com";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "client_invite_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template downloaded",
      description: "CSV template has been downloaded successfully.",
    });
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(progress);
      }
    };
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        parseCSVContent(content);
        setUploadProgress(100);
      } catch (error) {
        console.error("Error reading file:", error);
        toast({
          title: "Error",
          description: "Failed to read CSV file. Please check the format.",
          variant: "destructive",
        });
        setUploadProgress(0);
        setFileName("");
      }
    };
    
    reader.readAsText(file);
  };

  // Parse CSV content
  const parseCSVContent = (content: string) => {
    const lines = content.split("\n").filter(line => line.trim());
    const headers = lines[0].split(",");
    
    // Check for required headers
    if (!headers.includes("client_email") || 
        !headers.includes("subscription_tier_id")) {
      toast({
        title: "Invalid CSV format",
        description: "CSV must include client_email and subscription_tier_id columns.",
        variant: "destructive",
      });
      setFileName("");
      setUploadProgress(0);
      return;
    }
    
    const parsedData = [];
    const errors = [];
    
    // Skip header row and parse data rows
    for (let i = 1; i < lines.length; i++) {
      const data = lines[i].split(",");
      
      // Check if we have enough columns
      if (data.length < headers.length) {
        errors.push(`Line ${i+1}: Insufficient columns`);
        continue;
      }
      
      // Create object from CSV row
      const rowObject: any = {};
      headers.forEach((header, index) => {
        rowObject[header.trim()] = data[index].trim();
      });
      
      // Validate email
      try {
        emailSchema.parse(rowObject.client_email);
      } catch (error) {
        errors.push(`Line ${i+1}: Invalid email - ${rowObject.client_email}`);
        continue;
      }
      
      // Parse team member emails
      if (rowObject.team_member_emails) {
        const teamEmails = rowObject.team_member_emails.split(";");
        const validTeamEmails = [];
        
        for (const email of teamEmails) {
          try {
            emailSchema.parse(email.trim());
            validTeamEmails.push(email.trim());
          } catch (error) {
            errors.push(`Line ${i+1}: Invalid team email - ${email}`);
          }
        }
        
        rowObject.team_member_emails = validTeamEmails;
      } else {
        rowObject.team_member_emails = [];
      }
      
      parsedData.push(rowObject);
    }
    
    setParsedData(parsedData);
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      toast({
        title: `${errors.length} validation errors found`,
        description: "Check the preview for details.",
        variant: "destructive",
      });
    } else {
      toast({
        title: `${parsedData.length} clients parsed successfully`,
        description: "Review the data and submit to send invitations.",
      });
    }
    
    setShowPreview(true);
  };

  // Handle paste form submission
  const onPasteSubmit = async (data: z.infer<typeof bulkInviteSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Parse pasted data (one client per line)
      const lines = data.inviteData.split("\n").filter(line => line.trim());
      const parsedData = [];
      const errors = [];
      
      for (let i = 0; i < lines.length; i++) {
        const lineData = lines[i].split(",");
        
        // Check if we have at least email and subscription tier
        if (lineData.length < 2) {
          errors.push(`Line ${i+1}: Insufficient data. Format: email,company,subscription_id,team_emails`);
          continue;
        }
        
        const clientEmail = lineData[0].trim();
        
        // Validate email
        try {
          emailSchema.parse(clientEmail);
        } catch (error) {
          errors.push(`Line ${i+1}: Invalid email - ${clientEmail}`);
          continue;
        }
        
        // Parse client data
        const clientData: any = {
          client_email: clientEmail,
          company_name: lineData.length > 1 ? lineData[1].trim() : "",
          subscription_tier_id: lineData.length > 2 ? lineData[2].trim() : "1",
          team_member_emails: [],
        };
        
        // Parse team member emails if provided
        if (lineData.length > 3 && lineData[3].trim()) {
          const teamEmails = lineData[3].split(";");
          const validTeamEmails = [];
          
          for (const email of teamEmails) {
            try {
              emailSchema.parse(email.trim());
              validTeamEmails.push(email.trim());
            } catch (error) {
              errors.push(`Line ${i+1}: Invalid team email - ${email}`);
            }
          }
          
          clientData.team_member_emails = validTeamEmails;
        }
        
        parsedData.push(clientData);
      }
      
      setParsedData(parsedData);
      setValidationErrors(errors);
      
      if (errors.length > 0) {
        toast({
          title: `${errors.length} validation errors found`,
          description: "Please correct the errors and try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        setShowPreview(true);
        return;
      }
      
      // In a real implementation, this would call an API endpoint
      console.log("Bulk client data:", parsedData);
      console.log("Template ID:", data.templateId);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Bulk invitations sent",
        description: `${parsedData.length} client invitations have been sent successfully.`,
      });
      
      // Reset form
      pasteForm.reset();
      setShowPreview(false);
      setParsedData([]);
      setValidationErrors([]);
      
      // Navigate back to clients page
      navigate("/admin/onboarding");
    } catch (error) {
      console.error("Error submitting bulk invites:", error);
      toast({
        title: "Error",
        description: "Failed to send bulk invitations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle CSV upload form submission
  const onUploadSubmit = async (data: z.infer<typeof csvUploadSchema>) => {
    setIsSubmitting(true);
    
    try {
      if (validationErrors.length > 0) {
        toast({
          title: "Cannot proceed with errors",
          description: "Please fix validation errors before submitting.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      if (parsedData.length === 0) {
        toast({
          title: "No data to submit",
          description: "Please upload a valid CSV file with client data.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // In a real implementation, this would call an API endpoint
      console.log("Bulk client data from CSV:", parsedData);
      console.log("Template ID:", data.templateId);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Bulk invitations sent",
        description: `${parsedData.length} client invitations have been sent successfully.`,
      });
      
      // Reset form
      uploadForm.reset();
      setShowPreview(false);
      setParsedData([]);
      setValidationErrors([]);
      setFileName("");
      setUploadProgress(0);
      
      // Navigate back to clients page
      navigate("/admin/onboarding");
    } catch (error) {
      console.error("Error submitting bulk invites from CSV:", error);
      toast({
        title: "Error",
        description: "Failed to send bulk invitations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="paste">Paste Data</TabsTrigger>
          <TabsTrigger value="upload">Upload CSV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="paste" className="space-y-4">
          <Form {...pasteForm}>
            <form onSubmit={pasteForm.handleSubmit(onPasteSubmit)} className="space-y-4">
              <FormField
                control={pasteForm.control}
                name="inviteData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Data</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="client@email.com,Company Name,1,teammember1@email.com;teammember2@email.com" 
                        className="min-h-[200px] font-mono text-sm"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter one client per line in the format: <br />
                      <code>client_email,company_name,subscription_tier_id,team_emails(separated by semicolons)</code>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={pasteForm.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Onboarding Template</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an onboarding template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates.map((template: any) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the onboarding template to use for these clients
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {showPreview && parsedData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Client Data Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {validationErrors.length > 0 && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Validation Errors</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 mt-2 text-sm">
                            {validationErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="rounded-md border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted border-b">
                            <th className="py-2 px-3 text-left font-medium">Email</th>
                            <th className="py-2 px-3 text-left font-medium">Company</th>
                            <th className="py-2 px-3 text-left font-medium">Subscription</th>
                            <th className="py-2 px-3 text-left font-medium">Team Members</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData.map((client, index) => (
                            <tr key={index} className="border-b last:border-0">
                              <td className="py-2 px-3">{client.client_email}</td>
                              <td className="py-2 px-3">{client.company_name || "-"}</td>
                              <td className="py-2 px-3">{client.subscription_tier_id}</td>
                              <td className="py-2 px-3">
                                {client.team_member_emails?.length > 0 
                                  ? client.team_member_emails.join(", ") 
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/admin/onboarding")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || validationErrors.length > 0}
                >
                  {isSubmitting ? "Sending Invites..." : "Send Invitations"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <Form {...uploadForm}>
            <form onSubmit={uploadForm.handleSubmit(onUploadSubmit)} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={downloadTemplate}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center space-y-2">
                    <div className="mb-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">Upload CSV File</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop or click to upload
                    </p>
                    
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    
                    <label htmlFor="csv-upload">
                      <Button 
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                        asChild
                      >
                        <span>
                          <FileUp className="h-4 w-4 mr-2" />
                          Select CSV File
                        </span>
                      </Button>
                    </label>
                  </div>
                  
                  {fileName && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{fileName}</span>
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFileName("");
                            setUploadProgress(0);
                            setShowPreview(false);
                            setParsedData([]);
                            setValidationErrors([]);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Progress value={uploadProgress} className="h-2" />
                      
                      {uploadProgress === 100 && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>File uploaded successfully</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <FormField
                control={uploadForm.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Onboarding Template</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an onboarding template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates.map((template: any) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the onboarding template to use for these clients
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {showPreview && parsedData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">CSV Data Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {validationErrors.length > 0 && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Validation Errors</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 mt-2 text-sm">
                            {validationErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="rounded-md border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted border-b">
                            <th className="py-2 px-3 text-left font-medium">Email</th>
                            <th className="py-2 px-3 text-left font-medium">Company</th>
                            <th className="py-2 px-3 text-left font-medium">Subscription</th>
                            <th className="py-2 px-3 text-left font-medium">Team Members</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData.map((client, index) => (
                            <tr key={index} className="border-b last:border-0">
                              <td className="py-2 px-3">{client.client_email}</td>
                              <td className="py-2 px-3">{client.company_name || "-"}</td>
                              <td className="py-2 px-3">{client.subscription_tier_id}</td>
                              <td className="py-2 px-3">
                                {client.team_member_emails?.length > 0 
                                  ? client.team_member_emails.join(", ") 
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/admin/onboarding")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={
                    isSubmitting || 
                    validationErrors.length > 0 || 
                    parsedData.length === 0 || 
                    !uploadForm.watch("templateId")
                  }
                >
                  {isSubmitting ? "Sending Invites..." : "Send Invitations"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
