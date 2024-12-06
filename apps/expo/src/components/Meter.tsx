import type { Dispatch, SetStateAction } from "react";
import React from "react";
import { Text as NativeText, View } from "react-native";
import Speedometer, {
  Arc,
  Background,
  Marks,
  Needle,
  Progress,
} from "react-native-cool-speedometer";
import { G, Line, Text } from "react-native-svg";
import { Switch } from "react-native-switch";

import useBleStore from "../store/createDeviceConnectedSlice";

interface MeterProps {
  value: number;
  fontColor?: string;
  units: string;
  isEnable: boolean;
  setIsEnable: Dispatch<SetStateAction<boolean>>;
}

const Meter = ({ value, units, isEnable, setIsEnable }: MeterProps) => {
  const { maxWeight } = useBleStore();
  return (
    <View className="flex items-center justify-center pt-10">
      <Speedometer value={value} max={Number(maxWeight)} width={300}>
        <Needle
          color="black"
          strokeLinejoin="round"
          offset={50}
          baseWidth={20}
          baseOffset={-50}
          circleRadius={80}
          circleColor="white"
        />
        <Marks
          step={Number(maxWeight) / 20}
          lineSize={10}
          lineColor="black"
          lineCap="butt"
        >
          {(mark, i) => (
            <G key={i}>
              {mark.isEven && (
                <Text
                  {...mark.textProps}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={16}
                  opacity={0.6}
                  fill="black"
                >
                  {mark.value}
                </Text>
              )}
              <Line {...mark.coordinates} stroke="black" strokeOpacity={0.8} />
            </G>
          )}
        </Marks>
      </Speedometer>
      <Switch
        value={isEnable}
        activeText="Stop"
        inActiveText="Start"
        backgroundActive="#E2B589"
        backgroundInactive="#ffffff"
        circleBorderWidth={1}
        circleBorderActiveColor="black"
        circleBorderInactiveColor="black"
        circleActiveColor="black"
        circleInActiveColor="black"
        barHeight={40}
        switchWidthMultiplier={3.6}
        containerStyle={{ marginBottom: 20, marginTop: -30 }}
        inactiveTextStyle={{ fontSize: 18, fontWeight: "600", color: "black" }}
        activeTextStyle={{ fontSize: 18, fontWeight: "600", color: "black" }}
        onValueChange={() => setIsEnable(!isEnable)}
      />
      <View className="absolute flex flex-1 items-center justify-center">
        <NativeText className="text-2xl font-bold">{value}</NativeText>
        <NativeText className="text-2xl font-bold">{units}</NativeText>
      </View>
    </View>
  );
};

export default Meter;
