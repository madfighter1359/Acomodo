import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useSession } from "../../ctx";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { useFocusEffect } from "expo-router";
import { auth } from "../../firebase-config";
import GetReservations from "../../components/api/GetReservations";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Loading from "../../components/Loading";
import { getLocale } from "../../components/userSettings";

interface Reservation {
  checkIn: string;
  checkOut: string;
  guestId: number;
  locationId: string;
  locationImage: string;
  locationName: string;
  nrGuests: number;
  price: number;
  reservationId: number;
  roomNr: number;
  roomType: string;
}

export default function Index() {
  const { session, signOut } = useSession();

  const locale = getLocale();

  const [bookings, setBookings] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  const getBookings = async () => {
    // console.log("updated");
    console.log(auth.currentUser?.uid);
    auth.currentUser?.getIdToken(false).then((token) => {
      GetReservations({ token: token }).then((data) => {
        if (data !== false) {
          console.log(data.reservations);
          setBookings(
            data.reservations.sort(
              (a: Reservation, b: Reservation) =>
                new Date(a.checkIn).valueOf() - new Date(b.checkIn).valueOf()
            )
          );
          // setBookings(data.reservations);
          if (!loaded) setLoaded(true);
        } else {
          setError(true);
        }
      });
    });
  };

  useEffect(() => {
    getBookings();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setError(false);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
    setLoaded(false);
    getBookings();
  }, []);

  const handleViewDetails = (
    id: number,
    roomType: string,
    roomNr: number,
    checkIn: string,
    checkOut: string,
    nrGuests: number,
    price: number,
    locationName: string
  ) => {
    const form = {
      reservationId: id,
      numberOfPeople: nrGuests,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      locationName: locationName,
      roomTypeName: roomType,
      totalPrice: price,
    };
    router.push({ pathname: "/(booking-info)/booking-details", params: form });
  };

  return session ? (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={"#94A3B8"}
        />
      }
      indicatorStyle="black"
    >
      {loaded ? (
        bookings.length >= 1 ? (
          bookings.map(
            (
              {
                reservationId,
                roomNr,
                locationName,
                checkIn,
                checkOut,
                nrGuests,
                price,
                roomType,
                locationImage,
              },
              index
            ) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    handleViewDetails(
                      reservationId,
                      roomType,
                      roomNr,
                      checkIn,
                      checkOut,
                      nrGuests,
                      price,
                      locationName
                    )
                  }
                >
                  <View style={styles.card}>
                    <Image
                      alt=""
                      resizeMode="cover"
                      source={{ uri: locationImage }}
                      style={styles.cardImg}
                    />
                    <View style={styles.cardBody}>
                      <Text>
                        <Text style={styles.cardTitle}>{locationName}</Text>
                        {"\n"}
                        <Text style={styles.cardAirport}>{nrGuests} PERS</Text>
                      </Text>

                      <View style={styles.cardRow}>
                        <View style={styles.cardRowItem}>
                          <FontAwesome
                            color="#6f61c4"
                            icon="right-to-bracket"
                            size={10}
                          />

                          <Text style={styles.cardRowItemText}>
                            {new Date(checkIn).toLocaleDateString(locale, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </Text>
                        </View>

                        <View style={styles.cardRowItem}>
                          <FontAwesome
                            color="#6f61c4"
                            icon="right-from-bracket"
                            size={10}
                          />

                          <Text style={styles.cardRowItemText}>
                            {new Date(checkOut).toLocaleDateString(locale, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.cardPrice}>
                        <Text>total </Text>

                        <Text style={styles.cardPriceValue}>
                          {(+price).toLocaleString(locale, {
                            currency: "RON",
                            // style: "currency",
                          })}{" "}
                        </Text>

                        <Text style={styles.cardPriceCurrency}>RON</Text>
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          // backgroundColor: "purple",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <TouchableOpacity onPress={() => {}}>
                          <View style={styles.btn}>
                            <Text style={styles.btnText}>Re-book</Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            justifyContent: "flex-end",
                            // backgroundColor: "red",
                            flexDirection: "row",
                            alignItems: "flex-end",
                            alignSelf: "flex-end",
                            display: "flex",
                          }}
                        >
                          <Text
                            style={[
                              styles.cardAvailabilityText,
                              {
                                fontSize: 14,
                                fontWeight: "700",
                                color: "#173153",
                                paddingBottom: 0,
                              },
                            ]}
                          >
                            RES
                          </Text>
                          <Text style={styles.cardAvailabilityText}>
                            #{reservationId}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          )
        ) : (
          <View style={styles.empty}>
            <FontAwesome6 color="#94A3B8" name="receipt" size={36} />

            <Text style={styles.emptyTitle}>No bookings</Text>

            <Text style={styles.emptyDescription}>
              Make a reservation and it will show up here
            </Text>

            <TouchableOpacity
              onPress={() => {
                router.navigate("/");
              }}
            >
              <View style={styles.emptyBtn}>
                <Text style={styles.emptyBtnText}>Book now</Text>

                <FontAwesome6
                  color="#fff"
                  name="circle-arrow-right"
                  size={18}
                  style={{ marginLeft: 12 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <Loading />
      )}
    </ScrollView>
  ) : (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <View style={styles.empty}>
        <FontAwesome6 color="#94A3B8" solid name="user" size={36} />

        <Text style={styles.emptyTitle}>Not signed in</Text>

        <Text style={styles.emptyDescription}>
          Please sign in to view your bookings
        </Text>

        <TouchableOpacity
          onPress={() => {
            router.navigate("/profile");
          }}
        >
          <View style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>Authenticate</Text>

            <FontAwesome6
              color="#fff"
              name="circle-arrow-right"
              size={18}
              style={{ marginLeft: 12 }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    // flex: 1,
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  /** Card */
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  cardImg: {
    width: 120,
    height: 154,
    borderRadius: 12,
  },
  cardBody: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    // backgroundColor: "green",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#173153",
    marginRight: 8,
  },
  cardAirport: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5f697d",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: -8,
    flexWrap: "wrap",
  },
  cardRowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  cardRowItemText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#5f697d",
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: "500",
    color: "#5f697d",
  },
  cardPriceValue: {
    fontSize: 21,
    fontWeight: "700",
    color: "#173153",
  },
  cardPriceCurrency: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6f61c4",
  },
  cardAvailabilityText: {
    fontWeight: "500",
    color: "#5f697d",
    fontSize: 12,
    paddingLeft: 2,
    paddingBottom: 1,
    // paddingRight: 2,
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    backgroundColor: "#173153",
    borderColor: "#173153",
  },
  btnText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: "#fff",
  },
  /** Empty */
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "green",
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
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#2b64e3",
    borderColor: "#2b64e3",
  },
  emptyBtnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },
});
