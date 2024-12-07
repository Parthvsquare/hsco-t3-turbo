import React, { useState } from "react";
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
  IconButton,
  Menu,
} from "react-native-paper";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

import PieceCreate from "../components/PieceCreate";
import PieceReportTable from "../components/PieceReportTable";
import useBleStore from "../store/createDeviceConnectedSlice";
import { ReportSVG } from "../SVG";
import { api } from "../utils/api";

const Piece = () => {
  const { initialWeight, setUnitWeight, setPieceTemplate } = useBleStore();
  const numberOfItemsPerPage = 10;
  const [id, setId] = useState("");
  const [page, setPage] = useState(0);
  const [isCreate, setIsCreate] = useState(false);
  const [report, setReport] = useState(false);
  const utils = api.useUtils();
  const [dialog, setDialog] = useState(false);
  const router = useRouter();

  const { data, isLoading } =
    api.pieceCounting.getAllMyPieceCountTemplate.useQuery({
      pageLength: numberOfItemsPerPage,
      page: page + 1,
    });

  const deleteTemplate =
    api.pieceCounting.deleteMyPieceCountTemplate.useMutation({
      onSuccess() {
        ToastAndroid.show("Template deleted successfully!", ToastAndroid.SHORT);
        utils.pieceCounting.getAllMyPieceCountTemplate.invalidate();
      },
      onError() {
        ToastAndroid.show("Error could not delete!", ToastAndroid.SHORT);
      },
    });

  const totalPages = Math.ceil((data?.totalCount ?? 10) / numberOfItemsPerPage);

  const close = () => {
    setId("");
  };

  const openMenu = (value: string) => {
    setId(value);
  };

  const deleteSaved = () => {
    deleteTemplate.mutate({ pieceId: id });
    setDialog(false);
    setId("");
  };

  const handlePress = () => {
    initialWeight();
    router.back();
  };

  const handleSelect = (name: string, unit: number) => {
    setPieceTemplate(name);
    setUnitWeight(unit.toString());
    router.navigate("count");
    setId("");
  };

  const hideDialog = () => {
    setDialog(false);
    setId("");
  };

  return (
    <SafeAreaView className="flex h-full w-full bg-white p-5">
      <View className="mt-10 flex flex-row items-center justify-between">
        <TouchableOpacity onPress={handlePress} className="mb-4">
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex flex-row gap-x-4">
          <TouchableOpacity onPress={() => setReport(true)} className="mb-5">
            <ReportSVG active={true} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsCreate(true);
            }}
          >
            <Ionicons name="create-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Text className="mb-5 text-5xl">Select Piece Counting Template</Text>
      {data?.totalCount === 0 ? (
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
              style={{ flex: 0.5 }}
            >
              Template
            </DataTable.Title>
            <DataTable.Title
              textStyle={{ fontSize: 20, fontWeight: "700", color: "black" }}
              style={{ flex: 0.3 }}
            >
              Unit weight
            </DataTable.Title>
          </DataTable.Header>
          {isLoading ? (
            <View className="py-10">
              <ActivityIndicator animating={true} color="black" />
            </View>
          ) : (
            data?.data?.map((item) => (
              <DataTable.Row
                onPress={() =>
                  handleSelect(item.itemName, item.singlePieceWeight)
                }
                key={item.pieceId}
              >
                <DataTable.Cell
                  textStyle={{ fontSize: 16 }}
                  style={{ flex: 0.5 }}
                >
                  {item.itemName}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{ fontSize: 16 }}
                  style={{ flex: 0.3 }}
                >
                  {item.singlePieceWeight}
                </DataTable.Cell>
                <DataTable.Cell
                  style={{ flex: 0.2, justifyContent: "flex-end" }}
                >
                  <Menu
                    visible={id === item.pieceId && !dialog}
                    onDismiss={close}
                    anchor={
                      <IconButton
                        icon="dots-vertical"
                        onPress={() => openMenu(item.pieceId)}
                      />
                    }
                  >
                    <Menu.Item
                      onPress={() =>
                        handleSelect(item.itemName, item.singlePieceWeight)
                      }
                      title="Select"
                    />
                    <Menu.Item
                      onPress={() => {
                        setDialog(true);
                      }}
                      title="Delete"
                    />
                  </Menu>
                </DataTable.Cell>
              </DataTable.Row>
            ))
          )}
          <DataTable.Pagination
            page={page}
            numberOfPages={totalPages}
            onPageChange={(page) => setPage(page)}
            label={`${page + 1} / ${totalPages}`}
            numberOfItemsPerPage={numberOfItemsPerPage}
          />
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
          <Button onPress={deleteSaved}>Yes</Button>
        </Dialog.Actions>
      </Dialog>
      <PieceCreate isVisible={isCreate} setIsVisible={setIsCreate} />
      <PieceReportTable isVisible={report} setIsVisible={setReport} />
    </SafeAreaView>
  );
};

export default Piece;
