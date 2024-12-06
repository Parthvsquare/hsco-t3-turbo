import type { FC } from "react";
import type { ListRenderItemInfo } from "react-native";
import type { Device } from "react-native-ble-plx";
import React, { useCallback } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

import { DeviceSVG } from "../SVG";
import CustomButton from "./Button";

interface DeviceModalListItemProps {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (deviceId: string) => void;
  closeModal: () => void;
  connectedDevice: Device | undefined;
  disconnectDevice?: () => void;
}

interface DeviceModalProps {
  devices: Device[];
  visible: boolean;
  connectToPeripheral: (deviceId: string) => void;
  closeModal: () => void;
  connectedDevice: Device | undefined;
  disconnectDevice?: () => void;
}

const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
  const {
    item,
    connectToPeripheral,
    closeModal,
    connectedDevice,
    disconnectDevice,
  } = props;

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item.id);
    closeModal();
  }, [closeModal, connectToPeripheral, item.item, connectedDevice]);

  const disconnectAndCloseModal = useCallback(() => {
    disconnectDevice();
    closeModal();
  }, [closeModal, connectToPeripheral, item.item, connectedDevice]);

  return (
    <View className="bg-primary-light-gray rounded-2xl p-5">
      <View className="border-primary-mid-gray mb-4 flex h-16 w-16 items-center justify-center rounded-full border-[1px]">
        <DeviceSVG />
      </View>
      <Text className="mb-2 text-2xl font-bold">{item.item.name}</Text>
      <Text className="mb-24 text-lg">ID: {item.item.id}</Text>
      {/* {item.item.id === connectedDevice?.id ? (
        <CustomButton text="Disconnect" handlePress={disconnectAndCloseModal} />
      ) : ( */}
      <CustomButton text="Connect & Save" handlePress={connectAndCloseModal} />
      {/* )} */}
    </View>
  );
};

const DeviceModal: FC<DeviceModalProps> = (props) => {
  const {
    devices,
    visible,
    connectToPeripheral,
    closeModal,
    connectedDevice,
    disconnectDevice,
  } = props;

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
          closeModal={closeModal}
          connectedDevice={connectedDevice}
          disconnectDevice={disconnectDevice}
        />
      );
    },
    [closeModal, connectToPeripheral],
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      onRequestClose={closeModal}
      visible={visible}
    >
      <SafeAreaView className="h-full w-full p-6">
        <TouchableOpacity
          className="absolute left-6 top-6"
          onPress={closeModal}
        >
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text className="mr-5 mt-10 w-9/12 text-left text-5xl font-normal">
          Available device
        </Text>
        <FlatList
          className="space-y-2"
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default DeviceModal;
