import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Card, CardContent, CardHeader } from './card';
import { Profile } from '@shambu/shared/types';
import { ExternalLink, Mail } from 'lucide-react';
import Link from 'next/link';

interface ProfileCardProps {
  profile: Profile;
  showActions?: boolean;
}

export function ProfileCard({ profile, showActions = true }: ProfileCardProps) {
  const initials = profile.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

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
        {showActions && (
          <div className="mt-4 flex gap-2">
            {profile.email && (
              <Link
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Mail className="h-4 w-4" />
                Email
              </Link>
            )}
            {profile.socialProfiles?.map(social => (
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
        )}
      </CardContent>
    </Card>
  );
} 