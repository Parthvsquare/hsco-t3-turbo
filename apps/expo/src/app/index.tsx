import { Button, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSignIn, useSignOut, useUser } from "~/utils/auth";

function MobileAuth() {
  const user = useUser();
  const signIn = useSignIn();
  const signOut = useSignOut();

  return (
    <>
      <Button
        onPress={() => {
          console.log("🚀 ~ MobileAuth ~ user:");
          signIn();
        }}
        title={user ? "Sign Out" : "Sign In With google"}
        color={"#5B65E9"}
      />
    </>
  );
}

export default function Index() {
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
