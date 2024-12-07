import type { Dispatch } from "react";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface ValueInputProps {
  value: string;
  text: string;
  placeHolder: string;
  margin?: string;
  setValue: Dispatch<React.SetStateAction<string>>;
}

const ValueInput = ({
  value,
  text,
  placeHolder,
  setValue,
  margin,
}: ValueInputProps) => {
  return (
    <View className={margin ? margin : ""}>
      <Text className="mb-2">{text}</Text>
      <TextInput
        className="bg-primary-light-gray block w-full rounded-2xl px-4 py-2"
        style={{
          backgroundColor: "#E5E5E5",
          width: "100%",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
        autoCapitalize="none"
        value={value}
        textContentType="telephoneNumber"
        placeholder={placeHolder}
        placeholderTextColor="#000"
        onChangeText={(val) => setValue(val)}
        enablesReturnKeyAutomatically
        keyboardType="phone-pad"
        selectTextOnFocus
      />
    </View>
  );
};

export default ValueInput;
