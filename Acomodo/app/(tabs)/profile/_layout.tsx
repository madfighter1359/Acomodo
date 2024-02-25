import { Stack, router } from "expo-router";
import { Pressable, Text } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit-profile"
        options={{
          // headerShown: false,
          // headerStyle: { backgroundColor: "#f2f2f2" },
          headerBackTitleVisible: true,
          headerBackTitle: "General",
          headerTitle: "",
          headerTintColor: "#a69f9f",
          headerTransparent: true,
          headerTitleStyle: { fontWeight: "normal" },
          // headerLeft: () => (
          //   <Text style={{ color: "#a69f9f", fontSize: 15, marginLeft: -10 }}>
          //     EDIT YOUR ACCOUNT
          //   </Text>
          // ),
          // headerBackVisible: false,
          headerBlurEffect: "systemMaterial",

          // animation: "none",
        }}
      />
    </Stack>
  );
}
