import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable } from "react-native";
import TabOneScreen from ".";
import Profile from "./profile";
import TabTwoScreen from "./two";

export type TabsNavigation = {
  index: undefined;
  two: undefined;
  middle: undefined;
  four: undefined;
  five: undefined;
};

const Tabs = createBottomTabNavigator<TabsNavigation>();

export default function TabLayout() {
  return (
    <Tabs.Navigator
      tabBar={customTabbar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" component={TabOneScreen} />
      <Tabs.Screen name="two" component={TabTwoScreen} />
      <Tabs.Screen name="middle" component={TabTwoScreen} />
      <Tabs.Screen name="four" component={TabTwoScreen} />
      <Tabs.Screen name="five" component={Profile} />
    </Tabs.Navigator>
  );
}

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
    case "two":
      return <FontAwesome6 size={size} name="person-running" color={color} />;
    case "four":
      return <Ionicons size={size} name="restaurant" color={color} />;
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
        const isDisabled = route.name === "four";
        if (route.name === "middle") {
          return (
            <Pressable
              key={route.key}
              style={{
                alignItems: "center",
                backgroundColor: Colors.secondary,
                width: 50,
                height: 50,
                justifyContent: "center",
                borderRadius: 10,
                top: -30,
              }}
            >
              <FontAwesome6 size={25} name="plus" color={Colors.white} />
            </Pressable>
          );
        }

        return (
          <Pressable
            key={route.key}
            disabled={isDisabled}
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
            <Icon
              name={route.name}
              isActive={isActive}
              isDisabled={isDisabled}
            />
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
