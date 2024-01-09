import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useSession } from "../../ctx";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { useFocusEffect } from "expo-router";

export default function Index() {
  const { session, signOut } = useSession();

  useFocusEffect(() => setStatusBarStyle("dark"));

  return (
    <SafeAreaView style={styles.container}>
      <Text>Reserve</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
