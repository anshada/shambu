'use client';

import * as React from 'react';
import { ProfileCard } from '@/components/ui/profile-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog';
import { Profile, DatabaseProfile } from '@shambu/shared';
import { mapDatabaseProfile } from '@/lib/utils/mappers';

interface ProfilesListProps {
  initialProfiles: Profile[];
}

export function ProfilesList({ initialProfiles }: ProfilesListProps) {
  const [profiles, setProfiles] = React.useState<Profile[]>(initialProfiles);
  const [searchQuery, setSearchQuery] = React.useState('');
  const supabase = createClientComponentClient();

  const fetchProfiles = React.useCallback(async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select(`
          *,
          social_profiles (*),
          connections (*)
        `)
        .order('full_name');

      if (data) {
        setProfiles(data.map((p: DatabaseProfile) => mapDatabaseProfile(p)));
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  }, [supabase]);

  React.useEffect(() => {
    const channel = supabase
      .channel('profiles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          fetchProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProfiles, supabase]);

  const filteredProfiles = React.useMemo(() => {
    if (!searchQuery) return profiles;

    const query = searchQuery.toLowerCase();
    return profiles.filter(profile =>
      profile.fullName.toLowerCase().includes(query) ||
      profile.email?.toLowerCase().includes(query) ||
      profile.metadata?.title?.toLowerCase().includes(query) ||
      profile.metadata?.company?.toLowerCase().includes(query)
    );
  }, [profiles, searchQuery]);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profiles</h1>
        <EditProfileDialog
          trigger={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Profile
            </Button>
          }
          onSave={fetchProfiles}
        />
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
        <Input
          placeholder="Search profiles..."
          className="pl-10"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No profiles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile: Profile) => (
            <div key={profile.id} className="relative group">
              <ProfileCard profile={profile} />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <EditProfileDialog
                  profile={profile}
                  trigger={
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  }
                  onSave={fetchProfiles}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 