import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import AlarmReportTable from "../components/AlarmReportTable";
import Meter from "../components/Meter";
import StyledButton from "../components/StyledButton";
import ValueInput from "../components/ValueInput";
import useBleStore from "../store/createDeviceConnectedSlice";
import { ReportSVG, SaveSVG, SettingSVG } from "../SVG";
import { Services, WeightChar } from "../types/constants";
import { api } from "../utils/api";

const Weight = () => {
  const {
    startMonitoring,
    weight,
    initialWeight,
    minAlarm,
    maxAlarm,
    setMaxAlarm,
    setMinAlarm,
    setCommand,
    stopMonitoring,
    getMaxAlarm,
    getMinAlarm,
  } = useBleStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [isEnable, setIsEnable] = useState<boolean>(false);
  const [item, setItem] = useState("");
  const [max, setMax] = useState(maxAlarm);
  const [min, setMin] = useState(minAlarm);
  const [bgColor, setBgColor] = useState("bg-alarm-green");
  const utils = api.useContext();
  const router = useRouter();

  const handlePress = () => {
    initialWeight();
    router.back();
  };

  const handleClose = () => {
    setMax(maxAlarm);
    setMin(minAlarm);
    setIsVisible(false);
  };

  const handleSave = () => {
    setMaxAlarm(max);
    setMinAlarm(min);
    setIsVisible(false);
  };

  const mutate = api.alarm.saveAlarm.useMutation({
    onSuccess() {
      ToastAndroid.show("Data saved successfully!", ToastAndroid.SHORT);
      utils.alarm.getAllSavedAlarm.invalidate();
    },
    onError() {
      ToastAndroid.show("Request sent failed!", ToastAndroid.SHORT);
    },
  });

  const save = () => {
    mutate.mutate({
      itemName: item,
      alertLowerLimit: Number(min),
      alertUpperLimit: Number(max),
      weightSavedAt: Number(weight),
    });
  };

  const tare = () => {
    setCommand("T");
  };

  useEffect(() => {
    if (Number(weight) < Number(min)) {
      setBgColor("bg-alarm-orange");
    } else if (Number(weight) > Number(max)) {
      setBgColor("bg-alarm-red");
    } else {
      setBgColor("bg-alarm-green");
    }
  }, [weight]);

  useEffect(() => {
    if (isEnable) {
      startMonitoring(Services.weight, WeightChar.weight, "weight123");
    } else {
      stopMonitoring("weight123");
    }
  }, [isEnable]);

  useEffect(() => {
    getMaxAlarm();
    getMinAlarm();
  }, []);

  return (
    <SafeAreaView
      className={`h-full w-full p-6 transition-colors duration-150 ${
        bgColor ? bgColor : ""
      }`}
    >
      <View className="mt-10 flex flex-row items-center justify-between">
        <TouchableOpacity onPress={handlePress} className="mb-5">
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex flex-row gap-x-4">
          <TouchableOpacity onPress={() => setIsReport(true)} className="mb-5">
            <ReportSVG active={true} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsVisible(true)} className="mb-5">
            <SettingSVG />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text className="mb-5 text-5xl">Alarm</Text>
      </View>
      <ScrollView>
        <View className="bg-alarm-overlay z-0 rounded-2xl">
          <View className="z-10 flex items-center justify-center pt-5">
            <Meter
              value={Number(weight)}
              units="kg"
              isEnable={isEnable}
              setIsEnable={setIsEnable}
            />
          </View>
        </View>
        <View className="mt-5 flex flex-row items-center justify-between">
          <View className="bg-alarm-overlay border-primary-mid-gray basis-[48%] rounded-2xl border-[1px] p-5">
            <AntDesign name="downsquare" size={24} color="black" />
            <Text className="mt-2 text-2xl font-semibold">{minAlarm} kg</Text>
            <Text>Min Weight</Text>
          </View>
          <View className="bg-alarm-overlay border-primary-mid-gray basis-[48%] rounded-2xl border-[1px] p-5">
            <AntDesign name="upsquare" size={24} color="black" />
            <Text className="mt-2 text-2xl font-semibold">{maxAlarm} kg</Text>
            <Text>Max Weight</Text>
          </View>
        </View>
        <View className="mb-5 flex flex-row items-center justify-between">
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
        </View>
      </ScrollView>
      <Modal
        onRequestClose={handleClose}
        animationType="fade"
        transparent
        visible={isVisible}
      >
        <SafeAreaView className="bg-primary-black-overlay flex h-full items-center justify-center">
          <View className="h-auto w-80 -translate-x-1/2 rounded-2xl bg-white p-5">
            <TextInput
              className="bg-primary-light-gray my-5 block w-full rounded-2xl px-4 py-2"
              autoCapitalize="none"
              value={item}
              textContentType="username"
              placeholder="Item Name"
              placeholderTextColor="#000"
              onChangeText={(val) => setItem(val)}
            />
            <ValueInput
              text="Minimum Value"
              value={min}
              setValue={setMin}
              placeHolder="Minimum Value"
              margin="mb-2"
            />
            <ValueInput
              text="Maximum Value"
              value={max}
              setValue={setMax}
              placeHolder="Maximum Value"
              margin="mb-4"
            />
            <View className="mt-4 flex flex-row items-center justify-center gap-x-4">
              <TouchableOpacity
                onPress={handleSave}
                className="mb-5 basis-[45%] rounded-2xl bg-black py-4"
              >
                <Text className="text-center text-white">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleClose}
                className="bg-alarm-red mb-5 basis-[45%] rounded-2xl py-4"
              >
                <Text className="text-center text-white">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <AlarmReportTable
        handleClose={() => setIsReport(false)}
        isVisible={isReport}
        setIsVisible={setIsReport}
      />
    </SafeAreaView>
  );
};

export default Weight;
