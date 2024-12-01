import type { BleError, Characteristic, Device } from "react-native-ble-plx";
import { ToastAndroid } from "react-native";
import base64 from "react-native-base64";
import { BleManager } from "react-native-ble-plx";
import { create } from "zustand";

import type { GradeSystemTemplate } from "../types/constants";
import {
  AlarmChar,
  GradeChar,
  LiterChar,
  PieceChar,
  Services,
  WeightChar,
} from "../types/constants";
import { hexToString } from "../utils/common";

interface BleState {
  devices: Device[];
  serviceUUIDs: string[];
  isScanning: boolean;
  device?: Device;
  weight: string;
  isConnected: boolean | Promise<boolean>;
  activeChar: Characteristic | null;
  minAlarm: string;
  maxAlarm: string;
  maxWeight: string;
  currentMode: string;
  liter: string;
  density: string;
  pieceTemplate: string;
  unitWeight: string;
  noPieces: string;
  gradingTable: Partial<GradeSystemTemplate>[];
  templateName: string;
  startScan: () => void;
  stopScan: () => void;
  connectToDevice: (deviceId: string) => Promise<void>;
  getWeight: () => void;
  disconnectDevice: () => void;
  initialWeight: () => void;
  getMinAlarm: () => void;
  setMinAlarm: (data: string) => void;
  getMaxAlarm: () => void;
  setMaxAlarm: (data: string) => void;
  getMaxWeight: () => void;
  getCurrentMode: () => void;
  setCurrentMode: (mode: string) => void;
  setCommand: (value: string) => void;
  setLiter: () => void;
  setPieceTemplate: (data: string) => void;
  setNoPieces: (ID: string) => void;
  setUnitWeight: (value: string) => void;
  startMonitoring: (serviceID: string, charID: string, ID: string) => void;
  stopMonitoring: (ID: string) => void;
  setGradingTable: (data: any) => void;
  setTemplateName: (data: string) => void;
  check: () => void;
  setChecked: (value: boolean) => void;
  setLiterDensity: (value: string) => void;
  getDensity: () => void;
  sendGrade: (data: string) => void;
}

const manager = new BleManager();
const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
  devices.findIndex((device) => nextDevice.id === device.id) > -1;

const useBleStore = create<BleState>((set, get) => ({
  devices: [],
  serviceUUIDs: [],
  isScanning: false,
  device: undefined,
  isConnected: false,
  activeChar: null,
  weight: "0",
  minAlarm: "0",
  maxAlarm: "0",
  maxWeight: "100",
  currentMode: "",
  liter: "0",
  density: "0",
  pieceTemplate: "",
  unitWeight: "0",
  noPieces: "0",
  gradingTable: [],
  templateName: "",
  startScan: () => {
    set({ devices: [], isScanning: true });
    const subscription = manager.onStateChange((state) => {
      if (state === "PoweredOn") {
        manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            console.log(error);
            return;
          }
          if (device?.name?.includes("Scale")) {
            set((state) => {
              if (!isDuplicteDevice(state.devices, device)) {
                return [...state.devices, device];
              }
              return state;
            });
          }
        });
        subscription.remove();
      }
    }, true);
  },
  stopScan: () => {
    manager.stopDeviceScan();
    set({ isScanning: false });
  },
  connectToDevice: async (deviceId) => {
    const device = await manager.connectToDevice(deviceId);
    const deviceChars =
      await manager.discoverAllServicesAndCharacteristicsForDevice(deviceId);
    const services = await deviceChars.services();

    const serviceUUIDs = services.map((service) => service.uuid);
    set({ device });
    set({ serviceUUIDs });
    set({ isConnected: true });
    ToastAndroid.show("Device successfully connected", ToastAndroid.SHORT);
  },
  getWeight: async () => {
    const { weight, device } = get();
    if (device?.id) {
      const characteristic = await device.readCharacteristicForService(
        Services.weight,
        WeightChar.weight,
      );
      set({ activeChar: characteristic });
      if (characteristic?.value) {
        const rawData = base64.decode(characteristic?.value);
        if (weight !== rawData) set({ weight: rawData });
      }
    }
  },
  initialWeight: () => {
    set({ weight: "0", noPieces: "0", liter: "0" });
  },
  disconnectDevice: () => {
    const { device } = get();
    if (device) {
      device.cancelConnection();
    }
  },
  getMinAlarm: async () => {
    const { device, minAlarm } = get();
    if (device?.id) {
      const characteristic = await device.readCharacteristicForService(
        Services.alarm,
        AlarmChar.alarmMin,
      );
      if (characteristic?.value) {
        const rawData = base64.decode(characteristic?.value);
        if (minAlarm !== rawData) {
          set({ minAlarm: rawData });
        }
      }
    }
  },
  setMinAlarm: (data: string) => {
    const { device } = get();
    if (device?.id) {
      device
        .writeCharacteristicWithoutResponseForService(
          Services.alarm,
          AlarmChar.alarmMin,
          base64.encode(data),
        )
        .then(() => {
          set({ minAlarm: data });
          console.log("Write successful");
        })
        .catch((error) => {
          console.log("Write failed", error);
        });
    }
  },
  getMaxAlarm: async () => {
    const { device, maxAlarm } = get();
    if (device?.id) {
      const characteristic = await device.readCharacteristicForService(
        Services.alarm,
        AlarmChar.alarmMax,
      );
      if (characteristic?.value) {
        const rawData = base64.decode(characteristic?.value);
        if (maxAlarm !== rawData) {
          set({ maxAlarm: rawData });
        }
      }
    }
  },
  setMaxAlarm: (data: string) => {
    const { device } = get();
    if (device?.id) {
      device
        .writeCharacteristicWithoutResponseForService(
          Services.alarm,
          AlarmChar.alarmMax,
          base64.encode(data),
        )
        .then(() => {
          set({ maxAlarm: data });
          console.log("Write successful");
        })
        .catch((error) => {
          console.log("Write failed", error);
        });
    }
  },
  getMaxWeight: async () => {
    const { maxWeight, device } = get();
    if (device?.id) {
      const characteristic = await device.readCharacteristicForService(
        Services.weight,
        WeightChar.maxWeight,
      );
      if (characteristic?.value) {
        const rawData = base64.decode(characteristic?.value);
        if (maxWeight !== rawData) {
          console.log(rawData);

          set({ maxWeight: rawData });
        }
      }
    }
  },
  getCurrentMode: async () => {
    const { currentMode, device } = get();
    if (device?.id) {
      const characteristic = await device.readCharacteristicForService(
        Services.weight,
        WeightChar.currentMode,
      );
      if (characteristic?.value) {
        const rawData = base64.decode(characteristic?.value);
        if (currentMode !== rawData) {
          console.log(rawData);

          set({ currentMode: rawData });
        }
      }
    }
  },
  setCurrentMode: async (mode: string) => {
    const { device } = get();
    if (device?.id) {
      device
        .writeCharacteristicWithoutResponseForService(
          Services.weight,
          WeightChar.currentMode,
          base64.encode(hexToString(mode)),
        )
        .then(() => {
          set({ currentMode: mode });
          console.log("Write successful");
        })
        .catch((error) => {
          console.log("Write failed", error);
        });
    }
  },
  setCommand: async (value: string) => {
    const { device } = get();
    if (device?.id) {
      device
        .writeCharacteristicWithoutResponseForService(
          Services.weight,
          WeightChar.command,
          base64.encode(value),
        )
        .then(() => {
          console.log("Write successful");
        })
        .catch((error) => {
          console.log("Write failed", error);
        });
    }
  },
  setLiter: async () => {
    const { liter, device } = get();
    if (device?.id) {
      const characteristic = await device.readCharacteristicForService(
        Services.liter,
        LiterChar.volume,
      );
      set({ activeChar: characteristic });
      if (characteristic?.value) {
        const rawData = base64.decode(characteristic?.value);
        if (liter !== rawData) set({ liter: rawData });
      }
    }
  },
  getDensity: async () => {
    const { density, device } = get();
    if (device?.id) {
      const characteristic = await device.readCharacteristicForService(
        Services.liter,
        LiterChar.desity,
      );
      set({ activeChar: characteristic });
      if (characteristic?.value) {
        const rawData = base64.decode(characteristic?.value);
        if (density !== rawData) set({ density: rawData });
      }
    }
  },
  setLiterDensity: async (value: string) => {
    const { device } = get();
    if (device?.id) {
      device
        .writeCharacteristicWithoutResponseForService(
          Services.liter,
          LiterChar.desity,
          base64.encode(value),
        )
        .then(() => {
          set({ density: value });
          ToastAndroid.show("Density set successfully", ToastAndroid.SHORT);
        })
        .catch((error) => {
          console.log("Write failed", error);
        });
    }
  },
  setPieceTemplate: (value: string) => {
    set({ pieceTemplate: value });
  },
  setUnitWeight: async (value: string) => {
    const { device } = get();
    if (device?.id) {
      device
        .writeCharacteristicWithoutResponseForService(
          Services.piece,
          PieceChar.unitPiece,
          base64.encode(value),
        )
        .then(() => {
          set({ unitWeight: value });
          console.log("Write successful - noOfGrade");
          ToastAndroid.show("Unit weight set successfully", ToastAndroid.SHORT);
        })
        .catch((error) => {
          console.log("Write failed", error);
        });
    }
  },
  setNoPieces: async (ID) => {
    const { device, noPieces } = get();
    if (device?.id) {
      device.monitorCharacteristicForService(
        Services.piece,
        PieceChar.noOfPiece,
        (error: BleError | null, characteristic: Characteristic | null) => {
          if (characteristic?.value) {
            const rawData = base64.decode(characteristic?.value);
            if (noPieces !== rawData) set({ noPieces: rawData });
          }
          if (error) {
            console.log("error", error);
          }
        },
        ID,
      );
    }
  },
  startMonitoring: async (serviceID, charID, ID) => {
    const { device, weight } = get();
    if (device?.id) {
      device.monitorCharacteristicForService(
        serviceID,
        charID,
        (error: BleError | null, characteristic: Characteristic | null) => {
          if (characteristic?.value) {
            const rawData = base64.decode(characteristic?.value);
            if (weight !== rawData) set({ weight: rawData });
          }
          if (error) {
            console.log("error", error);
          }
        },
        ID,
      );
    }
  },
  stopMonitoring: async (ID) => {
    const { device } = get();
    if (device?.id) {
      manager.cancelTransaction(ID);
    }
  },
  setGradingTable: (data: any) => {
    set({ gradingTable: data });
  },
  setTemplateName: (data: string) => {
    set({ templateName: data });
  },
  check: async () => {
    const { device } = get();
    if (device) {
      const temp = await manager.isDeviceConnected(device?.id);
      set({ isConnected: temp });
    }
  },
  setChecked: (value) => {
    set({ isConnected: value });
  },
  sendGrade: (data: string) => {
    const { device } = get();
    if (device?.id) {
      device
        .writeCharacteristicWithoutResponseForService(
          Services.grading,
          GradeChar.currentGrade,
          base64.encode(data),
        )
        .then(() => {
          console.log("Write successful");
        })
        .catch((error) => {
          console.log("Write failed", error);
        });
    }
  },
}));

export default useBleStore;
