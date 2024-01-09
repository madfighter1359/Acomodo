import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Stack } from "expo-router";
import { SessionProvider } from "../ctx";

export default function Layout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" />
      </Stack>
      <StatusBar style="dark" />
    </SessionProvider>
  );
}
