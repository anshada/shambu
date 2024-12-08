/**
 * @file mappers.ts
 * @description Utility functions for mapping between database and UI models
 */

import {
  Profile,
  SocialProfile,
  Connection,
  DatabaseProfile,
  DatabaseSocialProfile,
  DatabaseConnection
} from '@shambu/shared';

/**
 * Maps a database profile to a UI profile
 */
export function mapDatabaseProfile(dbProfile: DatabaseProfile): Profile {
  return {
    id: dbProfile.id,
    fullName: dbProfile.full_name,
    email: dbProfile.email,
    avatarUrl: dbProfile.avatar_url,
    metadata: dbProfile.metadata,
    socialProfiles: dbProfile.social_profiles?.map(mapDatabaseSocialProfile),
    connections: dbProfile.connections?.map(mapDatabaseConnection),
    createdAt: new Date(dbProfile.created_at),
    updatedAt: new Date(dbProfile.updated_at)
  };
}

/**
 * Maps a database social profile to a UI social profile
 */
export function mapDatabaseSocialProfile(dbSocialProfile: DatabaseSocialProfile): SocialProfile {
  return {
    id: dbSocialProfile.id,
    platform: dbSocialProfile.platform,
    username: dbSocialProfile.username,
    url: dbSocialProfile.url,
    metadata: dbSocialProfile.metadata,
    createdAt: new Date(dbSocialProfile.created_at),
    updatedAt: new Date(dbSocialProfile.updated_at)
  };
}

/**
 * Maps a database connection to a UI connection
 */
export function mapDatabaseConnection(dbConnection: DatabaseConnection): Connection {
  return {
    id: dbConnection.id,
    sourceId: dbConnection.source_id,
    targetId: dbConnection.target_id,
    type: dbConnection.connection_type,
    strength: dbConnection.strength,
    metadata: dbConnection.metadata,
    createdAt: new Date(dbConnection.created_at)
  };
} 