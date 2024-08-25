import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import AuthProvider, { useAuth } from "./atoms/auth";
import {
  DarkTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "./app/login/welcome";
import TabLayout from "./app/logged/_layout";
import { SafeAreaProvider } from "react-native-safe-area-context";

const theme: typeof MD3DarkTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#0F0F0F",
    secondary: "#E8BA19",
  },
};

export default function App() {
  const [fontsLoaded, error] = useFonts({
    Inter: require("./assets/fonts/Inter-Regular.ttf"),
    Inter_Semibold: require("./assets/fonts/Inter-SemiBold.ttf"),
    Inter_Bold: require("./assets/fonts/Inter-Bold.ttf"),
    Inter_Black: require("./assets/fonts/Inter-Black.ttf"),
    Libre: require("./assets/fonts/LibreBaskerville-Regular.ttf"),
    Libre_Bold: require("./assets/fonts/LibreBaskerville-Bold.ttf"),
    ...FontAwesome.font,
    ...FontAwesome6.font,
    ...FontAwesome5.font,
  });
  const { loaded } = useAuth();
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded && loaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loaded]);

  if (!fontsLoaded && !loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <ThemeProvider value={DarkTheme}>
          <PaperProvider theme={theme}>
            <AuthProvider>
              <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1 }}>
                  <StatusBar barStyle='light-content' translucent backgroundColor="transparent"  />
                  <RootLayoutNav />
                </SafeAreaView>
              </SafeAreaProvider>
            </AuthProvider>
          </PaperProvider>
        </ThemeProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const Stack = createNativeStackNavigator();

function RootLayoutNav() {
  const { isAuthenticated, token } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!!token ? (
        <Stack.Screen name="tabs" component={TabLayout} />
      ) : (
        <Stack.Screen name="login" component={Welcome} />
      )}
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
