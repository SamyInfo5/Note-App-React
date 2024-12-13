import { DarkTheme, DefaultTheme, ThemeProvider, useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ 
            headerShown: true, title: 'All Notes' ,
            headerRight: () => (
              <Button title="➕" onPress={() => navigation.navigate('form')} />
            ),
          }} />
        <Stack.Screen name="form" options={{ 
            headerShown: true, title: 'Notes' ,
            headerLeft: () => (
              <Button title="⬅️" onPress={() => navigation.goBack()} />
            ),
          }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
