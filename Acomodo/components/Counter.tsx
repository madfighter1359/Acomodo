import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

// Parameters for counter component (a function for when the plus button is pressed and one for the minus button)
interface Props {
  inc: () => void;
  dec: () => void;
  value: number;
}

// Simple counter component, functionality is given when it is actually used
// Component template from https://withfra.me, purely for stylstic purposes (all functionality added by me)
export default function Counter({ inc, dec, value }: Props) {
  return (
    <View style={styles.counter}>
      <TouchableOpacity onPress={dec} style={styles.counterAction}>
        <Text style={styles.counterActionText}>-</Text>
      </TouchableOpacity>

      <Text style={styles.counterValue}>{value}</Text>

      <TouchableOpacity onPress={inc} style={styles.counterAction}>
        <Text style={styles.counterActionText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderStyle: "solid",
    borderRadius: 8,
  },
  counterAction: {
    width: 46,
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  counterActionText: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "500",
    color: "#000",
  },
  counterValue: {
    minWidth: 34,
    fontSize: 14,
    fontWeight: "500",
    color: "#101010",
    textAlign: "center",
    paddingHorizontal: 8,
  },
});
