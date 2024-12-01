import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Surface } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";

// import { api } from "../utils/trpc";
import Meter from "../components/Meter";
import StyledButton from "../components/StyledButton";
import ReportTable from "../components/WeightReportTable";
import useBleStore from "../store/createDeviceConnectedSlice";
import { ReportSVG } from "../SVG";
import { Services, WeightChar } from "../types/constants";

export default function Weight() {
  const { weight, initialWeight, setCommand, startMonitoring, stopMonitoring } =
    useBleStore();

  const [isEnable, setIsEnable] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  // const utils = api.useContext();

  const handlePress = () => {
    initialWeight();
    // navigation.goBack();
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // const saveWeight = api.weight.saveWeight.useMutation({
  //   onSuccess() {
  //     ToastAndroid.show("Data saved successfully!", ToastAndroid.SHORT);
  //     utils.weight.getAllSavedWeights.invalidate();
  //   },
  //   onError() {
  //     ToastAndroid.show("Request sent failed!", ToastAndroid.SHORT);
  //   },
  // });

  // const save = () => {
  //   saveWeight.mutate({ obtainedWeight: Number(weight) });
  // };

  // const tare = () => {
  //   setCommand("T");
  //   ToastAndroid.show("Tare command send", ToastAndroid.SHORT);
  // };

  useEffect(() => {
    if (isEnable) {
      startMonitoring(Services.weight, WeightChar.weight, "weight123");
    } else {
      stopMonitoring("weight123");
    }
  }, [isEnable]);

  return (
    <SafeAreaView className="h-full w-full bg-white p-6">
      <View className="mt-10 flex flex-row items-center justify-between">
        <TouchableOpacity onPress={handlePress} className="mb-5">
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsVisible(true)} className="mb-5">
          <ReportSVG active={true} color="black" />
        </TouchableOpacity>
      </View>
      <View>
        <Text className="mb-8 text-5xl">Weight</Text>
      </View>
      <ScrollView>
        <Surface className="bg-primary-light-gray flex items-center justify-center rounded-2xl">
          <Meter
            value={Number(weight)}
            units="kg"
            isEnable={isEnable}
            setIsEnable={setIsEnable}
          />
        </Surface>
        {/* <View className="mb-5 flex flex-row items-center justify-between">
          <StyledButton
            text="Save"
            customStyle="bg-primary-light-gray w-[48%] mt-10"
            svg={<SaveSVG />}
            handlePress={save}
          />
          <StyledButton
            text="Tare"
            customStyle="bg-primary-yellow w-[48%] mt-10"
            svg={<Text className="text-2xl text-white">T</Text>}
            handlePress={tare}
          />
        </View> */}
      </ScrollView>
      {/* <ReportTable
        handleClose={handleClose}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      /> */}
    </SafeAreaView>
  );
}
