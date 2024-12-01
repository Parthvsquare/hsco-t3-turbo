import type { ReactElement } from "react";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Surface } from "react-native-paper";

interface StyledButtonProps {
  customStyle: string;
  text: string;
  svg: ReactElement;
  handlePress: () => void;
}

const StyledButton = ({
  svg,
  customStyle,
  text,
  handlePress,
}: StyledButtonProps) => {
  return (
    <Surface
      mode="elevated"
      className={`rounded-xl ${customStyle ? customStyle : ""}`}
    >
      <TouchableOpacity
        onPress={handlePress}
        className={`flex flex-row items-center justify-start rounded-xl p-2`}
      >
        <View className="flex h-[55px] w-[55px] items-center justify-center rounded-xl bg-black">
          {svg}
        </View>
        <Text className="ml-4 text-base font-bold">{text}</Text>
      </TouchableOpacity>
    </Surface>
  );
};

export default StyledButton;
