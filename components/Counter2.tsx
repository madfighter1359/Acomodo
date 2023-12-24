import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
} from "react-native";

interface Props {
  getVal?: (val: number) => number;
}

let val = 0;

export default function Counter({ getVal }: Props) {
  const [value, setValue] = React.useState(0);

  return (
    <View style={styles.counter}>
      <TouchableOpacity
        onPress={() => {
          setValue(value - 1);
          val = value - 1;
        }}
        style={styles.counterAction}
      >
        <Text style={styles.counterActionText}>-</Text>
      </TouchableOpacity>

      <Text style={styles.counterValue}>{value}</Text>

      <TouchableOpacity
        onPress={() => {
          setValue(value + 1);
          val = value + 1;
        }}
        style={styles.counterAction}
      >
        <Text style={styles.counterActionText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export function getValue() {
  return val;
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
