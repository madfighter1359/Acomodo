import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useSession } from "../../ctx";
import Swiper from "react-native-swiper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import Button from "../../components/Button";
import { FontAwesome6 } from "@expo/vector-icons";
import { auth } from "../../firebase-config";
import GetDetails from "../../components/api/GetReservationDetails";
import GetTransaction from "../../components/api/GetTransaction";
import { getLocale } from "../../components/userSettings";
import Loading from "../../components/Loading";

export default function ViewDetails() {
  const form = useLocalSearchParams();
  const { session } = useSession();

  const [loaded, setLoaded] = useState(true);

  const locale = getLocale();

  const DAY = 1000 * 86400;

  const items = [
    [
      { label: "Room number", value: form.roomNr },
      { label: "Guests", value: form.numberOfPeople },
    ],
    [
      { label: "Check In", value: "13:00" },
      { label: "Check Out", value: "10:00" },
    ],
    [
      { label: "Room type", value: form.roomTypeName },
      {
        label: "Nights",
        value: Math.round(
          (new Date(form.checkOutDate.toString()).getTime() -
            new Date(form.checkInDate.toString()).getTime()) /
            DAY
        ),
      },
    ],
  ];

  const [images, setImages] = useState<string[] | []>([]);

  useEffect(() => {
    (async () => {
      try {
        const token = await auth.currentUser?.getIdToken(false);
        if (token) {
          const data = await GetDetails({
            token: token,
            reservationId: +form.reservationId,
          });
          if (data != false) {
            setImages([data.image]);
          }
        } else {
          throw new Error();
        }
      } catch (e) {}
    })();
  }, []);

  const handleViewConfirmation = async () => {
    setLoaded(false);
    try {
      const token = await auth.currentUser?.getIdToken(false);
      if (token) {
        const data = await GetTransaction({
          token: token,
          reservationId: +form.reservationId,
        });
        if (data != false) {
          const params = {
            checkIn: form.checkInDate,
            checkOut: form.checkOutDate,
            roomTypeName: form.roomTypeName,
            price: form.totalPrice,
            locationName: form.locationName,
            reservationId: form.reservationId,
            oldReservation: 1,
            date: data.date,
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId,
            fullName: data.name,
            email: data.email,
            paid: data.paid,
          };
          router.push({ pathname: "/booking-confirmed", params: params });
          setLoaded(true);
        }
      } else {
        throw new Error();
      }
    } catch (e) {}
  };

  if (!loaded) return <Loading />;

  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      {session ? (
        <View>
          <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
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
                      {images.map((src, index) => (
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
                      <Text
                        style={[styles.pickerDatesText, { marginBottom: 2 }]}
                      >
                        {new Date(
                          form.checkInDate.toString()
                        ).toLocaleDateString(locale, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>

                      <FontAwesome6 name="arrow-right" size={15} />

                      <Text style={styles.pickerDatesText}>
                        {new Date(
                          form.checkOutDate.toString()
                        ).toLocaleDateString(locale, {
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

                      {/* <Text style={styles.infoRatingText}>(Rating site)</Text> */}
                    </View>
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
            </SafeAreaView>

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
              </View>

              <TouchableOpacity onPress={handleViewConfirmation}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>View confirmation</Text>

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
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 20 }}>
            Pleas sign in or sign up to continue!
          </Text>
          <Button
            onPress={() => router.push("/sign-in")}
            size="medium"
            type="secondary"
          >
            Sign In
          </Button>
          <Button
            size="medium"
            type="secondary"
            onPress={() => router.push("/sign-up")}
          >
            Sign Up
          </Button>
          <Button size="medium" onPress={() => router.push("/payment")}>
            Lol
          </Button>
        </View>
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
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
