import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { ActivityIndicator, Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Switch } from "react-native-switch";
import { Image } from "expo-image";

import { useUser } from "~/utils/auth";
import DeviceModal from "../../components/DeviceModal";
import useBLE from "../../hooks/useBLE";
import useBleStore from "../../store/createDeviceConnectedSlice";
import { DeviceSVG } from "../../SVG";
import { api } from "../../utils/api";
import { getValues } from "../../utils/common";

interface ChartType {
  labels: string[];
  datasets: [
    {
      data: number[];
    },
  ];
}

export const HomeScreen = () => {
  const { scanForPeripherals, allDevices } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [weight, setWeight] = useState<ChartType>({});
  const [liter, setLiter] = useState<ChartType>({});
  const {
    device,
    stopScan,
    connectToDevice,
    disconnectDevice,
    check,
    isConnected,
    setChecked,
  } = useBleStore();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  console.log("🚀 ~ HomeScreen ~ user:", user);

  const screenWidth = (Dimensions.get("window").width * 80) / 100;
  // const { data: getReport } = api.averageReport.getAllSavedAverages.useQuery();

  const scanForDevices = async () => {
    scanForPeripherals();
  };

  const hideModal = () => {
    stopScan();
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  // useEffect(() => {
  //   if (getReport?.data) {
  //     const weight = getValues(getReport.data, "savedWeightAverage");
  //     setWeight({
  //       labels: weight.labels,
  //       datasets: [
  //         {
  //           data: weight.values,
  //         },
  //       ],
  //     });

  //     const liter = getValues(getReport.data, "savedLiterAverage");

  //     setLiter({
  //       labels: liter.labels,
  //       datasets: [
  //         {
  //           data: liter.values,
  //         },
  //       ],
  //     });
  //     setIsLoading(false);
  //   }
  // }, [getReport?.data]);

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    backgroundColor: "#fffff",
    stackedBar: true,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.6,
    decimalPlaces: 0,
    barRadius: 8,
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",
    useShadowColorFromDataset: false, // optional
  };

  useEffect(() => {
    check();
  }, [device]);

  return (
    <SafeAreaView className="relative h-full w-full">
      <View className="flex flex-row items-start justify-between bg-white p-6 py-3">
        <View className="h-10 w-10">
          <Image
            className="h-full w-full"
            contentFit="contain"
            source={require("../../assets/icon.png")}
          />
        </View>
        <TouchableOpacity onPress={openModal}>
          <DeviceSVG />
        </TouchableOpacity>

        <DeviceModal
          closeModal={hideModal}
          visible={isModalVisible}
          connectToPeripheral={connectToDevice}
          devices={allDevices}
          connectedDevice={device}
          disconnectDevice={disconnectDevice}
        />
      </View>
      <View className="mt-5 w-full">
        <Text className="px-6 text-5xl">Hello, {user?.firstName}</Text>
        {device ? (
          <Surface
            style={{
              borderRadius: 16,
              backgroundColor: "white",
              overflow: "hidden",
              padding: 16,
              marginHorizontal: 20,
              marginTop: 20,
              marginBottom: 5,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text className="text-2xl">{device?.name}</Text>
              <Text>{device?.id}</Text>
            </View>
            <Switch
              value={isConnected}
              renderActiveText={false}
              renderInActiveText={false}
              backgroundActive="#E2B589"
              backgroundInactive="#ffffff"
              circleBorderWidth={1}
              circleBorderActiveColor="black"
              circleBorderInactiveColor="black"
              circleActiveColor="black"
              circleInActiveColor="black"
              barHeight={30}
              switchWidthMultiplier={2.5}
              containerStyle={{
                paddingVertical: 20,
                borderColor: "#E2B589",
                borderWidth: 1,
              }}
              onValueChange={() => {
                if (isConnected) {
                  disconnectDevice();
                  setChecked(false);
                } else if (!isConnected && device) {
                  connectToDevice(device.id);
                  setChecked(true);
                }
              }}
            />
          </Surface>
        ) : null}
      </View>
      <ScrollView className="h-full w-full bg-gray-100">
        <Surface
          style={{
            borderRadius: 16,
            backgroundColor: "white",
            overflow: "hidden",
            paddingTop: 16,
            marginHorizontal: 20,
            marginVertical: 20,
          }}
        >
          <View className="mb-5 ml-6">
            <Text className="text-lg">Yesterday's Weight</Text>
            <Text className="text-2xl font-semibold">
              {weight.datasets[0].data.length > 1
                ? `${weight.datasets[0].data[6] || 0} kg`
                : "No Data Available"}
            </Text>
            <Text className="mt-5 text-lg">
              Average Weight Statistics for last 7 days
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator className="py-10" color="black" />
          ) : weight.datasets[0].data.length > 1 &&
            weight.datasets[0].data.reduce((total, item) => total + item) >
              0 ? (
            <BarChart
              data={weight}
              width={screenWidth}
              height={250}
              yAxisLabel=""
              yAxisSuffix="kg"
              withInnerLines={false}
              fromZero
              chartConfig={chartConfig}
              showBarTops={false}
            />
          ) : (
            <Text className="pb-20 pt-10 text-center text-xl font-bold">
              No Data Available
            </Text>
          )}
        </Surface>
        <Surface
          style={{
            borderRadius: 16,
            backgroundColor: "white",
            overflow: "hidden",
            paddingTop: 16,
            marginHorizontal: 20,
            marginBottom: 100,
          }}
        >
          <View className="mb-5 ml-6">
            <Text className="text-lg">Yesterday's Liter</Text>
            <Text className="text-2xl font-semibold">
              {liter.datasets[0].data.length > 1
                ? `${liter.datasets[0].data[6] || 0} L`
                : "No Data Available"}
            </Text>
            <Text className="mt-5 text-lg">
              Average Liter Statistics for last 7 days
            </Text>
          </View>
          {liter.datasets[0].data.length > 1 &&
          liter.datasets[0].data.reduce((total, item) => total + item) > 0 ? (
            <BarChart
              data={liter}
              width={screenWidth}
              height={250}
              yAxisLabel=""
              yAxisSuffix="L"
              withInnerLines={false}
              chartConfig={chartConfig}
              fromZero
              showBarTops={false}
            />
          ) : (
            <Text className="pb-20 pt-10 text-center text-xl font-bold">
              No Data Available
            </Text>
          )}
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
};
