import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useSession } from "../../ctx";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { useFocusEffect } from "expo-router";
import { auth } from "../../firebase-config";
import GetReservations from "../../components/api/GetReservations";
import { FontAwesome } from "@expo/vector-icons";
import Example from "../../components/ress";

export default function Index() {
  const { session, signOut } = useSession();

  const [bookings, setBookings] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  const getBookings = async () => {
    auth.currentUser?.getIdToken(false).then((token) => {
      GetReservations({ token: token }).then((data) => {
        if (data !== false) {
          setBookings(data.reservations);
          if (!loaded) setLoaded(true);
        } else {
          setError(true);
        }
      });
    });
  };

  useFocusEffect(() => {
    getBookings();
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setError(false);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    setLoaded(false);
    getBookings();
  }, []);

  return session ? (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loaded ? (
        bookings.map(
          (
            {
              reservation_id,
              room_number,
              location_id,
              check_in_date,
              check_out_date,
              number_guests,
              price,
            },
            index
          ) => {
            return (
              <View
                key={index}
                style={[
                  styles.cardWrapper,
                  index === 0 && { borderTopWidth: 0 },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                >
                  <View style={styles.card}>
                    <View style={styles.cardBody}>
                      <Text numberOfLines={1} style={styles.cardTitle}>
                        {reservation_id}
                      </Text>

                      <View style={styles.cardRow}>
                        <View style={styles.cardRowItem}>
                          <FontAwesome color="#173153" name="bed" size={13} />

                          <Text style={styles.cardRowItemText}>
                            {1} Bedrooms
                          </Text>
                        </View>

                        <View style={styles.cardRowItem}>
                          <FontAwesome
                            color="#173153"
                            name="plus-square"
                            solid={true}
                            size={13}
                          />

                          <Text style={styles.cardRowItemText}>
                            {(2).toLocaleString("en-US")} sqft
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.cardPrice}>
                        $
                        {(+price).toLocaleString("ro-RO", {
                          currency: "RON",
                        })}{" "}
                        / month
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }
        )
      ) : error ? (
        <Text>Error</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  ) : (
    <Text>Please sign up or sign in!</Text>
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
  /** Card */
  card: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  cardWrapper: {
    paddingVertical: 16,
    borderTopWidth: 2,
    borderColor: "#e6e7e8",
  },
  cardImg: {
    width: 88,
    height: 88,
    borderRadius: 12,
    marginRight: 16,
  },
  cardBody: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingVertical: 4,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    color: "#222",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: -6,
  },
  cardRowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  cardRowItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#173153",
    marginLeft: 4,
  },
  cardPrice: {
    fontSize: 19,
    fontWeight: "700",
    color: "#173153",
  },
});
