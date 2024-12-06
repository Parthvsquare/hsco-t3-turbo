import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";

import { useUser } from "~/utils/auth";

export default function Navigation() {
  const [loading, setLoading] = useState(true);
  const user = useUser(); // Ensure the hook resolves the user data
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setLoading(false);
      router.replace("(tabs)/home");
    } else {
      setLoading(false);
      router.replace("/");
    }
  }, [user, router]);

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
