import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import ModeBox from "../../components/ModeBox";
import { AlarmSVG, GradingSVG, LiterSVG, PieceSVG, WeightSVG } from "../../SVG";

// import { api } from "../utils/trpc";

const Mode = () => {
  // const { data, isLoading } = api.users.getSubscribedPlans.useQuery();

  return (
    <SafeAreaView className="relative h-full w-full">
      <View className="h-full w-full bg-white p-6">
        <Text className="mt-10 text-5xl">Mode</Text>
        {/* {isLoading ? (
          <ActivityIndicator
            className="my-auto"
            animating={true}
            color="black"
            size="large"
          />
        ) : ( */}
        <ScrollView>
          <View className="flex flex-row flex-wrap pb-10">
            <ModeBox
              screen="weight"
              icon={<WeightSVG />}
              name="Weight"
              margin={20}
              currentMode="00"
              // disabled={data?.filter((i) => i.enabledPlan === "BASIC")}
            />
            <ModeBox
              screen="liter"
              icon={<LiterSVG />}
              name="Liter"
              currentMode="02"
              // disabled={data?.filter((i) => i.enabledPlan === "BASIC")}
            />
            <ModeBox
              screen="alarm"
              icon={<AlarmSVG />}
              name="Alarm"
              margin={20}
              // currentMode="00"
              currentMode="01"
              // disabled={data?.filter((i) => i.enabledPlan === "ALERT")}
            />
            <ModeBox
              screen="piece"
              icon={<PieceSVG />}
              name="Piece Counting"
              // currentMode="02"
              currentMode="03"
              // disabled={data?.filter((i) => i.enabledPlan === "PIECE")}
            />
            <ModeBox
              screen="gtemplate"
              icon={<GradingSVG />}
              name="Grading"
              margin={20}
              currentMode="04"
              // disabled={data?.filter((i) => i.enabledPlan === "GRADING")}
            />
          </View>
        </ScrollView>
        {/* )} */}
      </View>
    </SafeAreaView>
  );
};

export default Mode;
