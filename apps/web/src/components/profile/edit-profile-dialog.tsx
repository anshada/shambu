/**
 * @file edit-profile-dialog.tsx
 * @description A dialog component for creating and editing user profiles.
 * Provides a form interface for managing profile information with Supabase integration.
 */

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Profile } from '@shambu/shared/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Props for the EditProfileDialog component
 */
interface EditProfileDialogProps {
  /** Profile data for editing. If not provided, creates a new profile */
  profile?: Profile;
  /** Callback function called after successful save */
  onSave?: () => void;
  /** Custom trigger element for the dialog */
  trigger?: React.ReactNode;
}

/**
 * EditProfileDialog component for creating and editing profiles
 * 
 * @component
 * @example
 * ```tsx
 * // For creating a new profile
 * <EditProfileDialog onSave={() => console.log('Profile saved')} />
 * 
 * // For editing an existing profile
 * <EditProfileDialog
 *   profile={existingProfile}
 *   onSave={() => console.log('Profile updated')}
 * />
 * ```
 * 
 * Features:
 * - Create new profiles
 * - Edit existing profiles
 * - Form validation
 * - Real-time Supabase integration
 * - Loading states
 * - Error handling
 * - Custom trigger support
 */
export function EditProfileDialog({ profile, onSave, trigger }: EditProfileDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const supabase = createClientComponentClient();

  /**
   * Handles form submission for creating/updating profiles
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get('fullName'),
      email: formData.get('email'),
      avatar_url: formData.get('avatarUrl'),
      metadata: {
        title: formData.get('title'),
        company: formData.get('company'),
      },
    };

    try {
      if (profile?.id) {
        await supabase
          .from('profiles')
          .update(data)
          .eq('id', profile.id);
      } else {
        await supabase
          .from('profiles')
          .insert([data]);
      }

      setOpen(false);
      onSave?.();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Edit Profile</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {profile ? 'Edit Profile' : 'Create Profile'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={profile?.fullName}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={profile?.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              defaultValue={profile?.avatarUrl}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={profile?.metadata?.title}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              defaultValue={profile?.metadata?.company}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 