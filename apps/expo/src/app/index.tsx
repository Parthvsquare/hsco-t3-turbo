import { useEffect, useRef } from "react";
import { Button, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { useSignIn, useUser } from "~/utils/auth";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function MobileAuth() {
  const signIn = useSignIn();

  return (
    <>
      <Button
        onPress={() => {
          signIn();
        }}
        title={"Sign In With google"}
        color={"#5B65E9"}
      />
    </>
  );
}

export default function Index() {
  const { user, isLoading } = useUser(); // Ensure the hook resolves the user data
  const router = useRouter();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!hasNavigated.current && !isLoading) {
      if (user) {
        router.replace("(tabs)/home");
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 500);
      } else {
        SplashScreen.hideAsync();
      }
      hasNavigated.current = true;
    }
  }, [user, isLoading]);

  return (
    <SafeAreaView className="flex h-full w-full items-center justify-center bg-white p-6">
      {/* Changes page title visible on the header */}
      <View className="h-full w-full p-4">
        <View className="flex h-full w-full items-center justify-center">
          <View className="mb-10 h-16 w-16">
            <Image
              className="h-16 w-16"
              source={require("../../assets/icon.png")}
            />
          </View>

          <MobileAuth />
        </View>
      </View>
    </SafeAreaView>
  );
}
