import React from "react";
import { Stack } from "expo-router";

export default function Navigation() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" />
      <Stack.Screen name="connect" />
      <Stack.Screen name="weight" />
      <Stack.Screen name="liter" />
    </Stack>
  );
}
