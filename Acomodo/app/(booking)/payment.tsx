import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { FontAwesome6 } from "@expo/vector-icons";
import Button from "../../components/Button";
import { useSession } from "../../ctx";
import { router, useLocalSearchParams } from "expo-router";
import NewReservation from "../../components/api/NewReservation";
import { auth } from "../../firebase-config";
import Loading from "../../components/Loading";

const items = [
  {
    label: "Cash at reception",
    name: "cash",
    icon: "money-bills",
    available: true,
  },
  {
    label: "Card",
    name: "card",
    icon: "credit-card",
    available: false,
  },
  {
    label: "Bank transfer",
    name: "transfer",
    icon: "building-columns",
    available: false,
  },
];

export default function Payment() {
  // Check if authenticated
  const { session } = useSession();
  if (!session) router.navigate("/profile");

  const [loading, setLoading] = React.useState(false);

  const [value, setValue] = React.useState(0);
  const [paid, setPaid] = React.useState(false);
  const form = useLocalSearchParams();

  const handleConfirm = () => {
    setLoading(true);
    auth.currentUser
      ?.getIdToken(true)
      .then((token) => {
        NewReservation({
          token: token,
          checkInDate: +form.checkInDate,
          checkOutDate: +form.checkOutDate,
          numberOfPeople: +form.numberOfPeople,
          price: +form.totalPrice,
          locationId: form.locationId.toString(),
          roomType: form.roomType.toString(),
          paymentMethod: items[value].name,
          paid: paid,
        }).then((result) => {
          console.log(result);
          if (!result[0]) {
            Alert.alert("Booking failed", result[1], [
              {
                text: "Restart booking",
                onPress: () => router.navigate("/"),
              },
            ]);
          } else {
            const params = {
              reservationId: result[1],
              ...result[2],
              transactionId: result[3],
              ...result[4],
            };
            console.log(params);
            router.navigate("/");
            router.replace({ pathname: "/booking-confirmed", params: params });
          }
        });
      })
      .catch((e) => console.log(e));
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <Loading />
      ) : (
        <View>
          <View style={styles.container}>
            {items.map(({ label, icon, available }, index) => {
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
                    !available && styles.radioUnavailable,
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (available) setValue(index);
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

                      {!available && (
                        <View
                          style={{
                            backgroundColor: "#D3D3D3",
                            padding: 3,
                            marginLeft: 20,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesome6
                            name="triangle-exclamation"
                            size={13}
                            style={{ padding: 2 }}
                          />
                          <Text style={{ fontSize: 13, padding: 2 }}>
                            Unavailable
                          </Text>
                        </View>
                      )}

                      <Text
                        style={[
                          styles.radioPrice,
                          isActive && styles.radioPriceActive,
                        ]}
                      >
                        <FontAwesome6 name={icon} size={15} />
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
              Certain payment methods are currently unavailable. We apologise
              for the inconvenience{" "}
            </Text>
          </View>
          <View style={{ paddingTop: 100 }}>
            <Button onPress={handleConfirm} size={"xl"}>
              {value == 0 ? "Book" : "Pay"} now!
            </Button>
          </View>
        </View>
      )}
    </View>
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
  radioUnavailable: {
    opacity: 0.3,
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
