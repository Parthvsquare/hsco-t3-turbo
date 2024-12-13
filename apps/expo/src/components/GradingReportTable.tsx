import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  DataTable,
  Dialog,
  IconButton,
  Menu,
  Modal,
} from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";

import { api } from "../utils/api";

const GradingReport = ({ isVisible, setIsVisible }: any) => {
  const numberOfItemsPerPage = 10;
  const [id, setId] = useState("");
  const [download, setDownload] = useState("");
  const [dialog, setDialog] = useState(false);
  const [page, setPage] = useState(0);
  const utils = api.useUtils();

  const { data: getReport } = api.grade.getAllGrades.useQuery({
    pageLength: numberOfItemsPerPage,
    page: page + 1,
  });
  const totalPages = Math.ceil(
    (getReport?.totalCount ?? 10) / numberOfItemsPerPage,
  );

  const { mutate } = api.grade.deleteSavedGrades.useMutation({
    onSuccess() {
      ToastAndroid.show("Data delete successfully!", ToastAndroid.SHORT);
      utils.grade.getAllGrades.invalidate();
    },
    onError() {
      ToastAndroid.show("Request sent failed!", ToastAndroid.SHORT);
    },
  });

  const deleteSaved = () => {
    mutate({ gradeId: id });
    setDialog(false);
    setId("");
  };

  const hideDialog = () => {
    setDialog(false);
    setId("");
  };

  const close = () => {
    setId("");
  };

  const openMenu = (id: string) => {
    setId(id);
  };

  return (
    <Modal visible={isVisible} onDismiss={() => setIsVisible(false)}>
      <SafeAreaView className="h-full w-full bg-white p-6">
        <View className="flex flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => setIsVisible(false)}
            className="mb-4"
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text className="mb-5 text-5xl">Grading Report</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title
              textStyle={{ fontSize: 20, fontWeight: "700", color: "black" }}
              style={{ flex: 0.3 }}
            >
              Template
            </DataTable.Title>
            <DataTable.Title
              textStyle={{ fontSize: 20, fontWeight: "700", color: "black" }}
              style={{ flex: 0.2 }}
            >
              Grade
            </DataTable.Title>
            <DataTable.Title
              textStyle={{ fontSize: 20, fontWeight: "700", color: "black" }}
              style={{ flex: 0.3 }}
            >
              Date
            </DataTable.Title>
          </DataTable.Header>
          {getReport?.data.map((item) => (
            <DataTable.Row key={item.gradeId}>
              <DataTable.Cell
                textStyle={{ fontSize: 16 }}
                style={{ flex: 0.3 }}
              >
                {item.itemName}
              </DataTable.Cell>
              <DataTable.Cell
                textStyle={{ fontSize: 16 }}
                style={{ flex: 0.2 }}
              >
                {item.gradeName}
              </DataTable.Cell>
              <DataTable.Cell
                textStyle={{ fontSize: 16 }}
                style={{ flex: 0.3 }}
              >
                {item.createdAt.toLocaleDateString()}
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 0.2, justifyContent: "flex-end" }}>
                <Menu
                  visible={id === item.gradeId && !dialog}
                  onDismiss={close}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      onPress={() => openMenu(item.gradeId)}
                    />
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      setId(item.gradeId);
                      setDialog(true);
                    }}
                    title="Delete"
                  />
                </Menu>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
          <DataTable.Pagination
            page={page}
            numberOfPages={totalPages}
            onPageChange={(page) => setPage(page)}
            label={`${page + 1} / ${totalPages}`}
            numberOfItemsPerPage={numberOfItemsPerPage}
          />
        </DataTable>
        <Dialog
          style={{
            backgroundColor: "white",
          }}
          visible={dialog}
          onDismiss={hideDialog}
        >
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this Report?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>No</Button>
            <Button onPress={deleteSaved}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </SafeAreaView>
    </Modal>
  );
};

export default GradingReport;
