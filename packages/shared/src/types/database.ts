/**
 * @file database.ts
 * @description Database types for Supabase tables
 */

import { ConnectionType } from './index';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface DatabaseProfile {
  id: string;
  full_name: string;
  email: string | null;
  avatar_url: string | null;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
  social_profiles?: DatabaseSocialProfile[];
  connections?: DatabaseConnection[];
}

export interface DatabaseSocialProfile {
  id: string;
  profile_id: string;
  platform: string;
  username: string;
  url: string;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseConnection {
  id: string;
  source_id: string;
  target_id: string;
  connection_type: ConnectionType;
  strength: number;
  metadata: Json | null;
  created_at: string;
} 