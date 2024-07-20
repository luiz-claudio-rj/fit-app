import { Stack } from "expo-router";
import "react-native-reanimated";


export default function RootLayoutNav() {


  return (
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      </Stack>
  );
}
