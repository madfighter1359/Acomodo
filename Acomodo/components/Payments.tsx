import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

const items = [
  {
    label: "Silver",
    price: 29,
  },
  {
    label: "Royal Blue",
    price: 99,
  },
  {
    label: "Dark Blue",
    price: 249,
  },
  {
    label: "Diamond",
    price: 499,
  },
  {
    label: "Gold",
    price: 999,
  },
  {
    label: "Platinum",
    price: 2499,
  },
];

export default function Example() {
  const [value, setValue] = React.useState(0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Credit Cards</Text>
        {items.map(({ label, price, description }, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const isActive = value === index;
          return (
            <View
              key={index}
              style={[
                styles.radioWrapper,
                isActive && styles.radioActive,
                isFirst && styles.radioFirst,
                isLast && styles.radioLast,
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setValue(index);
                }}
              >
                <View style={styles.radio}>
                  <View
                    style={[
                      styles.radioInput,
                      isActive && styles.radioInputActive,
                    ]}
                  />

                  <Text style={styles.radioLabel}>{label}</Text>

                  <Text
                    style={[
                      styles.radioPrice,
                      isActive && styles.radioPriceActive,
                    ]}
                  >
                    ${price.toLocaleString("en-US")}
                    /yr
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <View style={styles.contact}>
        <FeatherIcon name="info" color="#0069fe" size={20} />
        <Text style={styles.contactText}>
          Doubting which credit card is the right one for you?{" "}
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <Text style={{ color: "#0069fe", fontWeight: "500" }}>
              Contact us
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  /** Radio */
  radio: {
    position: "relative",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  radioWrapper: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7e5",
    marginTop: -2,
  },
  radioActive: {
    backgroundColor: "#f1f4ff",
  },
  radioFirst: {
    marginTop: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  radioLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  radioInput: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#b0b0b0",
    marginRight: 12,
  },
  radioInputActive: {
    borderWidth: 7,
    borderColor: "#0069fe",
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d2d3a",
  },
  radioPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2f2f2f",
    marginLeft: "auto",
  },
  radioPriceActive: {
    color: "#3f63ff",
  },
  /** Contact */
  contact: {
    backgroundColor: "#f7f7f7",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  contactText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#afafaf",
    lineHeight: 22,
    marginLeft: 12,
  },
});
