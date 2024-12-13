import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Modal,
  Surface,
  TextInput,
  useTheme,
} from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

import useBleStore from "../store/createDeviceConnectedSlice";
import { api } from "../utils/api";
import { useRouter } from "expo-router";

export interface GradeSystemTemplate {
  gradeId: string;
  itemName: string;
  gradeName: string;
  gradeUpperLimit: string;
  gradeLowerLimit: string;
  makePublic: boolean;
  userId: string;
}

interface TableProps {
  data: GradeSystemTemplate[];
  setData: Dispatch<SetStateAction<GradeSystemTemplate[]>>;
  setTemplate: Dispatch<SetStateAction<string>>;
  templateName: string;
}

interface ItemProps {
  item: GradeSystemTemplate;
  onChangeText: (id: number, field: string, value: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
  nextId: number;
}

const Item = ({
  item,
  onChangeText,
  onSave,
  onDelete,
  gradesArray,
  index,
}: any) => {
  const theme = useTheme();

  return (
    <Surface
      mode="flat"
      className="mb-5 flex flex-row justify-between bg-primary-light-gray"
      style={{
        backgroundColor: "#E5E5E5",
        padding: 20,
        borderRadius: 16,
      }}
    >
      <View className="flex basis-[30%] flex-row">
        <View className="w-full">
          <TextInput
            mode="outlined"
            label="Start"
            className="bg-primary-white mb-2 text-left text-base"
            style={{ height: 30}}
            value={item.gradeLowerLimit}
            placeholder="Grade Start"
            disabled
          />
          <TextInput
            mode="outlined"
            label="End"
            className="bg-primary-white text-left text-base"
            style={{ height: 30 }}
            value={item.gradeUpperLimit}
            enablesReturnKeyAutomatically
            keyboardType="phone-pad"
            selectTextOnFocus
            theme={{
              colors: {
                primary: theme.colors.onBackground,
                background: theme.colors.onPrimary,
              },
            }}
            onChangeText={(val) => onChangeText(index, "gradeUpperLimit", val)}
          />
        </View>
      </View>
      <View className="basis-[30%]">
        <TextInput
          mode="outlined"
          className="w-full text-center text-xl"
          style={{ height: 75, paddingHorizontal: 10 }}
          value={item.gradeName}
          label="Grade"
          textContentType="username"
          enablesReturnKeyAutomatically
          autoCapitalize="characters"
          maxLength={2}
          theme={{
            colors: {
              primary: theme.colors.onBackground,
              background: theme.colors.onPrimary,
            },
          }}
          onChangeText={(val) => onChangeText(index, "gradeName", val)}
        />
      </View>
      <View className="flex basis-[30%] justify-between gap-y-2">
        <Button
          className="rounded-lg"
          buttonColor="black"
          textColor="white"
          mode="elevated"
          onPress={() =>
            onSave(
              index,
              item.gradeLowerLimit,
              item.gradeUpperLimit,
              item.gradeName,
            )
          }
        >
          {gradesArray.find((arr: string) => arr === item.gradeUpperLimit)
            ? "Edit"
            : "Save"}
        </Button>
        <Button
          className="rounded-lg"
          mode="elevated"
          buttonColor="#EB5757"
          textColor="white"
          onPress={() => onDelete(index)}
          disabled={index === 0}
        >
          Delete
        </Button>
      </View>
    </Surface>
  );
};

const GradingCreate = ({ isVisible, setIsVisible }: any) => {
  const initial = {
    gradeName: "",
    gradeLowerLimit: "0",
    gradeUpperLimit: "",
  };

  const { setGradingTable, setTemplateName } = useBleStore();

  const [data, setData] = useState<Partial<GradeSystemTemplate>[]>([initial]);
  const [gradesArray, setGradesArray] = useState(["0"]);
  const [name, setName] = useState<string>("");
  const utils = api.useUtils();
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const defaultTemplate = {
    gradeName: "",
    gradeLowerLimit: gradesArray.at(-1)?.toString(),
    gradeUpperLimit: "",
  };

  const { mutate } = api.gradeTemplate.saveGradeTemplate.useMutation({
    onSuccess() {
      ToastAndroid.show("Data saved successfully!", ToastAndroid.SHORT);
      utils.gradeTemplate.getAllMyGradesTemplate.invalidate();
    },
    onError() {
      ToastAndroid.show("Request sent failed!", ToastAndroid.SHORT);
      setLoading(false);
    },
  });

  const onEdit = (
    index: number,
    gradeLowerLimit: string,
    gradeUpperLimit: string,
    gradeName: string,
  ) => {
    if (Number(gradeUpperLimit) < Number(gradeLowerLimit)) {
      ToastAndroid.showWithGravity(
        "Upper limit should be higher than Lower limit",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } else if (!gradeName) {
      ToastAndroid.showWithGravity(
        "Please enter Grade Name",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } else {
      const gradesArrayClone = gradesArray;
      gradesArrayClone[index] = gradeLowerLimit;
      gradesArrayClone[index + 1] = gradeUpperLimit;

      setGradesArray(gradesArrayClone);

      const newArray = data.map((record, recordIndex) => {
        if (recordIndex === index) {
          return {
            ...record,
            gradeName: gradeName,
            gradeLowerLimit: gradesArrayClone[recordIndex],
            gradeUpperLimit: gradesArrayClone[recordIndex + 1],
          };
        } else {
          return {
            ...record,
            gradeLowerLimit: gradesArrayClone[recordIndex],
            gradeUpperLimit: gradesArrayClone[recordIndex + 1],
          };
        }
      });
      setData(newArray);
    }
  };

  const addDefaultTemplate = () => {
    setData((prevArray) => [...prevArray, defaultTemplate]);
  };

  const handleCellChange = (id: number, field: string, value: string) => {
    setData((prevData) =>
      prevData.map((item, index) => {
        if (index === id) {
          return { ...item, [field]: value };
        }
        return item;
      }),
    );
  };

  const removeTemplate = (index: number) => {
    const gradesArrayClone = gradesArray;
    gradesArrayClone.splice(index, 1);
    setGradesArray(gradesArrayClone);

    const gradeTemplateArrayClone: Partial<GradeSystemTemplate>[] = data;
    const filteredGradeTemplateArrayClone = gradeTemplateArrayClone.filter(
      (_, i) => i !== index,
    );

    const newGradeTemplateArrayClone = filteredGradeTemplateArrayClone.map(
      (record, recordIndex) => {
        return {
          gradeName: record.gradeName,
          gradeLowerLimit: gradesArrayClone[recordIndex - 1],
          gradeUpperLimit: gradesArrayClone[recordIndex],
        };
      },
    );

    setData(newGradeTemplateArrayClone);
  };

  const handleSaveTemp = () => {
    if (!name) {
      ToastAndroid.showWithGravity(
        "Please Enter Template Name",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } else {
      setGradingTable(data);
      setTemplateName(name);
      setLoading(true);
      callApi(data);
    }
  };

  async function callApi(data: Partial<GradeSystemTemplate>[]) {
    const gradeMutations = data.map(async (item) => {
      return mutate({
        itemName: name,
        gradeName: item.gradeName!,
        gradeLowerLimit: +item.gradeLowerLimit!,
        gradeUpperLimit: +item.gradeUpperLimit!,
      });
    });

    await Promise.all(gradeMutations).then(() => {
      setLoading(false);
      router.navigate("/grading");
    });
  }

  return (
    <Modal onDismiss={() => setIsVisible(false)} visible={isVisible}>
      <SafeAreaView className="flex h-full w-full bg-white p-5">
        {isLoading ? (
          <View className="absolute left-1/2 top-1/2 -translate-y-1/2">
            <ActivityIndicator animating={true} size="large" color="black" />
          </View>
        ) : (
          <>
            <View className="flex flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                className="mb-4"
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
              <Button
                onPress={handleSaveTemp}
                buttonColor="black"
                textColor="white"
                mode="elevated"
              >
                Save Template
              </Button>
            </View>
            <Text className="text-5xl">Create Grading Templates</Text>
            <TextInput
              className="m-5"
              style={{ marginVertical: 20 }}
              autoCapitalize="none"
              value={name}
              textContentType="username"
              label="Template Name"
              onChangeText={(val) => setName(val)}
            />
            <ScrollView className="relative flex flex-1">
              {data.map((item, index) => (
                <Item
                  item={item}
                  index={index}
                  onSave={onEdit}
                  onChangeText={handleCellChange}
                  onDelete={removeTemplate}
                  gradesArray={gradesArray}
                />
              ))}
            </ScrollView>
            <IconButton
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
              }}
              icon="plus-circle"
              size={60}
              iconColor="black"
              onPress={addDefaultTemplate}
            />
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default GradingCreate;
