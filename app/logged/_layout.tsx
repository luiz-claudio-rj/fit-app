import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Pressable } from "react-native";
import TabOneScreen from ".";
import BodyProgressAndUpdate from "./BodyProgressAndUpdate";
import Profile from "./profile";
import Workout, { Video } from "./workout";
import WorkoutList from "./WorkoutList";

export type LoginNavigation = {
  welcome: undefined;
  register: undefined;
}

export type TabsNavigation = {
  index: undefined;
  bodyInfo: undefined;
  middle: undefined;
  workoutList: undefined;
  four: undefined;
  five: undefined;
} & LoginNavigation;

export type StackWorkoutNavigation = {
  workouts: undefined;
  workout: { video: Video };
  Tabs: undefined;
};

export type LoggedNavigationProp = TabsNavigation & StackWorkoutNavigation;

export type useNavigationProps = StackNavigationProp<LoggedNavigationProp>;

const Stack = createStackNavigator<StackWorkoutNavigation>();

const Tabs = createBottomTabNavigator<TabsNavigation>();

const queryClient = new QueryClient();

export default function TabLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Tabs" component={TabsNavigation} />
        <Stack.Screen name="workouts" component={WorkoutList} />
        <Stack.Screen name="workout" component={Workout} />
      </Stack.Navigator>
    </QueryClientProvider>
  );
}

const TabsNavigation = () => {
  return (
    <Tabs.Navigator
      tabBar={customTabbar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" component={TabOneScreen} />
      <Tabs.Screen name="bodyInfo" component={BodyProgressAndUpdate} />
      <Tabs.Screen name="workoutList" component={WorkoutList} />
      <Tabs.Screen name="five" component={Profile} />
    </Tabs.Navigator>
  );
};

const Icon = ({
  name,
  isActive,
  isDisabled,
}: {
  name: string;
  isActive: boolean;
  isDisabled: boolean;
}) => {
  const size = 25;
  const color = isDisabled ? "#4d4c4c" : isActive ? Colors.white : "#c5c5c5";
  switch (name) {
    case "index":
      return <MaterialIcons size={size} name="home" color={color} />;
    case "bodyInfo":
      return <FontAwesome6 size={size} name="person-running" color={color} />;
    case "workoutList":
      return <FontAwesome5 size={size} name="dumbbell" color={color} />;
    case "five":
      return <MaterialIcons size={size} name="person" color={color} />;
    default:
      return <MaterialIcons size={size} name="person" color={color} />;
  }
};

const customTabbar = ({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: Colors.darkGray,
        paddingVertical: 10,
        borderRadius: 10,
      }}
    >
      {state.routes.map((route, index) => {
        const isActive = state.index === index;
        // if (route.name === "middle") {
        //   return (
        //     <Pressable
        //       key={route.key}
        //       style={{
        //         alignItems: "center",
        //         backgroundColor: Colors.secondary,
        //         width: 50,
        //         height: 50,
        //         justifyContent: "center",
        //         borderRadius: 10,
        //         top: -30,
        //       }}
        //     >
        //       <FontAwesome6 size={25} name="plus" color={Colors.white} />
        //     </Pressable>
        //   );
        // }

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={{
              alignItems: "center",
              backgroundColor: isActive ? Colors.primary : "transparent",
              width: 50,
              height: 50,
              justifyContent: "center",
              borderRadius: 10,
            }}
          >
            <Icon name={route.name} isActive={isActive} isDisabled={false} />
            {isActive && (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: 5,
                  backgroundColor: Colors.secondary,
                  borderRadius: 10,
                  width: 30,
                }}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
};
