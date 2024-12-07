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

import Meter from "../components/Meter";
import PieceReportTable from "../components/PieceReportTable";
import StyledButton from "../components/StyledButton";
import useBleStore from "../store/createDeviceConnectedSlice";
import { ReportSVG, SaveSVG } from "../SVG";
import { api } from "../utils/api";

const Count = () => {
  const {
    pieceTemplate,
    stopMonitoring,
    setCommand,
    unitWeight,
    initialWeight,
    noPieces,
    setNoPieces,
  } = useBleStore();
  const [piecesEnable, setPiecesEnable] = useState(false);
  const [report, setReport] = useState(false);
  const utils = api.useUtils();
  const router = useRouter();

  const tare = () => {
    setCommand("T");
  };

  const mutate = api.pieceCounting.savePieceCount.useMutation({
    onSuccess() {
      ToastAndroid.show("Data saved successfully!", ToastAndroid.SHORT);
      utils.pieceCounting.getAllSavedPieceCount.invalidate();
    },
    onError() {
      ToastAndroid.show("Request sent failed!", ToastAndroid.SHORT);
    },
  });

  const save = () => {
    mutate.mutate({
      itemName: pieceTemplate,
      itemsCounted: Number(noPieces),
      singlePieceWeight: Number(unitWeight),
    });
  };

  const handlePress = () => {
    initialWeight();
    router.back();
    setPiecesEnable(false);
    stopMonitoring("Piece123");
  };

  useEffect(() => {
    if (piecesEnable) {
      setNoPieces("Piece123");
    } else {
      stopMonitoring("Piece123");
    }
  }, [piecesEnable]);

  return (
    <SafeAreaView className="h-full w-full bg-white p-6">
      <View className="mt-10 flex flex-row items-center justify-between">
        <TouchableOpacity onPress={handlePress} className="mb-5">
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setReport(true)} className="mb-5">
          <ReportSVG active={true} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Text className="mb-5 text-5xl">Piece Counting</Text>
        <Text className="mb-2 text-xl">Name of Item: {pieceTemplate}</Text>
        <Text className="mb-5 text-xl">Unit Weight: {unitWeight}</Text>
        <View className="bg-primary-light-gray rounded-2xl">
          <Meter
            value={Number(noPieces)}
            units="kg"
            isEnable={piecesEnable}
            setIsEnable={setPiecesEnable}
          />
          <Text className="mb-5 text-center text-4xl">
            No. of Pieces: {noPieces}
          </Text>
        </View>
        <View className="mb-5 mt-10 flex flex-row items-center justify-between">
          <StyledButton
            text="Save"
            customStyle="bg-primary-light-gray w-[48%]"
            svg={<SaveSVG />}
            handlePress={save}
          />
          <StyledButton
            handlePress={tare}
            customStyle="mx-auto w-[48%] bg-primary-yellow"
            text="Tare"
            svg={<Text className="text-2xl text-white">T</Text>}
          />
        </View>
      </ScrollView>
      <PieceReportTable isVisible={report} setIsVisible={setReport} />
    </SafeAreaView>
  );
};

export default Count;
