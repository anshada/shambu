/**
 * @file manage-connections-dialog.tsx
 * @description A dialog component for managing profile connections.
 * Allows users to view, add, and modify connections between profiles.
 */

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Profile, Connection, ConnectionType, DatabaseProfile } from '@shambu/shared';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Network, Search, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { mapDatabaseProfile } from '@/lib/utils/mappers';

interface ManageConnectionsDialogProps {
  profile: Profile;
  onUpdate?: () => void;
  trigger?: React.ReactNode;
}

/**
 * ManageConnectionsDialog component for managing profile connections
 * 
 * @component
 * @example
 * ```tsx
 * <ManageConnectionsDialog
 *   profile={profile}
 *   onUpdate={() => console.log('Connections updated')}
 * />
 * ```
 */
export function ManageConnectionsDialog({ profile, onUpdate, trigger }: ManageConnectionsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Profile[]>([]);
  const [connections, setConnections] = React.useState<Connection[]>(profile.connections || []);
  const supabase = createClientComponentClient();

  /**
   * Searches for profiles based on query
   */
  const handleSearch = React.useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select(`
        *,
        social_profiles (*),
        connections (*)
      `)
      .textSearch('full_name', query)
      .neq('id', profile.id)
      .limit(5);

    if (data) {
      setSearchResults(data.map((p: DatabaseProfile) => mapDatabaseProfile(p)));
    }
  }, [profile.id, supabase]);

  /**
   * Adds a new connection
   */
  const addConnection = async (targetProfile: Profile) => {
    const newConnection = {
      source_id: profile.id,
      target_id: targetProfile.id,
      connection_type: ConnectionType.PROFESSIONAL,
      strength: 0.5
    };

    const { data, error } = await supabase
      .from('connections')
      .insert([newConnection])
      .select()
      .single();

    if (error) {
      console.error('Error adding connection:', error);
      return;
    }

    if (data) {
      setConnections([...connections, {
        id: data.id,
        sourceId: data.source_id,
        targetId: data.target_id,
        type: data.connection_type,
        strength: data.strength,
        createdAt: new Date(data.created_at)
      }]);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  /**
   * Updates connection properties
   */
  const updateConnection = async (connectionId: string, updates: Partial<Connection>) => {
    const { error } = await supabase
      .from('connections')
      .update({
        connection_type: updates.type,
        strength: updates.strength
      })
      .eq('id', connectionId);

    if (error) {
      console.error('Error updating connection:', error);
      return;
    }

    setConnections(connections.map(conn =>
      conn.id === connectionId ? { ...conn, ...updates } : conn
    ));
  };

  /**
   * Removes a connection
   */
  const removeConnection = async (connectionId: string) => {
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', connectionId);

    if (error) {
      console.error('Error removing connection:', error);
      return;
    }

    setConnections(connections.filter(conn => conn.id !== connectionId));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Network className="w-4 h-4 mr-2" />
            Manage Connections
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Connections</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search for new connections */}
          <div className="space-y-2">
            <Label>Add Connection</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                placeholder="Search profiles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 space-y-2">
                {searchResults.map((result: Profile) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-2 rounded-md border"
                  >
                    <span>{result.fullName}</span>
                    <Button
                      size="sm"
                      onClick={() => addConnection(result)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Existing connections */}
          <div className="space-y-4">
            <Label>Current Connections</Label>
            {connections.length === 0 ? (
              <p className="text-sm text-gray-500">No connections yet</p>
            ) : (
              <div className="space-y-4">
                {connections.map((connection: Connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center gap-4 p-4 rounded-md border"
                  >
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {connection.targetId === profile.id
                            ? profile.fullName
                            : searchResults.find(p => p.id === connection.targetId)?.fullName}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeConnection(connection.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Select
                          value={connection.type}
                          onValueChange={(value: ConnectionType) =>
                            updateConnection(connection.id, { type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(ConnectionType).map((type: ConnectionType) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0) + type.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Connection Strength</span>
                            <span>{Math.round(connection.strength * 100)}%</span>
                          </div>
                          <Slider
                            value={[connection.strength * 100]}
                            onValueChange={([value]: number[]) =>
                              updateConnection(connection.id, { strength: value / 100 })
                            }
                            max={100}
                            step={1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 