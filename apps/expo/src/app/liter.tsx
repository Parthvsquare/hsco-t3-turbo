import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Modal, Surface, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import LiterReportTable from "../components/LiterReportTable";
import Meter from "../components/Meter";
import StyledButton from "../components/StyledButton";
import useBleStore from "../store/createDeviceConnectedSlice";
import { ReportSVG, SaveSVG, SettingSVG } from "../SVG";
import { LiterChar, Services } from "../types/constants";
import { api } from "../utils/api";
import { openInBrowser } from "../utils/common";

const Liter = () => {
  const {
    weight,
    setCommand,
    startMonitoring,
    getCurrentMode,
    stopMonitoring,
    getDensity,
    setLiterDensity,
    density,
  } = useBleStore();
  const [isEnable, setIsEnable] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  const [setting, setSetting] = useState(false);
  const [den, setDen] = useState("");
  const utils = api.useUtils();
  const router = useRouter();

  const handleClose = () => {
    setIsVisible(false);
  };

  const handlePress = () => {
    router.back();
  };

  const mutate = api.liter.saveLiter.useMutation({
    onSuccess() {
      ToastAndroid.show("Data saved successfully!", ToastAndroid.SHORT);
      utils.liter.getAllSavedLiter.invalidate();
    },
    onError() {
      ToastAndroid.show("Request sent failed!", ToastAndroid.SHORT);
    },
  });

  const save = () => {
    mutate.mutate({ liter: Number(weight) });
  };

  const tare = () => {
    setCommand("T");
    getCurrentMode();
  };

  const handleDensitySave = () => {
    setLiterDensity(den);
    setSetting(false);
  };

  const handleDensityClose = () => {
    setDen(density);
    setSetting(false);
  };

  useEffect(() => {
    if (isEnable) {
      startMonitoring(Services.liter, LiterChar.volume, "liter123");
    } else {
      stopMonitoring("liter123");
    }
  }, [isEnable]);

  useEffect(() => {
    getDensity();
  }, []);

  useEffect(() => {
    setDen(density);
  }, []);

  return (
    <SafeAreaView className="h-full w-full bg-white p-6">
      <View className="mt-10 flex flex-row items-center justify-between">
        <TouchableOpacity onPress={handlePress} className="mb-5">
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex flex-row gap-x-4">
          <TouchableOpacity
            onPress={() => openInBrowser("https://www.google.com/")}
            className="mb-5"
          >
            <AntDesign name="questioncircleo" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsVisible(true)} className="mb-5">
            <ReportSVG active={true} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSetting(true)} className="mb-5">
            <SettingSVG />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text className="mb-8 text-5xl">Liter</Text>
      </View>
      <ScrollView>
        <Surface className="bg-primary-light-gray rounded-2xl">
          <Meter
            value={Number(weight)}
            units="L"
            isEnable={isEnable}
            setIsEnable={setIsEnable}
          />
        </Surface>
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
        visible={setting}
        onDismiss={() => setSetting(false)}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        contentContainerStyle={{
          backgroundColor: "white",
          width: "80%",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <Text className="mb-2 text-xl">Enter the density of the Liquid</Text>
        <TextInput
          mode="flat"
          label="Density"
          autoCapitalize="none"
          value={den}
          inputMode="numeric"
          className="bg-primary-light-gray"
          onChangeText={(val) => setDen(val)}
        />
        <View className="mt-5 flex flex-row items-center justify-center gap-x-5">
          <Button
            className="basis-[45%]"
            mode="elevated"
            buttonColor="#E5E5E5"
            textColor="black"
            contentStyle={{ paddingVertical: 4 }}
            onPress={handleDensitySave}
          >
            Save
          </Button>
          <Button
            className="basis-[45%]"
            mode="elevated"
            buttonColor="#EB5757"
            textColor="black"
            contentStyle={{ paddingVertical: 4 }}
            onPress={handleDensityClose}
          >
            Cancel
          </Button>
        </View>
      </Modal>
      <LiterReportTable
        handleClose={handleClose}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </SafeAreaView>
  );
};

export default Liter;
