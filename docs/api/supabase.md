# Supabase Integration Guide

## Database Schema

### Tables

#### profiles
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX profiles_full_name_idx ON profiles USING GIN (to_tsvector('english', full_name));
```

#### connections
```sql
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES profiles(id),
    target_id UUID REFERENCES profiles(id),
    connection_type TEXT NOT NULL,
    strength FLOAT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_id, target_id)
);

-- Indexes
CREATE INDEX connections_source_idx ON connections(source_id);
CREATE INDEX connections_target_idx ON connections(target_id);
```

#### social_profiles
```sql
CREATE TABLE social_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id),
    platform TEXT NOT NULL,
    username TEXT NOT NULL,
    url TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX social_profiles_profile_idx ON social_profiles(profile_id);
```

## API Client

### TypeScript Client

```typescript
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
}
```

## Authentication

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

### Authentication Flow

```typescript
// Login
async function signIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
}

// Logout
async function signOut() {
  const { error } = await supabase.auth.signOut();
}

// Session Management
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Handle sign in
  } else if (event === 'SIGNED_OUT') {
    // Handle sign out
  }
});
```

## Real-time Subscriptions

### Profile Changes

```typescript
const profileSubscription = supabase
  .channel('profile-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'profiles',
      filter: `id=eq.${profileId}`,
    },
    (payload) => {
      console.log('Profile changed:', payload);
    }
  )
  .subscribe();
```

### Connection Updates

```typescript
const connectionSubscription = supabase
  .channel('connection-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'connections',
      filter: `source_id=eq.${profileId}`,
    },
    (payload) => {
      console.log('Connection changed:', payload);
    }
  )
  .subscribe();
```

## Database Functions

### Graph Traversal

```sql
CREATE OR REPLACE FUNCTION find_connections(start_id UUID, max_depth INT)
RETURNS TABLE (
    source_id UUID,
    target_id UUID,
    depth INT,
    path UUID[]
) AS $$
WITH RECURSIVE connection_tree AS (
    -- Base case: direct connections
    SELECT 
        source_id,
        target_id,
        1 as depth,
        ARRAY[source_id, target_id] as path
    FROM connections
    WHERE source_id = start_id

    UNION ALL

    -- Recursive case
    SELECT 
        c.source_id,
        c.target_id,
        ct.depth + 1,
        ct.path || c.target_id
    FROM connection_tree ct
    JOIN connections c ON ct.target_id = c.source_id
    WHERE ct.depth < max_depth
)
SELECT * FROM connection_tree;
$$ LANGUAGE SQL;
```

## Error Handling

```typescript
try {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    if (error.code === 'PGRST116') {
      // Handle not found
    } else if (error.code === '42501') {
      // Handle permission error
    } else {
      // Handle other errors
    }
  }
} catch (error) {
  // Handle unexpected errors
}
```

## Performance Optimization

### Indexes

```sql
-- Full text search
CREATE INDEX profiles_full_name_idx ON profiles USING GIN (to_tsvector('english', full_name));

-- Foreign key indexes
CREATE INDEX connections_source_idx ON connections(source_id);
CREATE INDEX connections_target_idx ON connections(target_id);
CREATE INDEX social_profiles_profile_idx ON social_profiles(profile_id);

-- Metadata indexes
CREATE INDEX profiles_metadata_idx ON profiles USING GIN (metadata);
CREATE INDEX connections_metadata_idx ON connections USING GIN (metadata);
```

### Query Optimization

```typescript
// Use specific selects
const { data } = await supabase
  .from('profiles')
  .select('id, full_name, email')
  .eq('id', profileId);

// Use count option
const { count } = await supabase
  .from('connections')
  .select('*', { count: 'exact', head: true })
  .eq('source_id', profileId);

// Use range queries
const { data } = await supabase
  .from('profiles')
  .select('*')
  .range(0, 9);
``` 