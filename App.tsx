import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider, MD3DarkTheme, configureFonts } from "react-native-paper";
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
import SignupScreen from "./app/login/register";



const theme: typeof MD3DarkTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    primary: '#E8BA19',  // Cor principal personalizada
    primaryContainer: '#4d3c00',
    secondary: '#ffb74d',
    secondaryContainer: '#ff9800',
    tertiary: '#ff7043',
    tertiaryContainer: '#ff5722',
    surface: '#1f1f1f',  // Cor de superfície escura
    surfaceVariant: '#373737', // Variante da cor da superfície
    surfaceDisabled: 'rgba(255, 255, 255, 0.12)',  // Superfície desabilitada
    background: '#121212',  // Cor de fundo padrão
    error: '#CF6679',  // Cor de erro
    errorContainer: '#B3261E',  // Contêiner da cor de erro
    onPrimary: '#000000',  // Texto sobre `primary`
    onPrimaryContainer: '#E8BA19',  // Texto sobre `primaryContainer`
    onSecondary: '#000000',  // Texto sobre `secondary`
    onSecondaryContainer: '#ffb74d',  // Texto sobre `secondaryContainer`
    onTertiary: '#000000',  // Texto sobre `tertiary`
    onTertiaryContainer: '#ff7043',  // Texto sobre `tertiaryContainer`
    onSurface: '#FFFFFF',  // Texto sobre superfícies
    onSurfaceVariant: '#CACACA',  // Texto sobre variantes de superfícies
    onSurfaceDisabled: 'rgba(255, 255, 255, 0.38)',  // Texto sobre superfícies desabilitadas
    onError: '#FFFFFF',  // Texto sobre erro
    onErrorContainer: '#FFB4A9',  // Texto sobre contêiner de erro
    onBackground: '#FFFFFF',  // Texto sobre o fundo
    outline: '#737373',  // Cor para bordas e separadores
    outlineVariant: '#8E8E8E',  // Variante da cor de borda
    inverseSurface: '#FFFFFF',  // Cor inversa da superfície
    inverseOnSurface: '#121212',  // Texto sobre superfícies inversas
    inversePrimary: '#4d3c00',  // Cor primária inversa
    shadow: '#000000',  // Cor da sombra
    scrim: '#000000',  // Cor de scrim (fundo de modais)
    backdrop: 'rgba(0, 0, 0, 0.5)',  // Cor de fundo para modais
    elevation: {
      level0: 'transparent',
      level1: 'rgba(255, 255, 255, 0.05)',
      level2: 'rgba(255, 255, 255, 0.08)',
      level3: 'rgba(255, 255, 255, 0.11)',
      level4: 'rgba(255, 255, 255, 0.12)',
      level5: 'rgba(255, 255, 255, 0.14)',
    },
  }
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
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
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
  const { isAuthenticated, profile } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated && !!profile ? (
        <Stack.Screen name="tabs" component={TabLayout} />
      ) : (
        <>
        <Stack.Screen name="login" component={Welcome} />
        <Stack.Screen name="register" component={SignupScreen} />
        </>
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
