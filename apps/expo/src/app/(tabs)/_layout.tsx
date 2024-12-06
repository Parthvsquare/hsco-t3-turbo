import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="mode"
        // options={{
        //   title: 'Mode',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="code.square" color={color} />,
        // }}
      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      */}
      <Tabs.Screen
        name="profile"
        // options={{
        //   title: "Profile",
        //   tabBarIcon: ({ color }) => (
        //     <IconSymbol size={28} name="person.crop.circle" color={color} />
        //   ),
        // }}
      />
    </Tabs>
  );
}
