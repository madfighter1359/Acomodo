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
import { getLocale } from "../components/userSettings";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

export default function ConfirmScreen() {
  const form = useLocalSearchParams<any>();
  console.log(form);
  const locale = getLocale();

  const createPDF = async () => {
    const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Receipt</title>
    <style>
      body,
      html {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
      }

      body {
        display: flex;
        flex-direction: column;
        padding: 0 16px;
        flex-grow: 1;
        /* width: 500px; */
        margin: auto;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .safeAreaView {
        background-color: #fff;
        flex: 1;
      }

      .receipt {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 16px;
        padding-bottom: 140px;
      }

      .receiptLogo {
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .receiptTitle,
      .receiptSubtitle,
      .receiptDescription,
      .detailsTitle,
      .detailsField,
      .detailsValue {
        text-align: center;
      }

      .receiptSubtitle {
        font-size: 13;
        color: #616161;
      }

      .receiptDescription {
        font-size: 13;
        color: #616161;
      }

      .receiptPrice {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        margin-bottom: 6px;
        margin-top: 10px;
      }

      .receiptPriceText {
        font-size: 50px;
        font-weight: bold;
        color: #8338ec;
      }

      .divider {
        width: 100%;
        margin: 24px 0;
      }

      .dividerInset {
        width: 100%;
        border-top: 2px dashed #e5e5e5;
      }

      .details {
        width: 100%;
      }

      .detailsRow {
        display: flex;
        justify-content: space-between;
        margin-bottom: 14px;
      }

      .detailsField {
        color: #616161;
      }

      .detailsValue {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="receipt">
      <div class="receiptLogo">
        <!-- <img
              src="Acomodo/Acomodo/assets/images/acomodo-icon.png"
              alt="Logo"
              style="width: 70px; height: 70px"
            /> -->
        <img
          src="https://i.imgur.com/wVrTjlc.png"
          alt="Logo"
          style="width: 70px; height: 70px"
        />
      </div>
      <h1 class="receiptTitle">${form.locationName}</h1>
      <p class="receiptSubtitle">Resevation #${form.reservationId}</p>
      <div class="receiptPrice">
        <span class="receiptPriceText">${(+form.price).toLocaleString(locale, {
          currency: "RON",
          style: "currency",
        })}</span>
      </div>
      <p class="receiptDescription">${
        form.roomTypeName
      } room <b>·</b> ${new Date(form.checkIn).toLocaleDateString(
      locale
    )} - ${new Date(form.checkOut).toLocaleDateString(locale)}</p>
      <div class="divider">
        <div class="dividerInset"></div>
      </div>
      <div class="details">
        <h3 class="detailsTitle">Transaction details</h3>
        <!-- Repeat for each detail row -->
        <div class="detailsRow">
          <span class="detailsField">Date</span>
          <span class="detailsValue">${new Date(
            form.date.toString()
          ).toLocaleDateString(locale)}</span>
        </div>
        <div class="detailsRow">
          <span class="detailsField">Payment method</span>
          <span class="detailsValue">${
            form.paymentMethod.charAt(0).toUpperCase() +
            form.paymentMethod.slice(1)
          }</span>
        </div>
        <div class="detailsRow">
          <span class="detailsField">Transaction ID</span>
          <span class="detailsValue">${form.transactionId}</span>
        </div>
        <div class="detailsRow">
          <span class="detailsField">Billing Name</span>
          <span class="detailsValue">${form.fullName}</span>
        </div>
        <div class="detailsRow">
          <span class="detailsField">Billing email</span>
          <span class="detailsValue">${form.email}</span>
        </div>
        <div class="detailsRow">
          <span class="detailsField">Status</span>
          <span class="detailsValue">${
            form.paid == 1 ? "Paid" : "To be paid"
          }</span>
        </div>
      </div>
    </div>
  </body>
</html>

`;
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html, width: 500 });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  return (
    <>
      {form.oldReservation && (
        <Stack.Screen
          options={{
            title: "Booking confirmation",
            headerBackTitleVisible: false,
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
                {/* <FeatherIcon color="#fff" name="codepen" size={32} /> */}
                <Image
                  source={require("../assets/images/acomodo-icon.png")}
                  style={{ width: 70, height: 70 }}
                />
              </View>

              <Text style={styles.receiptTitle}>{form.locationName}</Text>

              <Text style={styles.receiptSubtitle}>
                Reservation #{form.reservationId}
              </Text>

              <View style={styles.receiptPrice}>
                <Text style={styles.receiptPriceText}>
                  {(+form.price).toLocaleString(locale, {
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
                {form.roomTypeName} room ·{" "}
                {new Date(form.checkIn).toLocaleDateString(locale)} -{" "}
                {new Date(form.checkOut).toLocaleDateString(locale)}
              </Text>

              <View style={styles.divider}>
                <View style={styles.dividerInset} />
              </View>

              <View style={styles.details}>
                <Text style={styles.detailsTitle}>Transaction details</Text>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsField}>Date</Text>

                  <Text style={styles.detailsValue}>
                    {new Date(form.date.toString()).toLocaleDateString(locale)}
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
          {!form.oldReservation && (
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
          )}
          <TouchableOpacity onPress={createPDF}>
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
    backgroundColor: "white",
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
