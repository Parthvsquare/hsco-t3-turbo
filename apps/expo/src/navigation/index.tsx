import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";

import { useUser } from "~/utils/auth";

export default function Navigation() {
  const { user, isLoading } = useUser(); // Ensure the hook resolves the user data
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.replace("(tabs)/home");
    } else {
      router.replace("/");
    }
  }, [user, isLoading]);

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
    </Stack>
  );
}
