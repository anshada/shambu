/**
 * @file profile-card.tsx
 * @description A card component for displaying profile information with connection management.
 */

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Card, CardContent, CardHeader } from './card';
import { Profile, Connection, SocialProfile } from '@shambu/shared';
import { ExternalLink, Mail, Network } from 'lucide-react';
import Link from 'next/link';
import { ManageConnectionsDialog } from '@/components/profile/manage-connections-dialog';
import { Button } from './button';

interface ProfileCardProps {
  profile: Profile;
  showActions?: boolean;
}

/**
 * ProfileCard component for displaying profile information
 */
export function ProfileCard({ profile, showActions = true }: ProfileCardProps) {
  const initials = profile.fullName
    .split(' ')
    .map((name: string) => name[0])
    .join('')
    .toUpperCase();

  const visibleConnections = profile.connections?.slice(0, 3) ?? [];

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{profile.fullName}</h3>
          {profile.metadata?.title && (
            <p className="text-sm text-gray-500">{profile.metadata.title}</p>
          )}
          {profile.metadata?.company && (
            <p className="text-sm text-gray-500">{profile.metadata.company}</p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Connection Stats */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Connections</span>
            <span>{profile.connections?.length ?? 0}</span>
          </div>
          {visibleConnections.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {visibleConnections.map((connection: Connection) => (
                  <div
                    key={connection.id}
                    className="h-2 flex-1 rounded-full bg-blue-100"
                    style={{
                      opacity: connection.strength
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {showActions && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ManageConnectionsDialog
                profile={profile}
                trigger={
                  <Button variant="outline" size="sm" className="flex-1">
                    <Network className="w-4 h-4 mr-2" />
                    Manage Connections
                  </Button>
                }
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.email && (
                <Link
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Link>
              )}
              {profile.socialProfiles?.map((social: SocialProfile) => (
                <Link
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  {social.platform}
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 