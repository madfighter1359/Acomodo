import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useGlobalSearchParams } from "expo-router";

export default function RoomSelect() {
  const form = useGlobalSearchParams();
  console.log(form);
  return (
    <View>
      <Text>RoomSelect</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
