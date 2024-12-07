import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Modal, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import useBleStore from "../store/createDeviceConnectedSlice";
import { SaveSVG } from "../SVG";
import { Services, WeightChar } from "../types/constants";
import { api } from "../utils/api";
import Meter from "./Meter";
import StyledButton from "./StyledButton";

const PieceCreate = ({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: React.SetStateAction<boolean>;
}) => {
  const {
    setPieceTemplate,
    weight,
    startMonitoring,
    stopMonitoring,
    setCommand,
    unitWeight,
    initialWeight,
    setUnitWeight,
  } = useBleStore();
  const [isEnable, setIsEnable] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [unit, setUnit] = useState(unitWeight);
  const utils = api.useUtils();
  const router = useRouter();

  const setTemplate =
    api.pieceCountingTemplate.savePieceCountTemplate.useMutation({
      onSuccess() {
        ToastAndroid.show("Template saved successfully!", ToastAndroid.SHORT);
        utils.pieceCountingTemplate.getAllMyPieceCountTemplate.invalidate();
      },
      onError() {
        ToastAndroid.show("Request sent failed!", ToastAndroid.SHORT);
      },
    });

  const tare = () => {
    setCommand("T");
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsEnable(false);
    initialWeight();
  };

  const handleSave = () => {
    setUnitWeight(unit);
    setIsVisible(false);
    stopMonitoring("weight123");
    setPieceTemplate(templateName);
    setTemplate.mutate({
      itemName: templateName,
      singlePieceWeight: Number(unit),
    });
    router.navigate("count");
    initialWeight();
  };

  useEffect(() => {
    if (isEnable) {
      startMonitoring(Services.weight, WeightChar.weight, "weight123");
    } else {
      stopMonitoring("weight123");
    }
  }, [isEnable]);

  useEffect(() => {
    const value = String((Number(weight) / 25).toFixed(3));
    setUnit(value);
  }, [weight]);

  return (
    <Modal visible={isVisible} onDismiss={handleClose}>
      <SafeAreaView className="flex h-full w-full">
        <View className="h-full bg-white p-5">
          <View className="flex flex-row items-center justify-between">
            <TouchableOpacity onPress={handleClose} className="mb-5">
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text className="mb-2 text-2xl">
            Please place 25 pieces of items to get the unit weight
          </Text>
          <TextInput
            autoCapitalize="none"
            value={templateName}
            // className="bg-primary-light-gray my-5 block w-full"
            style={{
              backgroundColor: "#E5E5E5",
              width: "100%",
              // borderRadius: 16,
              paddingHorizontal: 16,
              // paddingVertical: 20,
            }}
            textContentType="username"
            label="Template Name"
            onChangeText={(val) => setTemplateName(val)}
            enablesReturnKeyAutomatically
            selectTextOnFocus
          />
          <View className="bg-primary-light-gray mt-5 rounded-2xl">
            <Meter
              value={Number(weight)}
              units="kg"
              isEnable={isEnable}
              setIsEnable={setIsEnable}
            />
          </View>
          <Text className="my-4 text-center text-2xl">Unit Weight: {unit}</Text>
          <View className="flex flex-row items-center justify-between">
            <StyledButton
              handlePress={handleSave}
              customStyle="mb-5 basis-[48%] bg-primary-light-gray"
              text="Save"
              svg={<SaveSVG />}
            />
            <StyledButton
              handlePress={tare}
              customStyle="mb-5 basis-[48%] bg-primary-yellow"
              text="Tare"
              svg={<Text className="text-2xl text-white">T</Text>}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PieceCreate;
