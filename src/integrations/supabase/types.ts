export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addon_template_steps: {
        Row: {
          addon_id: string
          description: string | null
          id: string
          order_index: number
          required_document_categories: string[] | null
          title: string
        }
        Insert: {
          addon_id: string
          description?: string | null
          id?: string
          order_index: number
          required_document_categories?: string[] | null
          title: string
        }
        Update: {
          addon_id?: string
          description?: string | null
          id?: string
          order_index?: number
          required_document_categories?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "addon_template_steps_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
        ]
      }
      addons: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price: number
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          tags?: string[] | null
        }
        Relationships: []
      }
      checklist_items: {
        Row: {
          checklist_id: string | null
          completed: boolean | null
          description: string | null
          document_categories: string[] | null
          id: string
          order: number
          required: boolean | null
          title: string
        }
        Insert: {
          checklist_id?: string | null
          completed?: boolean | null
          description?: string | null
          document_categories?: string[] | null
          id?: string
          order: number
          required?: boolean | null
          title: string
        }
        Update: {
          checklist_id?: string | null
          completed?: boolean | null
          description?: string | null
          document_categories?: string[] | null
          id?: string
          order?: number
          required?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_addons: {
        Row: {
          addon_id: string
          client_id: string
          created_at: string
          id: string
        }
        Insert: {
          addon_id: string
          client_id: string
          created_at?: string
          id?: string
        }
        Update: {
          addon_id?: string
          client_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_addons_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_checklist_items: {
        Row: {
          checklist_item_id: string
          client_checklist_id: string
          completed: boolean
          completed_at: string | null
          id: string
          notes: string | null
        }
        Insert: {
          checklist_item_id: string
          client_checklist_id: string
          completed?: boolean
          completed_at?: string | null
          id?: string
          notes?: string | null
        }
        Update: {
          checklist_item_id?: string
          client_checklist_id?: string
          completed?: boolean
          completed_at?: string | null
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_checklist_items_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_checklist_items_client_checklist_id_fkey"
            columns: ["client_checklist_id"]
            isOneToOne: false
            referencedRelation: "client_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      client_checklists: {
        Row: {
          assigned_at: string
          checklist_id: string
          client_id: string
          completed: boolean
          completed_at: string | null
          id: string
        }
        Insert: {
          assigned_at?: string
          checklist_id: string
          client_id: string
          completed?: boolean
          completed_at?: string | null
          id?: string
        }
        Update: {
          assigned_at?: string
          checklist_id?: string
          client_id?: string
          completed?: boolean
          completed_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_checklists_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_checklists_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          assigned_admin: string | null
          company_name: string | null
          company_size: string | null
          contact_person: string | null
          created_at: string
          drive_id: string | null
          drive_name: string | null
          email: string
          google_drive_id: string | null
          id: string
          industry: string | null
          metadata: Json | null
          notes: string | null
          onboarding_completed: boolean | null
          onboarding_status: number | null
          position: string | null
          role: string | null
          status: string
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_admin?: string | null
          company_name?: string | null
          company_size?: string | null
          contact_person?: string | null
          created_at?: string
          drive_id?: string | null
          drive_name?: string | null
          email: string
          google_drive_id?: string | null
          id?: string
          industry?: string | null
          metadata?: Json | null
          notes?: string | null
          onboarding_completed?: boolean | null
          onboarding_status?: number | null
          position?: string | null
          role?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_admin?: string | null
          company_name?: string | null
          company_size?: string | null
          contact_person?: string | null
          created_at?: string
          drive_id?: string | null
          drive_name?: string | null
          email?: string
          google_drive_id?: string | null
          id?: string
          industry?: string | null
          metadata?: Json | null
          notes?: string | null
          onboarding_completed?: boolean | null
          onboarding_status?: number | null
          position?: string | null
          role?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          company_name: string
          created_at: string
          drive_created_at: string | null
          id: string
          shared_drive_id: string | null
          upload_folder_id: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          drive_created_at?: string | null
          id?: string
          shared_drive_id?: string | null
          upload_folder_id?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          drive_created_at?: string | null
          id?: string
          shared_drive_id?: string | null
          upload_folder_id?: string | null
        }
        Relationships: []
      }
      drive_audit: {
        Row: {
          action: string
          details: string | null
          id: string
          timestamp: string
          username: string
        }
        Insert: {
          action: string
          details?: string | null
          id: string
          timestamp?: string
          username: string
        }
        Update: {
          action?: string
          details?: string | null
          id?: string
          timestamp?: string
          username?: string
        }
        Relationships: []
      }
      drive_usage: {
        Row: {
          bytes_used: number
          created_at: string
          id: string
          total_quota: number
        }
        Insert: {
          bytes_used: number
          created_at?: string
          id?: string
          total_quota: number
        }
        Update: {
          bytes_used?: number
          created_at?: string
          id?: string
          total_quota?: number
        }
        Relationships: []
      }
      files: {
        Row: {
          category: string | null
          client_id: string
          file_path: string
          file_size: number
          file_type: string
          filename: string
          id: string
          metadata: Json | null
          status: string
          uploaded_at: string
          uploaded_by: string | null
          verified_at: string | null
        }
        Insert: {
          category?: string | null
          client_id: string
          file_path: string
          file_size: number
          file_type: string
          filename: string
          id?: string
          metadata?: Json | null
          status?: string
          uploaded_at?: string
          uploaded_by?: string | null
          verified_at?: string | null
        }
        Update: {
          category?: string | null
          client_id?: string
          file_path?: string
          file_size?: number
          file_type?: string
          filename?: string
          id?: string
          metadata?: Json | null
          status?: string
          uploaded_at?: string
          uploaded_by?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      google_drive_logs: {
        Row: {
          company_name: string
          created_at: string
          drive_id: string | null
          error_message: string | null
          id: string
          status: string
          user_email: string
        }
        Insert: {
          company_name: string
          created_at?: string
          drive_id?: string | null
          error_message?: string | null
          id?: string
          status: string
          user_email: string
        }
        Update: {
          company_name?: string
          created_at?: string
          drive_id?: string | null
          error_message?: string | null
          id?: string
          status?: string
          user_email?: string
        }
        Relationships: []
      }
      invitation_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          is_valid: boolean
          team_member_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          is_valid?: boolean
          team_member_id: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          is_valid?: boolean
          team_member_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitation_tokens_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          client_id: string
          completed: boolean
          completed_at: string | null
          id: string
          started_at: string
          step_name: string
          step_order: number
        }
        Insert: {
          client_id: string
          completed?: boolean
          completed_at?: string | null
          id?: string
          started_at?: string
          step_name: string
          step_order: number
        }
        Update: {
          client_id?: string
          completed?: boolean
          completed_at?: string | null
          id?: string
          started_at?: string
          step_name?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_template_steps: {
        Row: {
          description: string | null
          id: string
          order_index: number
          required_document_categories: string[] | null
          template_id: string
          title: string
        }
        Insert: {
          description?: string | null
          id?: string
          order_index: number
          required_document_categories?: string[] | null
          template_id: string
          title: string
        }
        Update: {
          description?: string | null
          id?: string
          order_index?: number
          required_document_categories?: string[] | null
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_template_steps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "onboarding_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          onboarding_status: number | null
          role: string
          status: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          onboarding_status?: number | null
          role?: string
          status?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          onboarding_status?: number | null
          role?: string
          status?: string
        }
        Relationships: []
      }
      subscription_templates: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          subscription_id: string
          template_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          subscription_id: string
          template_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          subscription_id?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_templates_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_templates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "onboarding_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      team_members: {
        Row: {
          client_id: string
          created_at: string
          email: string
          id: string
          invitation_status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          email: string
          id?: string
          invitation_status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          email?: string
          id?: string
          invitation_status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_create_addon: {
        Args: {
          name_param: string
          description_param: string
          price_param: number
          tags_param: string[]
        }
        Returns: {
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          tags: string[] | null
        }
      }
      admin_create_subscription: {
        Args: {
          name_param: string
          description_param: string
          price_param: number
        }
        Returns: {
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          name: string
          price: number
        }
      }
      admin_create_subscription_with_features: {
        Args: {
          name_param: string
          description_param: string
          price_param: number
          features_param: string[]
        }
        Returns: {
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          name: string
          price: number
        }
      }
      admin_delete_addon: {
        Args: { id_param: string }
        Returns: boolean
      }
      admin_delete_subscription: {
        Args: { id_param: string }
        Returns: boolean
      }
      admin_update_addon: {
        Args: {
          id_param: string
          name_param: string
          description_param: string
          price_param: number
          tags_param: string[]
        }
        Returns: {
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          tags: string[] | null
        }
      }
      admin_update_subscription: {
        Args: {
          id_param: string
          name_param: string
          description_param: string
          price_param: number
        }
        Returns: {
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          name: string
          price: number
        }
      }
      admin_update_subscription_with_features: {
        Args: {
          id_param: string
          name_param: string
          description_param: string
          price_param: number
          features_param: string[]
        }
        Returns: {
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          name: string
          price: number
        }
      }
      assign_checklist_to_client: {
        Args: { p_checklist_id: string; p_client_id: string }
        Returns: string
      }
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      complete_checklist_item: {
        Args: {
          p_client_checklist_item_id: string
          p_completed: boolean
          p_notes?: string
        }
        Returns: boolean
      }
      create_drive_audit_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_drive_usage_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_addon_popularity: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          count: number
        }[]
      }
      get_addon_tier_distribution: {
        Args: Record<PropertyKey, never>
        Returns: {
          tier_name: string
          addon_count: number
        }[]
      }
      get_all_client_checklists: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          checklist_id: string
          client_id: string
          client_email: string
          client_company: string
          assigned_at: string
          completed: boolean
          completed_at: string
          checklist_title: string
          progress: number
        }[]
      }
      get_checklist_with_items: {
        Args: { checklist_id: string }
        Returns: {
          id: string
          title: string
          description: string
          created_at: string
          created_by: string
          items: Json
        }[]
      }
      get_client_checklist_progress: {
        Args: { client_checklist_id: string }
        Returns: {
          id: string
          checklist_id: string
          client_id: string
          assigned_at: string
          completed: boolean
          completed_at: string
          checklist_title: string
          total_items: number
          completed_items: number
          progress: number
          items: Json
        }[]
      }
      get_client_template_steps: {
        Args: { client_id: string }
        Returns: {
          step_id: string
          title: string
          description: string
          order_index: number
          required_document_categories: string[]
          is_addon_step: boolean
          addon_id: string
          addon_name: string
        }[]
      }
      get_secret: {
        Args: { secret_name: string }
        Returns: Json
      }
      revoke_secret: {
        Args: { secret_name: string }
        Returns: undefined
      }
      send_invite_email: {
        Args: { email: string; client_name: string }
        Returns: undefined
      }
      set_secret: {
        Args: { secret_name: string; secret_value: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
