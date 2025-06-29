import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Mock AsyncStorage so your history loader doesn’t break
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock useSearchHistory to always return a valid object
jest.mock('@/hooks/useSearchHistory', () => ({
  useSearchHistory: () => ({
    history: [],
    addToHistory: jest.fn(),
    clearHistory: jest.fn(),
  }),
}));

// *Mock expo-router* so useRouter() won’t crash
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  Stack: {
    Screen: 'Screen', // a dummy component
  },
}));
