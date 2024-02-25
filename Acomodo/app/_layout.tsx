import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Stack } from "expo-router";
import { SessionProvider } from "../ctx";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { create } from "zustand";
import { useSettingsStore } from "../components/userSettings";
import { getData } from "../components/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function Layout() {
  console.log(useSettingsStore((state) => state.locale));
  // console.log(getData("locale"));
  return (
    // <GestureHandlerRootView>
    // <BottomSheetModalProvider>
    <SessionProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ title: "Home", headerShown: false }}
        />
        {/* <Stack.Screen
          name="(tabs)/bookings"
          options={{ title: "Bookings", headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)/index"
          options={{ title: "Book", headerShown: false }}
        /> */}

        <Stack.Screen
          name="(booking)/location-select"
          options={{
            title: "Select location",
            headerBackTitleVisible: false,
          }}
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
          options={{
            title: "Review details",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="(booking-info)/booking-details"
          options={{
            title: "Booking details",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="booking-confirmed"
          options={{
            title: "Booking confirmed!",
          }}
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
    //   </BottomSheetModalProvider>
    // </GestureHandlerRootView>
  );
}
