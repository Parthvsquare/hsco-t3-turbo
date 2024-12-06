import React from "react";
import { Text, View } from "react-native";
import { Surface } from "react-native-paper";
import { Link } from "expo-router";

import useBleStore from "../store/createDeviceConnectedSlice";

const ModeBox = ({
  icon,
  name,
  margin,
  screen,
  currentMode,
  disabled,
}: any) => {
  const { setCurrentMode, initialWeight, getMaxWeight } = useBleStore();

  const isDisabled = disabled?.length !== 0;
  return (
    <Link
      style={{ marginRight: margin, marginTop: 20 }}
      onPress={() => {
        setCurrentMode(currentMode);
        initialWeight();
        getMaxWeight();
      }}
      href={`/${screen}`}
      disabled={!isDisabled}
    >
      <Surface style={{ borderRadius: 16 }}>
        <View
          className={`${
            isDisabled ? "bg-primary-light-gray" : "bg-primary-black-overlay"
          } border-primary-mid-gray flex h-44 w-[170px] flex-col justify-between rounded-2xl border-[1px] p-5`}
        >
          <View className="h-8 w-8">{icon}</View>
          <Text className="text-lg font-semibold">{name}</Text>
        </View>
      </Surface>
    </Link>
  );
};

export default ModeBox;
