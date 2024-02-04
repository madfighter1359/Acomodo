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
        <Stack.Screen
          name="(booking)/location-select"
          options={{ title: "Select location", headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="(booking)/room-select"
          options={{ title: "Select room", headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="(booking)/payment"
          options={{
            title: "Select payment method",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="(booking)/confirm-booking"
          options={{ title: "Review details", headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="sign-up"
          options={{ title: "Sign Up", headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="sign-in"
          options={{ title: "Sign In", headerBackTitleVisible: false }}
        />
      </Stack>
      <StatusBar style="dark" />
    </SessionProvider>
  );
}
