import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";

import { useUser } from "~/utils/auth";

export default function Navigation() {
  const { session, isLoading } = useUser(); // Ensure the hook resolves the user data
  const router = useRouter();

  useEffect(() => {
    if (session && !isLoading) {
      router.replace("(tabs)/home");
    } else {
      router.replace("/");
    }
  }, [session, isLoading]);

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
