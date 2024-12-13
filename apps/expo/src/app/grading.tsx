import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import GradingReport from "~/components/GradingReportTable";
import Meter from "../components/Meter";
import StyledButton from "../components/StyledButton";
import useBleStore from "../store/createDeviceConnectedSlice";
import { ReportSVG, SaveSVG } from "../SVG";
import { Services, WeightChar } from "../types/constants";
import { api } from "../utils/api";

export interface GradeSystemTemplate {
  gradeId: string;
  itemName: string;
  gradeName: string;
  gradeUpperLimit: string;
  gradeLowerLimit: string;
  makePublic: boolean;
  userId: string;
}

const Grading = () => {
  const {
    weight,
    initialWeight,
    gradingTable,
    templateName,
    startMonitoring,
    stopMonitoring,
    setCommand,
    sendGrade,
  } = useBleStore();

  const [isEnable, setIsEnable] = useState<boolean>(false);
  const [grade, setGrade] = useState<string>("");
  const [lowerLimit, setLowerLimit] = useState("0");
  const [upperLimit, setUpperLimit] = useState("0");
  const [activeIndex, setActiveIndex] = useState(0);
  const [report, setReport] = useState(false);
  const [prev, setPrev] = useState("0");
  const utils = api.useUtils();
  const router = useRouter();

  const mutate = api.grade.saveGrade.useMutation({
    onSuccess() {
      ToastAndroid.show("Data saved successfully!", ToastAndroid.SHORT);
      utils.grade.getAllGrades.invalidate();
    },
    onError() {
      ToastAndroid.show("Request sent failed!", ToastAndroid.SHORT);
    },
  });

  const save = () => {
    mutate.mutate({
      itemName: templateName,
      gradedItemWeight: Number(weight),
      gradeName: grade,
      gradeUpperLimit: Number(upperLimit),
      gradeLowerLimit: Number(lowerLimit),
    });
  };

  const handlePress = () => {
    initialWeight();
    router.back();
  };

  const tare = () => {
    setCommand("T");
  };

  useEffect(() => {
    setPrev(weight);
    gradingTable.forEach((item, index) => {
      if (
        Number(item.gradeLowerLimit) <= Number(weight) &&
        Number(weight) <= Number(item.gradeUpperLimit) &&
        Math.abs(Number(weight) - Number(prev)) < 0.01
      ) {
        item.gradeName && setGrade(item.gradeName);
        item.gradeLowerLimit && setLowerLimit(item.gradeLowerLimit);
        item.gradeUpperLimit && setUpperLimit(item.gradeUpperLimit);
        sendGrade(item.gradeName || "NA");
        setActiveIndex(index);
      }
    });
  }, [weight]);

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
        <View className="flex flex-row gap-x-4">
          <TouchableOpacity onPress={() => setReport(true)} className="mb-5">
            <ReportSVG active={true} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className="h-full w-full">
        <Text className="w-3/4 text-5xl">Grading</Text>
        <Text className="mb-2 text-xl">Template Name: {templateName}</Text>
        <View className="rounded-2xl bg-primary-light-gray">
          <Meter
            value={Number(weight)}
            units="kg"
            isEnable={isEnable}
            setIsEnable={setIsEnable}
          />
        </View>
        <Text className="mx-auto my-4 text-4xl">Grade: {grade}</Text>
        <View className="flex flex-row items-center justify-between">
          <View className="basis-[48%] rounded-2xl border-[1px] border-primary-mid-gray bg-alarm-overlay p-5">
            <AntDesign name="downsquare" size={24} color="black" />
            <Text className="mt-2 text-xl font-semibold">
              Previous - {gradingTable[activeIndex - 1]?.gradeName}
            </Text>
            <Text>
              {gradingTable[activeIndex - 1]?.gradeLowerLimit} -{" "}
              {gradingTable[activeIndex - 1]?.gradeUpperLimit} kg
            </Text>
          </View>
          <View className="basis-[48%] rounded-2xl border-[1px] border-primary-mid-gray bg-alarm-overlay p-5">
            <AntDesign name="upsquare" size={24} color="black" />
            <Text className="mt-2 text-xl font-semibold">
              Next - {gradingTable[activeIndex + 1]?.gradeName}
            </Text>
            <Text>
              {gradingTable[activeIndex + 1]?.gradeLowerLimit} -{" "}
              {gradingTable[activeIndex + 1]?.gradeUpperLimit} kg
            </Text>
          </View>
        </View>
        <View className="mb-5 mt-5 flex flex-row items-center justify-between">
          <StyledButton
            text="Save"
            customStyle="bg-primary-light-gray w-[48%]"
            svg={<SaveSVG />}
            handlePress={save}
          />
          <StyledButton
            handlePress={tare}
            customStyle="w-[48%] bg-primary-yellow"
            text="Tare"
            svg={<Text className="text-2xl text-white">T</Text>}
          />
        </View>
      </ScrollView>
      <GradingReport isVisible={report} setIsVisible={setReport} />
    </SafeAreaView>
  );
};

export default Grading;
