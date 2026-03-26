export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      app_user: {
        Row: {
          id: string;
          name: string;
          role: Database['public']['Enums']['app_role'];
        };
        Insert: {
          id?: string;
          name: string;
          role?: Database['public']['Enums']['app_role'];
        };
        Update: {
          id?: string;
          name?: string;
          role?: Database['public']['Enums']['app_role'];
        };
        Relationships: [];
      };
      companies: {
        Row: {
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          name?: string;
        };
        Relationships: [];
      };
      company_contacts: {
        Row: {
          company_id: number;
          created_at: string;
          email: string | null;
          id: number;
          name: string;
        };
        Insert: {
          company_id: number;
          created_at?: string;
          email?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          company_id?: number;
          created_at?: string;
          email?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'company_contacts_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
        ];
      };
      invite_tokens: {
        Row: {
          created_at: string;
          expired_at: string;
          id: string;
          metadata: Json;
          token: string;
        };
        Insert: {
          created_at?: string;
          expired_at: string;
          id?: string;
          metadata?: Json;
          token?: string;
        };
        Update: {
          created_at?: string;
          expired_at?: string;
          id?: string;
          metadata?: Json;
          token?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          contact_id: number | null;
          created_at: string;
          id: number;
          sender_id: string | null;
          text: string;
          ticket_id: number | null;
          updated_at: string | null;
        };
        Insert: {
          contact_id?: number | null;
          created_at?: string;
          id?: number;
          sender_id?: string | null;
          text: string;
          ticket_id?: number | null;
          updated_at?: string | null;
        };
        Update: {
          contact_id?: number | null;
          created_at?: string;
          id?: number;
          sender_id?: string | null;
          text?: string;
          ticket_id?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_contact_id_fkey';
            columns: ['contact_id'];
            isOneToOne: false;
            referencedRelation: 'company_contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_sender_id_fkey1';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'app_user';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_ticket_id_fkey';
            columns: ['ticket_id'];
            isOneToOne: false;
            referencedRelation: 'tickets';
            referencedColumns: ['id'];
          },
        ];
      };
      tickets: {
        Row: {
          company_id: number | null;
          contact_id: number | null;
          created_at: string;
          customer_id: string | null;
          description: string;
          id: number;
          priority: Database['public']['Enums']['ticket_priority'];
          status: Database['public']['Enums']['ticket_status'];
          subject: string;
          updated_at: string | null;
        };
        Insert: {
          company_id?: number | null;
          contact_id?: number | null;
          created_at?: string;
          customer_id?: string | null;
          description: string;
          id?: number;
          priority?: Database['public']['Enums']['ticket_priority'];
          status?: Database['public']['Enums']['ticket_status'];
          subject: string;
          updated_at?: string | null;
        };
        Update: {
          company_id?: number | null;
          contact_id?: number | null;
          created_at?: string;
          customer_id?: string | null;
          description?: string;
          id?: number;
          priority?: Database['public']['Enums']['ticket_priority'];
          status?: Database['public']['Enums']['ticket_status'];
          subject?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tickets_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tickets_contact_id_fkey';
            columns: ['contact_id'];
            isOneToOne: false;
            referencedRelation: 'company_contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tickets_customer_id_fkey1';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'app_user';
            referencedColumns: ['id'];
          },
        ];
      };
      user_companies: {
        Row: {
          company_id: number;
          created_at: string;
          user_id: string;
        };
        Insert: {
          company_id: number;
          created_at?: string;
          user_id?: string;
        };
        Update: {
          company_id?: number;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_companies_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      agent_details: {
        Row: {
          companies: Json | null;
          email: string | null;
          id: string | null;
          name: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      app_role: 'admin' | 'agent' | 'customer_manager' | 'customer';
      ticket_priority: 'low' | 'medium' | 'high' | 'critical';
      ticket_status:
        | 'open'
        | 'in_progress'
        | 'waiting_on_customer'
        | 'resolved'
        | 'closed';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ['admin', 'agent', 'customer_manager', 'customer'],
      ticket_priority: ['low', 'medium', 'high', 'critical'],
      ticket_status: [
        'open',
        'in_progress',
        'waiting_on_customer',
        'resolved',
        'closed',
      ],
    },
  },
} as const;
