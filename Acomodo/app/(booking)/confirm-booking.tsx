import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useSession } from "../../ctx";
import Swiper from "react-native-swiper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import { getLocale } from "../../components/userSettings";
import Error from "../../components/Error";
import { FontAwesome6 } from "@expo/vector-icons";

export default function ConfirmBooking() {
  const form = useLocalSearchParams();
  const { session } = useSession();

  const locale = getLocale();

  const items = [
    [
      { label: "Room type", value: form.typeName },
      { label: "People", value: form.numberOfPeople },
    ],
    [
      { label: "Check In", value: "13:00" },
      { label: "Check Out", value: "10:00" },
    ],
    [
      { label: "Beds", value: form.beds },
      { label: "Nights", value: form.numberOfNights },
    ],
  ];
  const IMAGES = [form.roomImage.toString()];

  const handlePay = () => {
    const params = {
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
      numberOfPeople: form.numberOfPeople,
      locationId: form.locationId,
      roomType: form.roomType,
      totalPrice: form.totalPrice,
    };
    router.push({ pathname: "/payment", params: params });
  };

  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      {session ? (
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
              <View style={styles.photos}>
                <Swiper
                  renderPagination={(index, total) => (
                    <View style={styles.photosPagination}>
                      <Text style={styles.photosPaginationText}>
                        {index + 1} of {total}
                      </Text>
                    </View>
                  )}
                >
                  {IMAGES.map((src, index) => (
                    <Image
                      alt=""
                      key={index}
                      source={{ uri: src }}
                      style={styles.photosImg}
                    />
                  ))}
                </Swiper>
              </View>

              <View style={styles.picker}>
                <FeatherIcon color="#000" name="calendar" size={18} />

                <View style={styles.pickerDates}>
                  <Text style={[styles.pickerDatesText, { marginBottom: 2 }]}>
                    {new Date(+form.checkInDate).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>

                  <FontAwesome6 name="arrow-right" size={15} />

                  <Text style={styles.pickerDatesText}>
                    {new Date(+form.checkOutDate).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
              <View style={styles.info}>
                <Text style={styles.infoTitle}>{form.locationName}</Text>

                <View style={styles.infoRating}>
                  <Text style={styles.infoRatingLabel}>9.7</Text>

                  <FeatherIcon color="#4c6cfd" name="star" size={15} />

                  <Text style={styles.infoRatingText}>(Booking.com)</Text>
                </View>

                {/* <Text style={styles.infoDescription}>
                      Model S Dual Motor All-Wheel Drive unlocks more range than
                      any other vehicle in our current lineup, with insane power
                      and maximum control.
                    </Text> */}
              </View>
              <View style={styles.stats}>
                {items.map((row, rowIndex) => (
                  <View
                    key={rowIndex}
                    style={[
                      styles.statsRow,
                      rowIndex === 0 && { borderTopWidth: 0 },
                    ]}
                  >
                    {row.map(({ label, value }, index) => (
                      <View
                        key={index}
                        style={[
                          styles.statsItem,
                          index === 0 && { borderLeftWidth: 0 },
                        ]}
                      >
                        <Text style={styles.statsItemText}>{label}</Text>

                        <Text style={styles.statsItemValue}>{value}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.overlay}>
            <View style={styles.overlayContent}>
              <View style={styles.overlayContentTop}>
                <Text style={styles.overlayContentPrice}>
                  {`${(+form.totalPrice).toLocaleString(locale, {
                    currency: "GBP",
                    style: "currency",
                  })} total`}
                </Text>
              </View>

              <Text style={styles.overlayContentTotal}>
                {`${(+form.totalPrice / +form.numberOfNights).toLocaleString(
                  locale,
                  { currency: "GBP", style: "currency" }
                )} / night`}
              </Text>
            </View>

            <TouchableOpacity onPress={handlePay}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Payment</Text>

                <MaterialCommunityIcons
                  color="#fff"
                  name="arrow-right-circle"
                  size={18}
                  style={{ marginLeft: 12 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Error
          desc="Please authenticate to continue"
          resolution="Sign In"
          action={() => router.push("/sign-in")}
          resolution2="Sign Up"
          action2={() => router.push("/sign-up")}
        />
      )}
    </View>
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
    fontSize: 19,
    fontWeight: "600",
    color: "#000",
  },
  /** Photos */
  photos: {
    marginTop: 12,
    position: "relative",
    height: 240,
    overflow: "hidden",
    borderRadius: 12,
  },
  photosTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  photosTopItem: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  photosPagination: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#000",
    borderRadius: 12,
  },
  photosPaginationText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fbfbfb",
  },
  photosImg: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    width: "100%",
    height: 240,
  },
  /** Picker */
  picker: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#fff",
  },
  pickerDates: {
    marginLeft: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
  },
  pickerDatesText: {
    fontSize: 13,
    fontWeight: "500",
  },
  pickerAction: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pickerActionText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    color: "#4c6cfd",
  },
  /** Info */
  info: {
    marginTop: 12,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  infoTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "600",
    letterSpacing: 0.38,
    color: "#000000",
    marginBottom: 6,
  },
  infoRating: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  infoRatingLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
    marginRight: 2,
  },
  infoRatingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8e8e93",
    marginLeft: 2,
  },
  infoDescription: {
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.078,
    color: "#8e8e93",
  },
  /** Stats */
  stats: {
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f5f5f5",
  },
  statsItem: {
    flexGrow: 2,
    flexShrink: 1,
    flexBasis: 0,
    paddingVertical: 12,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderColor: "#f5f5f5",
  },
  statsItemText: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    color: "#8e8e93",
    marginBottom: 4,
  },
  statsItemValue: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#000",
  },
  /** Overlay */
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 25,
    paddingHorizontal: 16,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  overlayContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  overlayContentTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 2,
  },
  overlayContentPriceBefore: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    color: "#8e8e93",
    marginRight: 4,
    textDecorationLine: "line-through",
    textDecorationColor: "#8e8e93",
    textDecorationStyle: "solid",
  },
  overlayContentPrice: {
    fontSize: 21,
    lineHeight: 26,
    fontWeight: "700",
    color: "#000",
  },
  overlayContentTotal: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: "#4c6cfd",
    letterSpacing: -0.07,
    textDecorationLine: "underline",
    textDecorationColor: "#4c6cfd",
    textDecorationStyle: "solid",
  },
  /** Button */
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "#007aff",
    borderColor: "#007aff",
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
