import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";

export default function Loading() {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "purple",
        flex: 1,
      }}
    >
      <Text style={{ fontSize: 32 }}>
        <ActivityIndicator
          size={"large"}
          color={Platform.OS == "ios" ? "#94A3B8" : "#2b64e3"}
        />
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
