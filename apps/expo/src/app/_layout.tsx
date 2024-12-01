import "@bacons/text-decoder/install";

import { DefaultTheme, PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

import { useUser } from "~/utils/auth";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { user } = useUser();
  console.log("🚀 ~ RootLayout ~ user:", user);
  const theme = {
    ...DefaultTheme,
    colors: {
      primary: "rgb(150, 73, 0)",
      onPrimary: "rgb(255, 255, 255)",
      primaryContainer: "rgb(255, 220, 198)",
      onPrimaryContainer: "rgb(49, 19, 0)",
      secondary: "rgb(117, 88, 70)",
      onSecondary: "rgb(255, 255, 255)",
      secondaryContainer: "rgb(255, 220, 198)",
      onSecondaryContainer: "rgb(43, 23, 8)",
      tertiary: "rgb(96, 97, 52)",
      onTertiary: "rgb(255, 255, 255)",
      tertiaryContainer: "rgb(229, 230, 173)",
      onTertiaryContainer: "rgb(28, 29, 0)",
      error: "rgb(186, 26, 26)",
      onError: "rgb(255, 255, 255)",
      errorContainer: "rgb(255, 218, 214)",
      onErrorContainer: "rgb(65, 0, 2)",
      background: "rgb(255, 251, 255)",
      onBackground: "rgb(32, 26, 23)",
      surface: "rgb(255, 251, 255)",
      onSurface: "rgb(32, 26, 23)",
      surfaceVariant: "rgb(244, 222, 211)",
      onSurfaceVariant: "rgb(82, 68, 60)",
      outline: "rgb(132, 116, 106)",
      outlineVariant: "rgb(215, 195, 183)",
      shadow: "rgb(0, 0, 0)",
      scrim: "rgb(0, 0, 0)",
      inverseSurface: "rgb(54, 47, 43)",
      inverseOnSurface: "rgb(251, 238, 232)",
      inversePrimary: "rgb(255, 183, 134)",
      elevation: {
        level0: "transparent",
        level1: "rgb(250, 242, 242)",
        level2: "rgb(247, 237, 235)",
        level3: "rgb(244, 231, 227)",
        level4: "rgb(242, 230, 224)",
        level5: "rgb(240, 226, 219)",
      },
      surfaceDisabled: "rgba(32, 26, 23, 0.12)",
      onSurfaceDisabled: "rgba(32, 26, 23, 0.38)",
      backdrop: "rgba(58, 46, 38, 0.4)",
    },
  };

  return (
    <TRPCProvider>
      <PaperProvider theme={theme}>
        {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
          */}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="dark" />
      </PaperProvider>
    </TRPCProvider>
  );
}
