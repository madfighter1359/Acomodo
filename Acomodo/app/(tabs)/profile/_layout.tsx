import { Stack } from "expo-router";

// Creates nested navigation for Profile page
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerBackTitleVisible: true,
          headerBackTitle: "General",
          headerTitle: "",
          headerTintColor: "#a69f9f",
          headerTransparent: true,
          headerTitleStyle: { fontWeight: "normal" },
          headerBlurEffect: "systemMaterial",
        }}
      />
    </Stack>
  );
}
