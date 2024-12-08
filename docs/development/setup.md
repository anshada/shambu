# Development Setup Guide

## Initial Setup

### 1. Prerequisites Installation

```bash
# Install Node.js (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Install Rust (for Tauri)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install PostgreSQL
brew install postgresql@15

# Install Supabase CLI
brew install supabase/tap/supabase
```

### 2. Clone and Setup Repository

```bash
# Clone repository
git clone https://github.com/yourusername/shambu.git
cd shambu

# Install dependencies
pnpm install

# Setup git hooks
pnpm prepare

# Copy environment variables
cp .env.example .env
```

### 3. Database Setup

```bash
# Start Supabase locally
supabase start

# Run database migrations
pnpm db:setup

# Seed database with sample data
pnpm db:seed
```

## Development Workflow

### 1. Web Development

```bash
# Start web development server
cd apps/web
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

#### Key Files
- `apps/web/src/app/page.tsx`: Main landing page
- `apps/web/src/components/`: Reusable components
- `apps/web/src/lib/`: Utility functions

### 2. Mobile Development

```bash
# Start Expo development server
cd apps/mobile
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android
```

#### Key Files
- `apps/mobile/App.tsx`: Root component
- `apps/mobile/src/screens/`: Screen components
- `apps/mobile/src/navigation/`: Navigation configuration

### 3. Desktop Development

```bash
# Start Tauri development
cd apps/desktop
pnpm tauri dev

# Build for production
pnpm tauri build
```

#### Key Files
- `apps/desktop/src-tauri/`: Rust backend code
- `apps/desktop/src/`: React frontend code

## Code Organization

### 1. Shared Code

```typescript
// packages/shared/src/types/index.ts
export interface Profile {
  id: string;
  fullName: string;
  email?: string;
  avatarUrl?: string;
  socialProfiles: SocialProfile[];
  connections: Connection[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// packages/shared/src/api/client.ts
export class ShambuClient {
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }
  // ... API methods
}
```

### 2. Component Structure

```typescript
// Common component structure
import * as React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Props definition
}

export function Component({ ...props }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

## Testing Strategy

### 1. Unit Tests

```typescript
// Example test file
import { render, screen } from '@testing-library/react';
import { ProfileCard } from './ProfileCard';

describe('ProfileCard', () => {
  it('renders profile information', () => {
    const profile = {
      fullName: 'John Doe',
      email: 'john@example.com',
    };
    
    render(<ProfileCard profile={profile} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### 2. Integration Tests

```typescript
// Example API test
import { ShambuClient } from '@shambu/shared';

describe('ShambuClient', () => {
  it('fetches profile data', async () => {
    const client = new ShambuClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    const profile = await client.getProfile('test-id');
    expect(profile).toBeDefined();
  });
});
```

## Deployment

### 1. Web Deployment

```bash
# Build web app
cd apps/web
pnpm build

# Deploy to Vercel
vercel deploy
```

### 2. Mobile Deployment

```bash
# Build iOS app
cd apps/mobile
eas build --platform ios

# Build Android app
eas build --platform android
```

### 3. Desktop Deployment

```bash
# Build for all platforms
cd apps/desktop
pnpm tauri build
```

## Common Issues and Solutions

### 1. Development Issues

```bash
# Clear turbo cache
pnpm turbo clean

# Reset node_modules
pnpm clean
pnpm install

# Reset database
supabase db reset
```

### 2. Build Issues

```bash
# Clear Next.js cache
cd apps/web
rm -rf .next

# Clear Expo cache
cd apps/mobile
expo start -c

# Clear Tauri cache
cd apps/desktop
pnpm tauri clean
```

## Best Practices

### 1. Code Style

```typescript
// Use consistent imports
import * as React from 'react';
import { type ClassValue } from 'clsx';

// Use type annotations
function example(param: string): number {
  return parseInt(param, 10);
}

// Use proper error handling
try {
  await someAsyncOperation();
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Friendly error message');
}
```

### 2. Git Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make commits
git commit -m "feat: add amazing feature"

# Push changes
git push origin feature/amazing-feature
```

### 3. Documentation

- Use JSDoc comments for functions
- Keep README files up to date
- Document API changes
- Include setup instructions for new features
</rewritten_file> 