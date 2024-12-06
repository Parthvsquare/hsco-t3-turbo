import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Button, TextInput, useTheme } from "react-native-paper";
import * as Location from "expo-location";
import AntDesign from "@expo/vector-icons/AntDesign";

const ProfileModal = ({ isVisible, setIsVisible }) => {
  const { user } = useUser();
  const theme = useTheme();
  const [location, setLocation] = useState({ longitude: 0, latitude: 0 });
  const [shopName, setShopName] = useState(user?.lastName || "");
  const [customer, setCustomer] = useState(user?.firstName || "");
  const [phone, setPhone] = useState(user?.unsafeMetadata?.phoneNumber || "");
  const [industry, setIndustry] = useState(
    user?.unsafeMetadata?.industry || "",
  );
  const [gst, setGst] = useState(user?.unsafeMetadata?.gstNumber || "");

  useEffect(() => {
    (async () => {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        longitude: loc.coords.longitude,
        latitude: loc.coords.latitude,
      });
    })();
  }, []);

  const save = async () => {
    try {
      const update = await user?.update({
        firstName: customer,
        lastName: shopName,
        unsafeMetadata: {
          gstNumber: gst,
          phoneNumber: phone,
          industry: industry,
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
      ToastAndroid.show("Profile Updated", ToastAndroid.SHORT);
    } catch (err: any) {
      ToastAndroid.show(err, ToastAndroid.SHORT);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={false}
      animationType="slide"
      onRequestClose={() => setIsVisible(false)}
    >
      <SafeAreaView className="flex h-full w-full bg-white p-5">
        <View className="mb-5 flex flex-row items-center justify-between">
          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Button
            mode="elevated"
            buttonColor="black"
            textColor="white"
            style={{ borderRadius: 8 }}
            onPress={save}
          >
            Save
          </Button>
        </View>
        <Text className="mb-5 text-4xl">Edit Profile</Text>
        <View className="mb-5 flex flex-row items-center justify-center">
          {!user?.profileImageUrl.includes("gravatar") ? (
            <Avatar.Image size={160} source={{ uri: user?.profileImageUrl }} />
          ) : (
            <Avatar.Text
              size={160}
              label={
                user?.fullName
                  ?.split(" ")
                  .map((word) => word.slice(0, 1).toUpperCase())
                  .join("") ?? "JD"
              }
            />
          )}
        </View>
        <Text className="mb-3 text-xl">Your Information</Text>
        <TextInput
          className="mb-4"
          mode="outlined"
          textContentType="username"
          disabled
          value={user?.username ?? ""}
          label="Username"
          theme={{
            colors: {
              primary: theme.colors.onBackground,
              background: theme.colors.onPrimary,
            },
          }}
        />
        <TextInput
          className="mb-4"
          mode="outlined"
          textContentType="name"
          value={customer}
          label="Name"
          theme={{
            colors: {
              primary: theme.colors.onBackground,
              background: theme.colors.onPrimary,
            },
          }}
          onChangeText={(val) => setCustomer(val)}
        />
        <TextInput
          className="mb-4"
          mode="outlined"
          textContentType="name"
          value={shopName}
          label="Shop Name"
          theme={{
            colors: {
              primary: theme.colors.onBackground,
              background: theme.colors.onPrimary,
            },
          }}
          onChangeText={(val) => setShopName(val)}
        />
        <TextInput
          className="mb-4"
          mode="outlined"
          textContentType="name"
          value={gst}
          label="GST number"
          theme={{
            colors: {
              primary: theme.colors.onBackground,
              background: theme.colors.onPrimary,
            },
          }}
          onChangeText={(val) => setGst(val)}
        />
        <TextInput
          className="mb-4"
          mode="outlined"
          textContentType="telephoneNumber"
          value={phone}
          label="Phone Number"
          theme={{
            colors: {
              primary: theme.colors.onBackground,
              background: theme.colors.onPrimary,
            },
          }}
          keyboardType="numeric"
          onChangeText={(val) => setPhone(val)}
        />
        <TextInput
          className="mb-4"
          mode="outlined"
          textContentType="name"
          value={industry}
          label="Industry"
          theme={{
            colors: {
              primary: theme.colors.onBackground,
              background: theme.colors.onPrimary,
            },
          }}
          onChangeText={(val) => setIndustry(val)}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default ProfileModal;
