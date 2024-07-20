import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
    Inter_Semibold: require("../assets/fonts/Inter-SemiBold.ttf"),
    Inter_Bold: require("../assets/fonts/Inter-Bold.ttf"),
    Inter_Black: require("../assets/fonts/Inter-Black.ttf"),
    Libre: require("../assets/fonts/LibreBaskerville-Regular.ttf"),
    Libre_Bold: require("../assets/fonts/LibreBaskerville-Bold.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const isAuthenticated = false;

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        {
          // If the user is not authenticated, show the login screen.
          !isAuthenticated ? (
            <Stack.Screen name="login" options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </>
          )
        }
      </Stack>
    </ThemeProvider>
  );
}
