import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

interface Props {
  desc?: string;
  resolution?: string;
  action?: () => void;
  resolution2?: string;
  action2?: () => void;
}

export default function Error({
  desc = "An unkown error occured",
  resolution = "Go home",
  action = () => {
    router.navigate("/");
  },
  resolution2 = "",
  action2 = () => {},
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.empty}>
        <FontAwesome6 name="circle-exclamation" color="#94A3B8" size={36} />

        <Text style={styles.emptyTitle}>An error occured</Text>

        <Text style={styles.emptyDescription}>{desc}</Text>

        <TouchableOpacity onPress={action}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>{resolution}</Text>

            <FontAwesome6
              color="#fff"
              name="circle-arrow-right"
              size={18}
              style={{ marginLeft: 12 }}
            />
          </View>
        </TouchableOpacity>

        {resolution2 && (
          <TouchableOpacity onPress={action2}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>{resolution2}</Text>

              <FontAwesome6
                color="#fff"
                name="circle-arrow-right"
                size={18}
                style={{ marginLeft: 12 }}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingBottom: 140,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  /** Empty */
  empty: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 21,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 15,
    fontWeight: "500",
    color: "#878787",
    marginBottom: 24,
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#2b64e3",
    borderColor: "#2b64e3",
    marginBottom: 10,
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },
});
