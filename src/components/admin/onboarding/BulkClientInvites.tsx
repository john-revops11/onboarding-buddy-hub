
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { getTemplateWithSteps } from "@/lib/template-management";
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { OnboardingTemplate } from "@/lib/types/client-types";
import { FileUp, Users, Table as TableIcon, X, Check } from "lucide-react";

export function BulkClientInvites() {
  const { toast } = useToast();
  const [csvData, setCsvData] = useState<string>("");
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("paste");
  const [file, setFile] = useState<File | null>(null);
  const [templates, setTemplates] = useState<OnboardingTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // Implementation will be updated later
        // const templatesData = await getOnboardingTemplates();
        // setTemplates(templatesData);
      } catch (error) {
        console.error("Error loading templates:", error);
      }
    };
    
    loadTemplates();
  }, []);

  // Parse CSV data
  const handleParse = () => {
    if (!csvData.trim()) {
      toast({
        title: "No data to parse",
        description: "Please paste your CSV data or upload a file.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Basic CSV parsing - split by lines and then by commas
      const lines = csvData.trim().split("\n");
      const headers = lines[0].split(",").map(h => h.trim());
      
      const data = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim());
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || "";
          return obj;
        }, {} as any);
      });
      
      setParsedData(data);
      
      toast({
        title: "Data parsed successfully",
        description: `Parsed ${data.length} client records.`,
      });
    } catch (error) {
      console.error("Error parsing CSV:", error);
      toast({
        title: "Error parsing data",
        description: "Please check your CSV format and try again.",
        variant: "destructive",
      });
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Parse uploaded file
  const handleFileUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvData(content);
      handleParse();
    };
    reader.readAsText(file);
  };

  // Send invitations
  const handleSendInvites = async () => {
    if (parsedData.length === 0) {
      toast({
        title: "No data to process",
        description: "Please parse your data first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedTemplateId) {
      toast({
        title: "No template selected",
        description: "Please select an onboarding template for these clients.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock implementation - would call an API in a real app
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Invitations sent",
        description: `Successfully sent ${parsedData.length} client invitations.`,
      });
      
      // Clear form
      setCsvData("");
      setParsedData([]);
      setFile(null);
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast({
        title: "Error sending invitations",
        description: "An error occurred while sending invitations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="paste" className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            Paste Data
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Upload CSV
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Preview ({parsedData.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="paste">
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-data">Paste CSV Data</Label>
              <Textarea
                id="csv-data"
                placeholder="email,company_name,subscription_tier
john@example.com,Acme Inc,premium
jane@example.com,XYZ Corp,basic"
                className="h-48 font-mono"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Data should be in CSV format with headers. Required columns: email, company_name
              </p>
            </div>
            
            <Button onClick={handleParse} disabled={!csvData.trim()}>
              Parse Data
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="upload">
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">Upload CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
              <p className="text-sm text-muted-foreground mt-2">
                File must be a CSV with headers. Required columns: email, company_name
              </p>
            </div>
            
            <Button onClick={handleFileUpload} disabled={!file}>
              Parse File
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          {parsedData.length > 0 ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Client Data Preview</h3>
                        <p className="text-sm text-muted-foreground">
                          {parsedData.length} clients to be invited
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Label htmlFor="template-select">Onboarding Template:</Label>
                        <Select 
                          value={selectedTemplateId} 
                          onValueChange={setSelectedTemplateId}
                        >
                          <SelectTrigger id="template-select" className="w-[240px]">
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(parsedData[0]).map((header) => (
                              <TableHead key={header}>{header}</TableHead>
                            ))}
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parsedData.map((row, index) => (
                            <TableRow key={index}>
                              {Object.values(row).map((value, i) => (
                                <TableCell key={i}>{value as string}</TableCell>
                              ))}
                              <TableCell>
                                {row.email && row.company_name ? (
                                  <div className="flex items-center text-green-500">
                                    <Check className="h-4 w-4 mr-1" />
                                    Valid
                                  </div>
                                ) : (
                                  <div className="flex items-center text-red-500">
                                    <X className="h-4 w-4 mr-1" />
                                    Missing data
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSendInvites} 
                  disabled={isLoading || !selectedTemplateId}
                >
                  {isLoading ? "Sending..." : "Send Invitations"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No data to preview. Please paste or upload CSV data first.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
