import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

// Button component parameters, allow for styling and functionality
interface Props {
  size: "xs" | "small" | "medium" | "large" | "xl";
  type?: "primary" | "secondary";
  children: string | string[];
  onPress?: () => void;
  color?: string;
}

// Button component with default type value
// Component template from https://withfra.me, purely for stylstic purposes (all functionality added by me)
export default function PrimaryButton({
  onPress,
  size,
  type = "primary",
  color,
  children,
}: Props) {
  // Styles for different button sizes
  const sizes = {
    xs: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      fontSize: 13,
      lineHeight: 18,
    },
    small: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: 14,
      lineHeight: 20,
    },
    medium: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: 17,
      lineHeight: 24,
    },
    large: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      fontSize: 18,
      lineHeight: 26,
    },
    xl: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      fontSize: 20,
      lineHeight: 28,
    },
  };

  // Colours for the two button types
  const colors = {
    primary: {
      backgroundColor: "#0569FF",
      borderColor: "#0569FF",
      color: "#fff",
    },
    secondary: {
      backgroundColor: "#efefef",
      borderColor: "#efefef",
      color: "#0d57b2",
    },
  };

  // Conditionally style the button and render it
  return (
    <View style={styles.buttons}>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            styles.btn,
            {
              paddingVertical: sizes[size].paddingVertical,
              paddingHorizontal: sizes[size].paddingHorizontal,
              backgroundColor: colors[type].backgroundColor,
              borderColor: colors[type].borderColor,
            },
            color ? { backgroundColor: color, borderColor: color } : undefined,
          ]}
        >
          <Text
            style={[
              styles.btnText,
              {
                fontSize: sizes[size].fontSize,
                lineHeight: sizes[size].lineHeight,
                color: colors[type].color,
              },
            ]}
          >
            {children}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#0569FF",
    borderColor: "#0569FF",
  },
  btnText: {
    fontWeight: "600",
    color: "#fff",
  },
});
