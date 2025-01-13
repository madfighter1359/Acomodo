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
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Stack.Screen
          name="(booking)/room-select"
          options={{ title: "Select room", headerBackButtonDisplayMode: "minimal" }}
        />
        <Stack.Screen
          name="(booking)/payment"
          options={{
            title: "Select payment method",
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Stack.Screen
          name="(booking)/confirm-booking"
          options={{
            title: "Review details",
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Stack.Screen
          name="(booking-info)/booking-details"
          options={{
            title: "Booking details",
            headerBackButtonDisplayMode: "minimal",
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
          options={{ title: "Sign Up", headerBackButtonDisplayMode: "minimal" }}
        />
        <Stack.Screen
          name="sign-in"
          options={{ title: "Sign In", headerBackButtonDisplayMode: "minimal" }}
        />
      </Stack>
      <StatusBar style="dark" />
    </SessionProvider>
  );
}
