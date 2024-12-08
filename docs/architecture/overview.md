# Shambu Architecture Overview

## System Architecture

### 1. Monorepo Structure
```
shambu/
├── apps/                  # Application packages
│   ├── web/              # Next.js web application
│   ├── mobile/           # React Native mobile app
│   ├── desktop/          # Tauri desktop app
│   ├── cli/              # Command-line interface
│   └── extension/        # Chrome extension
├── packages/             # Shared packages
│   ├── shared/           # Shared types and utilities
│   └── ui/               # Shared UI components
├── database/             # Database related files
│   ├── schema.sql       # Database schema
│   ├── functions/       # PostgreSQL functions
│   └── seed.sql         # Sample data
└── docs/                # Documentation
```

### 2. Technology Stack

#### Frontend (Web)
- **Framework**: Next.js 14
- **Language**: TypeScript
- **State Management**: TanStack Query + Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **Data Visualization**: D3.js
- **Build Tool**: Turborepo

#### Mobile
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **State Management**: Zustand
- **UI Components**: Custom components with React Native styling

#### Desktop
- **Framework**: Tauri + React
- **Bundler**: Vite
- **Router**: React Router
- **State Management**: Zustand
- **Styling**: Tailwind CSS

#### Backend
- **Platform**: Supabase
- **Database**: PostgreSQL with extensions:
  - `uuid-ossp`: UUID generation
  - `vector`: Vector similarity search
  - `pg_trgm`: Fuzzy text search
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions

### 3. Data Model

#### Core Tables
- `profiles`: User profiles and metadata
- `connections`: Relationship graph edges
- `social_profiles`: Linked social media accounts
- `profile_embeddings`: Vector embeddings for AI features

#### Key Features
- Graph-based data model for relationships
- Vector embeddings for similarity search
- Real-time subscriptions for live updates
- Row-level security for data access control

### 4. Authentication Flow

1. **Web Flow**:
   ```mermaid
   sequenceDiagram
   participant U as User
   participant C as Client
   participant S as Supabase
   
   U->>C: Access App
   C->>S: Check Session
   alt Has Valid Session
       S->>C: Return User Data
   else No Session
       S->>C: Redirect to Login
       U->>C: Login with Provider
       C->>S: Auth Request
       S->>C: Return Session
   end
   ```

2. **Mobile/Desktop Flow**:
   - Deep link handling for OAuth
   - Persistent session management
   - Biometric authentication support

### 5. Development Environment

#### Prerequisites
- Node.js 18+
- pnpm (package manager)
- PostgreSQL 15+
- Rust (for Tauri)
- Xcode (for iOS)
- Android Studio (for Android)

#### Configuration Files
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@shambu/*": ["packages/*/src"]
    }
  }
}

// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    }
  }
}
```

### 6. CI/CD Pipeline

#### Build Process
1. Code linting and type checking
2. Unit and integration tests
3. Build web, mobile, and desktop apps
4. Deploy to respective platforms

#### Quality Gates
- ESLint for code quality
- Prettier for code formatting
- TypeScript for type safety
- Commitlint for commit messages
- Husky for git hooks

### 7. Performance Considerations

#### Web Performance
- Server-side rendering with Next.js
- Static page generation where possible
- Image optimization
- Code splitting and lazy loading

#### Mobile Performance
- Lazy loading of screens
- Image caching
- Optimized list rendering
- Native module bridging

#### Desktop Performance
- Native system APIs via Tauri
- IPC communication optimization
- File system caching
- Background process management

### 8. Security Measures

#### Data Security
- Row Level Security (RLS) policies
- JWT-based authentication
- HTTPS/SSL encryption
- API rate limiting

#### Code Security
- Dependency scanning
- Security headers
- CORS configuration
- Input validation

### 9. Monitoring and Analytics

#### Metrics Collection
- Application performance
- User engagement
- Error tracking
- Usage analytics

#### Logging
- Structured logging
- Error tracking
- User activity monitoring
- Performance profiling 