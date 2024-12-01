import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Button } from "react-native-paper";
import Constants from "expo-constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useSignOut, useUser } from "~/utils/auth";
import ProfileModal from "../../components/ProfileModal";
import { ReportSVG } from "../../SVG";
import { api } from "../../utils/api";
import { openInBrowser } from "../../utils/common";

const Profile = () => {
  const [isVisible, setIsVisible] = useState(false);
  const user = useUser();
  console.log("🚀 ~ Profile ~ user:", user);
  const utils = api.useContext();

  const signOut = useSignOut();

  // const onSignOutPress = async () => {
  //   try {
  //     await signOut();
  //   } catch (err: any) {
  //     console.log("Error:> " + err?.status || "");
  //     console.log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
  //   }
  // };

  // const { data: reports } = api.report.getReportTable.useQuery({
  //   pageLength: 10,
  // });

  const getDaysLeft = () => {
    const todayDate = new Date();
    const created = new Date(user?.createdAt || "");

    const diff = todayDate.getTime() - created.getTime();
    const remaining = Math.ceil(diff / (1000 * 60 * 60 * 24));

    const remainingDays = 365 - remaining;

    return remainingDays;
  };

  const onClearCache = () => {
    utils.invalidate();
  };

  return (
    <SafeAreaView className="relative h-full w-full">
      <View className="relative h-full w-full bg-white p-6">
        <Text className="mb-5 mt-10 w-3/4 text-5xl">Account</Text>
        <View className="mb-5 flex flex-row items-center justify-between">
          {user?.image ? (
            <Avatar.Image size={160} source={{ uri: user.image }} />
          ) : (
            <Avatar.Text
              size={160}
              label={
                user.fullName
                  ?.split(" ")
                  .map((word) => word.slice(0, 1).toUpperCase())
                  .join("") ?? "JD"
              }
            />
          )}
          <View className="basis-1/2">
            <Text className="text-2xl font-bold">
              {user?.name ? user.name : "John Doe"}
            </Text>
            <Text className="text-primary-gray mb-2 text-lg font-medium">
              {user?.email ? user.email : "johndoe@gmail.com"}
            </Text>
            {/* <Button
              style={{ width: 120, borderRadius: 8 }}
              mode="elevated"
              buttonColor="black"
              textColor="white"
              onPress={() => setIsVisible(true)}
            >
              Edit Profile
            </Button> */}
          </View>
        </View>
        {/* <View className="border-b-[1px] border-slate-200 px-2 py-4">
          <View className="flex flex-row items-center justify-between">
            <View className="mb-4 flex flex-row items-center justify-start">
              <ReportSVG color="black" active />
              <Text className="ml-4 text-lg">Number Of Reports</Text>
            </View>
            <Text className="text-lg">{reports?.totalCount}</Text>
          </View>
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center justify-start">
              <AntDesign name="calendar" size={24} color="black" />
              <Text className="ml-4 text-lg">Number Of Days Left</Text>
            </View>
            <Text className="text-lg">{getDaysLeft()}</Text>
          </View>
        </View> */}
        <View className="border-b-[1px] border-slate-200 py-2">
          <TouchableOpacity
            onPress={() => openInBrowser("https://www.google.com")}
            className="flex flex-row items-center justify-between px-2 py-2"
          >
            <View className="flex flex-row items-center justify-start">
              <MaterialIcons name="support-agent" size={24} color="black" />
              <Text className="ml-4 text-lg">Support</Text>
            </View>
            <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClearCache}
            className="flex flex-row items-center justify-between px-2 py-2"
          >
            <View className="flex flex-row items-center justify-start">
              <MaterialIcons name="delete-outline" size={24} color="black" />
              <Text className="ml-4 text-lg">Clear Cache</Text>
            </View>
            <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={signOut}
            className="flex flex-row items-center justify-between px-2 py-2"
          >
            <View className="flex flex-row items-center justify-start">
              <Feather name="log-out" size={24} color="red" />
              <Text className="ml-4 text-lg">Log Out</Text>
            </View>
            <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>
        </View>
        <Text className="mt-5 text-center">
          App Version: {Constants.manifest2?.extra?.expoClient?.version}
        </Text>
      </View>
      {/* <ProfileModal isVisible={isVisible} setIsVisible={setIsVisible} /> */}
    </SafeAreaView>
  );
};

export default Profile;
