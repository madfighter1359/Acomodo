import React from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { FontAwesome6 } from "@expo/vector-icons";

export default function ConfirmScreen() {
  const form = useLocalSearchParams<any>();
  console.log(form);
  return (
    <>
      {form.oldReservation && (
        <Stack.Screen
          options={{
            title: "Booking info",
          }}
        />
      )}
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.receipt}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.receiptLogo}>
                <FeatherIcon color="#fff" name="codepen" size={32} />
              </View>

              <Text style={styles.receiptTitle}>{form.locId}</Text>

              <Text style={styles.receiptSubtitle}>
                Reservation #{form.reservationId}
              </Text>

              <View style={styles.receiptPrice}>
                <Text style={styles.receiptPriceText}>
                  {(+form.price).toLocaleString("ro-RO", {
                    currency: "RON",
                    style: "currency",
                  })}
                </Text>

                {/* <Text
                style={[
                  styles.receiptPriceText,
                  { fontSize: 20, lineHeight: 32 },
                ]}
              >
                .00
              </Text> */}
              </View>

              <Text style={styles.receiptDescription}>
                {form.roomType} room ·{" "}
                {new Date(form.checkIn).toLocaleDateString("ro-RO")} -{" "}
                {new Date(form.checkOut).toLocaleDateString("ro-RO")}
              </Text>

              <View style={styles.divider}>
                <View style={styles.dividerInset} />
              </View>

              <View style={styles.details}>
                <Text style={styles.detailsTitle}>Transaction details</Text>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsField}>Date</Text>

                  <Text style={styles.detailsValue}>
                    {new Date(form.date.toString()).toLocaleDateString("ro-RO")}
                  </Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsField}>Payment method</Text>

                  <Text style={styles.detailsValue}>
                    {form.paymentMethod.charAt(0).toUpperCase() +
                      form.paymentMethod.slice(1)}
                  </Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsField}>Transaction ID</Text>

                  <Text style={styles.detailsValue}>{form.transactionId}</Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsField}>Billing Name</Text>

                  <Text style={styles.detailsValue}>{form.fullName}</Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsField}>Billing Email</Text>

                  <Text style={styles.detailsValue}>{form.email}</Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsField}>Status</Text>

                  <Text style={styles.detailsValue}>
                    {form.paid == 1 ? "Paid" : "To be paid"}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>

        <View style={styles.overlay}>
          <TouchableOpacity
            onPress={() => {
              router.replace("/bookings");
            }}
          >
            <View style={styles.btn}>
              <Text style={styles.btnText}>My bookings</Text>
              <FontAwesome6
                name="arrow-right"
                size={25}
                color="white"
                style={{ padding: 10, paddingLeft: 12 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <View style={styles.btnSecondary}>
              <Text style={styles.btnSecondaryText}>Save as PDF</Text>
              <FontAwesome6
                name="download"
                color="#8338ec"
                size={18}
                style={{ paddingLeft: 7 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    paddingHorizontal: 16,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "stretch",
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 48,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  /** Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  /** Receipt */
  receipt: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 140,
  },
  receiptLogo: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    marginBottom: 12,
    backgroundColor: "#0e0e0e",
    alignItems: "center",
    justifyContent: "center",
  },
  receiptTitle: {
    fontSize: 21,
    fontWeight: "600",
    color: "#151515",
    marginBottom: 2,
  },
  receiptSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: "#818181",
    marginBottom: 12,
  },
  receiptPrice: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginBottom: 6,
  },
  receiptPriceText: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "bold",
    letterSpacing: 0.35,
    color: "#8338ec",
  },
  receiptDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "#818181",
    textAlign: "center",
    marginBottom: 12,
  },
  /** Avatar */
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  /** Divider */
  divider: {
    overflow: "hidden",
    width: "100%",
    marginVertical: 24,
  },
  dividerInset: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderStyle: "dashed",
    marginTop: -2,
  },
  /** Details */
  details: {
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  detailsTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 16,
  },
  detailsRow: {
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  detailsField: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "500",
    color: "#8c8c8c",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  detailsValue: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#444",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: "right",
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#8338ec",
    borderColor: "#8338ec",
    marginBottom: 12,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "transparent",
    borderColor: "#8338ec",
  },
  btnSecondaryText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#8338ec",
  },
});
