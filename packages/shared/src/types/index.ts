/**
 * @file index.ts
 * @description Core types shared across all platforms
 */

export * from './database';

/**
 * Connection types enum
 */
export enum ConnectionType {
  PROFESSIONAL = 'PROFESSIONAL',
  SOCIAL = 'SOCIAL',
  ACADEMIC = 'ACADEMIC',
  FAMILY = 'FAMILY',
  OTHER = 'OTHER'
}

/**
 * Social profile interface
 */
export interface SocialProfile {
  id: string;
  platform: string;
  url: string;
  username: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Connection interface
 */
export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConnectionType;
  strength: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Profile interface
 */
export interface Profile {
  id: string;
  fullName: string;
  email?: string;
  avatarUrl?: string;
  socialProfiles?: SocialProfile[];
  connections?: Connection[];
  metadata?: {
    title?: string;
    company?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
} 