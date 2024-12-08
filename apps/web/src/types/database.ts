import { ConnectionType } from '@shambu/shared';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string | null;
          avatar_url: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
          social_profiles: {
            id: string;
            profile_id: string;
            platform: string;
            username: string;
            url: string;
            metadata: Json | null;
            created_at: string;
            updated_at: string;
          }[];
          connections: {
            id: string;
            source_id: string;
            target_id: string;
            connection_type: ConnectionType;
            strength: number;
            metadata: Json | null;
            created_at: string;
          }[];
        };
        Insert: {
          id?: string;
          full_name: string;
          email?: string | null;
          avatar_url?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string | null;
          avatar_url?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_profiles: {
        Row: {
          id: string;
          profile_id: string;
          platform: string;
          username: string;
          url: string;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          platform: string;
          username: string;
          url: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          platform?: string;
          username?: string;
          url?: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      connections: {
        Row: {
          id: string;
          source_id: string;
          target_id: string;
          connection_type: ConnectionType;
          strength: number;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_id: string;
          target_id: string;
          connection_type: ConnectionType;
          strength: number;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          source_id?: string;
          target_id?: string;
          connection_type?: ConnectionType;
          strength?: number;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 