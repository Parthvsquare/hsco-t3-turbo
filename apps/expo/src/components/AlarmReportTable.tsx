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
  Modal,
} from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";

import { api } from "../utils/api";

const AlarmReportTable = ({
  handleClose,
  isVisible,
  setIsVisible,
}: {
  handleClose: () => void;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const numberOfItemsPerPage = 10;
  const [id, setId] = useState("");
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState(false);
  const utils = api.useUtils();

  const { data, isLoading } = api.alarm.getAllSavedAlarm.useQuery({
    pageLength: numberOfItemsPerPage,
    page: page + 1,
  });

  const mutate = api.alarm.deleteSavedAlarm.useMutation({
    onSuccess() {
      ToastAndroid.show("Data deleted successfully!", ToastAndroid.SHORT);
      utils.alarm.getAllSavedAlarm.invalidate();
    },
    onError() {
      ToastAndroid.show("Request sent failed!", ToastAndroid.SHORT);
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
    mutate.mutate({ alertId: id });
    setDialog(false);
    setId("");
  };

  const hideDialog = () => {
    setDialog(false);
    setId("");
  };

  return (
    <Modal onDismiss={handleClose} visible={isVisible}>
      <SafeAreaView className="flex h-full w-full bg-white p-5">
        <View className="flex flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => setIsVisible(false)}
            className="mb-4"
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text className="mb-5 text-5xl">Alarm Report</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title
              textStyle={{ fontSize: 20, fontWeight: "700", color: "black" }}
              style={{ flex: 0.6 }}
            >
              Weight
            </DataTable.Title>
            <DataTable.Title
              textStyle={{
                fontSize: 20,
                fontWeight: "700",
                color: "black",
                textAlign: "left",
              }}
              style={{ flex: 0.3 }}
            >
              Date
            </DataTable.Title>
          </DataTable.Header>
          {isLoading ? (
            <View className="py-10">
              <ActivityIndicator animating={true} color="black" />
            </View>
          ) : (
            data?.data?.map((item) => (
              <DataTable.Row key={item.alertId}>
                <DataTable.Cell
                  textStyle={{ fontSize: 16 }}
                  style={{ flex: 0.6 }}
                >
                  {item.alertId}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{ fontSize: 16 }}
                  style={{ flex: 0.3 }}
                >
                  {item.createdAt.toLocaleDateString()}
                </DataTable.Cell>
                <DataTable.Cell
                  style={{ flex: 0.2, justifyContent: "flex-end" }}
                >
                  <Menu
                    visible={id === item.alertId && !dialog}
                    onDismiss={close}
                    anchor={
                      <IconButton
                        icon="dots-vertical"
                        onPress={() => openMenu(item.alertId)}
                      />
                    }
                  >
                    <Menu.Item
                      onPress={() => {
                        setId(item?.alertId);
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

export default AlarmReportTable;
