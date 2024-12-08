import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Profile, Connection } from '../types';

export class ShambuClient {
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  async getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await this.client
      .from('profiles')
      .select(`
        *,
        socialProfiles:social_profiles(*),
        connections:connections(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findConnections(profileId: string, depth: number = 1): Promise<Connection[]> {
    // Recursive query to find connections up to specified depth
    const { data, error } = await this.client.rpc('find_connections', {
      start_id: profileId,
      max_depth: depth
    });

    if (error) throw error;
    return data;
  }

  async searchProfiles(query: string) {
    const { data, error } = await this.client
      .from('profiles')
      .select()
      .textSearch('full_name', query);

    if (error) throw error;
    return data;
  }

  // Realtime subscriptions
  subscribeToProfileChanges(profileId: string, callback: (payload: any) => void) {
    return this.client
      .channel(`profile:${profileId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${profileId}`
        },
        callback
      )
      .subscribe();
  }
} 