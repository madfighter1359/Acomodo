import { StatusBar } from "expo-status-bar";
import React from "react";
import { Stack } from "expo-router";
import { SessionProvider } from "../ctx";

// Stack navigation structure for main app
export default function Layout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ title: "Home", headerShown: false }}
        />
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
  );
}
