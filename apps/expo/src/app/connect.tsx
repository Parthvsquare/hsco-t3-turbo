import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";

import CustomButton from "../components/Button";
import DeviceModal from "../components/DeviceModal";
import useBLE from "../hooks/useBLE";
import useBleStore from "../store/createDeviceConnectedSlice";

export default function ConnectScreen() {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    // connectToDevice,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const navigation = useNavigation();
  const router = useRouter();
  const { device, devices, isScanning, startScan, stopScan, connectToDevice } =
    useBleStore();

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    stopScan();
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (device) {
      router.navigate("(tabs)/home");
    }
  }, [device]);

  return (
    <SafeAreaView>
      <View className="relative h-full w-full bg-white p-6">
        <View className="mt-10">
          <View className="flex flex-row items-center justify-between">
            <Text className="w-3/4 text-5xl">Connect to your device</Text>
            <Button
              mode="elevated"
              buttonColor="#EFA63E"
              onPress={() => router.navigate("(tabs)/home")}
            >
              Skip
            </Button>
          </View>
          <Text className="mt-8 text-2xl">
            Press the <Text className="color-primary-yellow">button</Text> to
            connect
          </Text>
          <DeviceModal
            closeModal={hideModal}
            visible={isModalVisible}
            connectToPeripheral={connectToDevice}
            devices={allDevices}
            connectedDevice={device}
          />
        </View>
        <CustomButton
          text="See your device"
          handlePress={openModal}
          position="absolute bottom-6 left-6"
        />
      </View>
    </SafeAreaView>
  );
}
