
import { supabase } from "@/integrations/supabase/client";

// Helper functions for transaction management
export async function beginTransaction() {
  return supabase.rpc('begin_transaction');
}

export async function commitTransaction() {
  return supabase.rpc('commit_transaction');
}

export async function rollbackTransaction() {
  return supabase.rpc('rollback_transaction');
}
