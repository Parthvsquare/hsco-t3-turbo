import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";

import { HomeSVG, ModeSVG, ProfileSVG } from "~/SVG";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 50,
          right: 50,
          elevation: 0,
          backgroundColor: "#000000",
          borderRadius: 24,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <HomeSVG active={focused} />,
        }}
      />
      <Tabs.Screen
        name="mode"
        options={{
          title: "Mode",
          tabBarIcon: ({ focused }) => <ModeSVG active={focused} />,
        }}
      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      /> */}

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <ProfileSVG active={focused} />,
        }}
      />
    </Tabs>
  );
}
