# Desktop App Architecture

## Overview

The Shambu desktop app is built using Tauri, combining Rust's performance and security with React's UI capabilities.

## Project Structure

```
apps/desktop/
├── src/                  # React frontend code
│   ├── components/       # UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── stores/          # State management
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
├── src-tauri/           # Rust backend code
│   ├── src/             # Rust source code
│   │   ├── main.rs      # Main entry point
│   │   └── commands.rs  # Tauri commands
│   └── Cargo.toml       # Rust dependencies
└── package.json        # Node.js dependencies
```

## Frontend Architecture

### Routing
```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/network" element={<Network />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
```

### Component Structure
```typescript
// src/components/Sidebar.tsx
export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800">
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-4 py-2 ${
              isActive ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
```

## Backend Architecture (Rust)

### Main Entry Point
```rust
// src-tauri/src/main.rs
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;

#[tauri::command]
async fn get_profile(id: String) -> Result<String, String> {
    // Profile fetching logic
    Ok(profile_json)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_profile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Custom Commands
```rust
// src-tauri/src/commands.rs
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Profile {
    id: String,
    name: String,
    // ... other fields
}

#[tauri::command]
pub async fn save_profile(profile: Profile) -> Result<(), String> {
    // Save profile logic
    Ok(())
}
```

## State Management

### Global State
```typescript
// src/stores/profileStore.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: 'profile-storage',
    }
  )
);
```

## IPC Communication

### Frontend to Backend
```typescript
// src/services/api.ts
import { invoke } from '@tauri-apps/api/tauri';

export async function getProfile(id: string): Promise<Profile> {
  try {
    const profile = await invoke('get_profile', { id });
    return profile;
  } catch (error) {
    console.error('Failed to get profile:', error);
    throw error;
  }
}
```

### Event Handling
```typescript
// src/hooks/useEvents.ts
import { listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';

export function useEventListener(event: string, callback: (payload: any) => void) {
  useEffect(() => {
    const unlisten = listen(event, (event) => {
      callback(event.payload);
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, [event, callback]);
}
```

## Native Features

### File System Access
```rust
// src-tauri/src/fs.rs
use std::fs;
use tauri::api::path::local_data_dir;

#[tauri::command]
async fn save_data(content: String) -> Result<(), String> {
    let data_dir = local_data_dir().ok_or("Failed to get data directory")?;
    let file_path = data_dir.join("data.json");
    
    fs::write(file_path, content)
        .map_err(|e| e.to_string())?;
    
    Ok(())
}
```

### System Tray
```rust
// src-tauri/src/main.rs
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu};

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit);
    
    let system_tray = SystemTray::new()
        .with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .run(tauri::generate_context!())
        .expect("error while running application");
}
```

## Security

### Window Configuration
```json
// src-tauri/tauri.conf.json
{
  "tauri": {
    "security": {
      "csp": "default-src 'self'; connect-src 'self' https://api.shambu.dev"
    },
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "http": {
        "all": true,
        "request": true,
        "scope": ["https://**"]
      }
    }
  }
}
```

### Data Encryption
```rust
// src-tauri/src/crypto.rs
use ring::aead::{self, BoundKey, Aad, UnboundKey, SealingKey};

pub struct Crypto {
    key: SealingKey<impl BoundKey<aead::Aad<[u8; 0]>>>
}

impl Crypto {
    pub fn encrypt(&self, data: &[u8]) -> Result<Vec<u8>, String> {
        // Encryption logic
    }
}
```

## Build and Distribution

### Build Configuration
```json
// src-tauri/tauri.conf.json
{
  "build": {
    "beforeBuildCommand": "pnpm build",
    "beforeDevCommand": "pnpm dev",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "package": {
    "productName": "Shambu",
    "version": "0.1.0"
  }
}
```

### Release Process
```bash
# Build for all platforms
pnpm tauri build

# Platform-specific builds
pnpm tauri build --target x86_64-apple-darwin
pnpm tauri build --target x86_64-pc-windows-msvc
pnpm tauri build --target x86_64-unknown-linux-gnu
```

## Performance Optimization

### Memory Management
```rust
// src-tauri/src/cache.rs
use lru::LruCache;
use std::num::NonZeroUsize;

pub struct Cache {
    store: LruCache<String, Vec<u8>>
}

impl Cache {
    pub fn new() -> Self {
        Self {
            store: LruCache::new(NonZeroUsize::new(100).unwrap())
        }
    }
}
```

### Resource Cleanup
```typescript
// src/hooks/useCleanup.ts
export function useCleanup(callback: () => void) {
  useEffect(() => {
    const handleBeforeUnload = () => {
      callback();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [callback]);
} 