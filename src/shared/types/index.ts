// Core types shared across all platforms
export interface Profile {
  id: string;
  fullName: string;
  email?: string;
  avatarUrl?: string;
  socialProfiles: SocialProfile[];
  connections: Connection[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialProfile {
  platform: string;
  url: string;
  username: string;
  metadata?: Record<string, any>;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConnectionType;
  strength: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export enum ConnectionType {
  PROFESSIONAL = 'PROFESSIONAL',
  SOCIAL = 'SOCIAL',
  ACADEMIC = 'ACADEMIC',
  FAMILY = 'FAMILY',
  OTHER = 'OTHER'
} 