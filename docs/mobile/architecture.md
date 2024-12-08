# Mobile App Architecture

## Overview

The Shambu mobile app is built using React Native with Expo, providing a native experience on both iOS and Android platforms.

## Project Structure

```
apps/mobile/
├── src/
│   ├── screens/           # Screen components
│   ├── components/        # Reusable UI components
│   ├── navigation/        # Navigation configuration
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and business logic
│   ├── utils/            # Utility functions
│   ├── constants/        # App constants
│   └── types/            # TypeScript type definitions
├── assets/               # Static assets
├── App.tsx              # Root component
└── app.json            # Expo configuration
```

## Navigation Architecture

### Stack Navigator
```typescript
export type RootStackParamList = {
  Home: undefined;
  Profile: { id: string };
  Network: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

<Stack.Navigator
  initialRouteName="Home"
  screenOptions={{
    headerStyle: {
      backgroundColor: '#4F46E5',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}
>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} />
  <Stack.Screen name="Network" component={NetworkScreen} />
</Stack.Navigator>
```

## Screen Components

### HomeScreen
```typescript
export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Shambu</Text>
        <Text style={styles.subtitle}>
          Discover your professional network
        </Text>
      </View>
      {/* Navigation Cards */}
    </ScrollView>
  );
}
```

## State Management

### Local State
- React's useState for component-level state
- useReducer for complex state logic

### Global State
```typescript
// stores/profileStore.ts
import create from 'zustand';

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
```

## API Integration

### Supabase Client
```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

## Authentication Flow

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { session, signIn, signOut };
}
```

## Performance Optimization

### Image Optimization
```typescript
import { Image } from 'expo-image';

function OptimizedImage({ uri }: { uri: string }) {
  return (
    <Image
      source={{ uri }}
      style={styles.image}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
    />
  );
}
```

### List Optimization
```typescript
import { FlashList } from '@shopify/flash-list';

function OptimizedList({ data }: { data: Item[] }) {
  const renderItem = useCallback(({ item }: { item: Item }) => (
    <ItemComponent item={item} />
  ), []);

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={100}
      keyExtractor={(item) => item.id}
    />
  );
}
```

## Error Handling

```typescript
// utils/error.ts
export function handleError(error: unknown) {
  if (error instanceof Error) {
    Alert.alert('Error', error.message);
  } else {
    Alert.alert('Error', 'An unexpected error occurred');
  }
}

// Usage in components
try {
  await someAsyncOperation();
} catch (error) {
  handleError(error);
}
```

## Offline Support

### Data Persistence
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

async function cacheData(key: string, data: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching data:', error);
  }
}

async function getCachedData(key: string) {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading cached data:', error);
    return null;
  }
}
```

## Testing Strategy

### Unit Tests
```typescript
// __tests__/screens/HomeScreen.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Welcome to Shambu')).toBeTruthy();
  });

  it('navigates to Network screen', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    
    fireEvent.press(getByText('Network'));
    expect(navigation.navigate).toHaveBeenCalledWith('Network');
  });
});
```

## Build and Deployment

### iOS Build
```bash
# Generate iOS build
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android Build
```bash
# Generate Android build
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

## Security Considerations

### Secure Storage
```typescript
import * as SecureStore from 'expo-secure-store';

async function saveSecureItem(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getSecureItem(key: string) {
  return await SecureStore.getItemAsync(key);
}
```

### API Key Protection
```typescript
// Use environment variables
const apiKey = process.env.EXPO_PUBLIC_API_KEY;

// Or secure storage for sensitive keys
const sensitiveKey = await getSecureItem('sensitive_key');
``` 