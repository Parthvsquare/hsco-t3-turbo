import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useRouter } from "expo-router";

import CustomButton from "../components/Button";

const Terms = () => {
  const router = useRouter();
  const [accept, setAccept] = useState<"checked" | "unchecked">("unchecked");

  const handlePress = () => {
    if (accept === "unchecked") {
      setAccept("checked");
    } else {
      setAccept("unchecked");
    }
  };

  const handleContinue = () => {
    if (accept === "checked") {
      router.navigate("index");
    } else {
      ToastAndroid.show(
        "Please accept the terms and conditions",
        ToastAndroid.SHORT,
      );
    }
  };
  return (
    <SafeAreaView className="h-full w-full bg-white p-6">
      <ScrollView className="mt-10 h-full w-full">
        <Text className="mb-5 w-3/4 text-5xl">Terms & Conditions</Text>
        <View className="h-[75vh]">
          <Text>
            Please read these terms and conditions ("terms and conditions",
            "terms") carefully before using [mobile name] mobile application
            (“app”, "service") operated by [company name] ("us", 'we", "our").
          </Text>
          <Text>Conditions of use</Text>
          <Text>
            By using this app, you certify that you have read and reviewed this
            Agreement and that you agree to comply with its terms. If you do not
            want to be bound by the terms of this Agreement, you are advised to
            stop using the app accordingly. [company name] only grants use and
            access of this app, its products, and its services to those who have
            accepted its terms
          </Text>
          <View className="flex flex-row items-center justify-start">
            <Checkbox status={accept} onPress={handlePress} color="black" />
            <Text>I agreee with the terms an conditions</Text>
          </View>
        </View>
        <CustomButton text="Continue" handlePress={handleContinue} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Terms;
