# Shambu Database Schema

## Core Tables

### profiles
Stores the main profile information for each person.

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
```

### connections
Stores relationships between profiles.

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
```

### social_profiles
Stores social media profiles for each person.

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
```

### profile_embeddings
Stores vector embeddings for similarity search.

```sql
CREATE TABLE profile_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id),
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Indexes

```sql
-- Connections indexes
CREATE INDEX connections_source_idx ON connections(source_id);
CREATE INDEX connections_target_idx ON connections(target_id);

-- Social profiles index
CREATE INDEX social_profiles_profile_idx ON social_profiles(profile_id);

-- Full text search index
CREATE INDEX profiles_full_name_idx ON profiles USING GIN (to_tsvector('english', full_name));

-- Vector similarity search index
CREATE INDEX profile_embeddings_idx ON profile_embeddings USING ivfflat (embedding vector_cosine_ops);
```

## Functions

### find_connections
Recursively finds connections up to a specified depth.

```sql
-- See database/functions/find_connections.sql for implementation
```

## Row Level Security

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