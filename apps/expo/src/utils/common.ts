import { Linking, ToastAndroid } from "react-native";
import * as XLSX from "xlsx";

export const hexToString = (hexData: string) => {
  let stringData = "";
  for (let i = 0; i < hexData.length; i += 2) {
    const byte = parseInt(hexData.substr(i, 2), 16);
    stringData += String.fromCharCode(byte);
  }
  return stringData;
};

export const openInBrowser = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch (error) {
    ToastAndroid.show("Error opening URL", ToastAndroid.SHORT);
  }
};

export const getValues = (data: any, saved: string) => {
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // Get the current date
  const currentDate = new Date();

  // Create an array to store the dates
  const dates: any[] = [];
  const labels: string[] = [];
  const values: number[] = [];

  // Loop to get the dates of the current and previous seven days
  for (let i = 0; i < 8; i++) {
    // Get the date for the current iteration
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);

    // Add the date to the array
    dates.push(date);
  }

  // Print the dates
  for (let j = dates.length - 1; j > 0; --j) {
    if (dates.length > 0 && dates[j]) {
      const index = dates[j].getDay();
      if (weekdayNames[index]) {
        labels.push(weekdayNames[index]);
      }
      const temp = data?.filter((item) => {
        if (item.generatedFor.getUTCDate() === dates[j].getUTCDate()) {
          return item?.[saved];
        }
      });
      values.push(Number(temp[0]?.[saved]?.toFixed(3)) || 0);
    }
  }

  return { labels, values };
};

export const convertJSONToXLSX = (data: any) => {
  console.log("🚀 ~ file: common.ts:61 ~ convertJSONToXLSX ~ data:", data);
  const workbook = XLSX.utils.book_new();

  for (const tableName in data) {
    if (Array.isArray(data[tableName])) {
      const sheetName = tableName;
      const sheetData = data[tableName];

      if (sheetData && sheetData.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(sheetData);

        const headers = Object.keys(sheetData[0]);
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

        // Convert createdAt values
        for (let i = 0; i < sheetData.length; i++) {
          const createdAt = sheetData[i].createdAt;
          if (createdAt) {
            sheetData[i].createdAt = new Date(createdAt).toLocaleString();
          }
        }

        // add the new data to sheets
        XLSX.utils.sheet_add_json(worksheet, sheetData, {
          skipHeader: true,
          origin: "A2",
        });

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }
    }
  }
  const base64 = XLSX.write(workbook, { type: "base64" });
  return base64;
};
