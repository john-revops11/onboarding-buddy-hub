
import { supabase } from "@/integrations/supabase/client";

export function useDriveIntegration() {
  const invoke = (action: string, payload: any = {}) =>
    supabase.functions.invoke("drive-admin", { body: { action, payload } });

  return {
    ping: () => invoke("ping"),
    usage: () => invoke("usage"),           // returns bytes_used
    audit: () => invoke("audit", { limit: 20 }),
    uploadKey: (b64: string) => invoke("setSecret", { secret: b64 }),
    revoke: () => invoke("revoke")
  };
}
