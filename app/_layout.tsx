import AuthProvider, { useAuth } from "@/atoms/auth";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import "react-native-reanimated";

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

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={DarkTheme}>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </PaperProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const theme: typeof MD3DarkTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#0F0F0F",
    secondary: "#E8BA19",
  },
};

function RootLayoutNav() {
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
      if(isAuthenticated && token) {
        router.navigate("(tabs)");
      }else {
        router.navigate("login");
      }
  }, [isAuthenticated, token]);

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
