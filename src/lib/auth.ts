
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { RegisterCredentials } from "@/types/auth";

export async function register(credentials: RegisterCredentials) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
        },
      },
    });
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast({
      title: "Registration failed",
      description: error.message || "An error occurred during registration",
      variant: "destructive",
    });
    
    throw error;
  }
}
