import React from "react";
import { Button } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";

interface CustomButtonProps {
  text: string;
  handlePress: () => void;
  position?: string;
}

const CustomButton = ({ text, handlePress, position }: CustomButtonProps) => {
  return (
    <Button
      className={`${position ? position : ""}`}
      mode="elevated"
      textColor="white"
      icon={() => <AntDesign name="arrowright" size={18} color="white" />}
      contentStyle={{ flexDirection: "row-reverse", paddingVertical: 8 }}
      style={{ width: 200, backgroundColor: "black" }}
      labelStyle={{ fontSize: 18 }}
      onPress={handlePress}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
