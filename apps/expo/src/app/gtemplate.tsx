import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  DataTable,
  Dialog,
  IconButton, Modal
} from "react-native-paper";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

import GradingCreate from "~/components/GradingCreate";
import GradingReport from "../components/GradingReportTable";
import useBleStore from "../store/createDeviceConnectedSlice";
import { ReportSVG } from "../SVG";
import { api } from "../utils/api";

const Gtemplate = () => {
  const { setGradingTable, setTemplateName, initialWeight } = useBleStore();
  const [selected, setSelected] = useState("");
  const [selectedTemp, setSelectedTemp] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [alert, setAlert] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [report, setReport] = useState(false);
  const [info, setInfo] = useState(false);
  const utils = api.useUtils();
  const getTemplates = api.gradeTemplate.getAllMyGradesTemplate.useQuery();
  const router = useRouter();
  const deleteTemplate = api.gradeTemplate.deleteMyGradeTemplateByName.useMutation({
    onSuccess() {
      ToastAndroid.show("Data delete successfully!", ToastAndroid.SHORT);
      utils.gradeTemplate.getAllMyGradesTemplate.invalidate();
    },
    onError() {
      ToastAndroid.show("Request sent failed!", ToastAndroid.SHORT);
    },
  });

  const { data: getData, isLoading } =
    api.grading.getAllMyGradeByItemsNameTemplate.useQuery(
      { itemName: selected },
      { enabled: !!selected },
    );

  const showInfo = (value: string) => {
    setSelected(value);
    setInfo(true);
  };

  const showDialog = (value: string) => {
    setSelected(value);
    setDialog(true);
  };

  const hideDialog = () => {
    setDialog(false);
    setSelected("");
  };

  const deleteTemp = () => {
    deleteTemplate.mutate({ itemName: selected });
    setDialog(false);
    setSelected("");
    utils.gradeTemplate.getAllMyGradesTemplate.invalidate();
  };

  const handlePress = () => {
    initialWeight();
    router.back();
  };

  useEffect(() => {
    getData && setGradingTable(getData?.data);
    selected && setTemplateName(selected);
    if (getData && selected && selectedTemp) router.navigate("Grading");
  }, [getData, selected, selectedTemp]);

  return (
    <SafeAreaView className="flex h-full w-full bg-white p-5">
      <View className="mb-5 mt-10 flex flex-row items-center justify-between">
        <TouchableOpacity onPress={handlePress}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex flex-row gap-x-4">
          <TouchableOpacity onPress={() => setReport(true)} className="mb-5">
            <ReportSVG active={true} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsCreate(true)}>
            <Ionicons name="create-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Text className="mb-5 text-5xl">Select Grading Templates</Text>
      {getData?.totalCount === 0 ? (
        <View className="flex h-3/5 items-center justify-center">
          <Button
            mode="elevated"
            buttonColor="black"
            textColor="white"
            labelStyle={{
              fontSize: 20,
            }}
            onPress={() => {
              setIsCreate(true);
            }}
          >
            Create Template
          </Button>
          <Text className="mt-5 text-2xl">No Template Created</Text>
        </View>
      ) : (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title
              textStyle={{ fontSize: 20, fontWeight: "700", color: "black" }}
              style={{ flex: 0.7 }}
            >
              Name
            </DataTable.Title>
          </DataTable.Header>
          {getTemplates.isLoading ? (
            <View className="py-10">
              <ActivityIndicator animating={true} color="black" />
            </View>
          ) : (
            getTemplates.data?.data?.map((item) => (
              <DataTable.Row key={item.itemName}>
                <DataTable.Cell
                  onPress={() => {
                    setSelected(item.itemName);
                    setSelectedTemp(true);
                  }}
                  style={{ flex: 0.7 }}
                  textStyle={{ fontSize: 16 }}
                >
                  {item.itemName}
                </DataTable.Cell>
                <DataTable.Cell
                  style={{
                    flex: 0.3,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton
                    icon="information-outline"
                    onPress={() => showInfo(item?.itemName)}
                  />
                  <IconButton
                    icon="delete-outline"
                    iconColor="#EB5757"
                    onPress={() => showDialog(item?.itemName)}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))
          )}
        </DataTable>
      )}
      <Dialog
        style={{
          backgroundColor: "white",
        }}
        visible={dialog}
        onDismiss={hideDialog}
      >
        <Dialog.Title>Alert</Dialog.Title>
        <Dialog.Content>
          <Text>Are you sure you want to delete this Template?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>No</Button>
          <Button onPress={deleteTemp}>Yes</Button>
        </Dialog.Actions>
      </Dialog>
      <Modal visible={info} onDismiss={() => setInfo(false)}>
        <SafeAreaView className="mx-auto w-4/5 rounded-2xl bg-white">
          {isLoading ? (
            <View className="py-10">
              <ActivityIndicator animating={true} color="black" />
            </View>
          ) : (
            <View className="p-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-2xl">{getData?.data?.[0]?.itemName}</Text>
                <TouchableOpacity onPress={() => setInfo(false)}>
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title textStyle={{ fontSize: 20 }}>
                    Start
                  </DataTable.Title>
                  <DataTable.Title textStyle={{ fontSize: 20 }}>
                    End
                  </DataTable.Title>
                  <DataTable.Title textStyle={{ fontSize: 20 }}>
                    Grade
                  </DataTable.Title>
                </DataTable.Header>
                {getData?.data?.map((item) => (
                  <DataTable.Row key={item.gradeId}>
                    <DataTable.Cell>{item.gradeLowerLimit}</DataTable.Cell>
                    <DataTable.Cell>{item.gradeUpperLimit}</DataTable.Cell>
                    <DataTable.Cell>{item.gradeName}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </View>
          )}
        </SafeAreaView>
      </Modal>
      <GradingCreate isVisible={isCreate} setIsVisible={setIsCreate} />
      <GradingReport isVisible={report} setIsVisible={setReport} />
      <Dialog
        style={{
          backgroundColor: "white",
        }}
        visible={alert}
        onDismiss={() => setAlert(false)}
      >
        <Dialog.Title>Alert</Dialog.Title>
        <Dialog.Content>
          <Text>No more than 5 grading can be Created</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setAlert(false)}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  );
};

export default Gtemplate;
