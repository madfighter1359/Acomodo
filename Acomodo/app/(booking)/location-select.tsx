import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import SearchForRoom from "../../components/api/SearchLocations";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import { getLocale } from "../../components/userSettings";

export default function LocationSelect() {
  // Get search terms passed to screen
  const form = useLocalSearchParams();

  const locale = getLocale();

  // Empty state to store each result
  const [items, setItems] = useState<
    {
      img: string;
      name: string;
      rooms: number;
      location: string;
      cheapest: number;
      locationId: string;
    }[]
  >([]);

  // State variables to communicate if loading or error occurred
  const [error, setError] = useState<null | "user" | "other">(null);
  const [loading, setLoading] = useState(true);

  // Runs on load, makes the search and sets state with results
  useEffect(() => {
    SearchForRoom({
      checkIn: Number(form.checkInDate),
      checkOut: Number(form.checkOutDate),
      people: Number(form.numberOfPeople),
    }).then((res) => {
      if (res[0] == 200) {
        let results = [];
        const data = res[1];
        for (const key in data) {
          results.push({
            img: data[key].image,
            name: data[key].locationName,
            rooms: data[key].available,
            location: data[key].area,
            cheapest: data[key].cheapest,
            locationId: key,
          });
        }
        setItems(results);
        setError(null);
      } else if (res[0] == 400) {
        setError("user");
      } else {
        setError("other");
      }
      setLoading(false);
    });
  }, []);

  // Passes the location selection to the next screen
  const handleSelect = (id: string, name: string) => {
    const params = {
      locationId: id,
      numberOfPeople: form.numberOfPeople,
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
      numberOfNights: form.numberOfNights,
      locationName: name,
    };
    router.push({ pathname: "/room-select", params: params });
  };

  // Component template from https://withfra.me, purely for stylstic purposes (all functionality added by me)
  return (
    <View style={styles.main}>
      {loading ? (
        <Loading />
      ) : error ? (
        <Error
          desc={
            error == "user"
              ? "There was an issue with the selected dates"
              : "There was an issue connecting to the server"
          }
          resolution="Try again"
          action={() => router.back()}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Locations</Text>

          {
            // Formatting the output, taking each result and displaying it as a pressable tile
            items.map(
              ({ img, name, rooms, location, cheapest, locationId }, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.cardWrapper,
                      index === 0 && { borderTopWidth: 0 },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={
                        rooms > 0
                          ? () => handleSelect(locationId, name)
                          : undefined
                      }
                    >
                      <View style={{}}>
                        <Image
                          alt=""
                          resizeMode="cover"
                          source={{ uri: img }}
                          style={[
                            styles.cardImg,
                            rooms < 1 && { opacity: 0.2 },
                          ]}
                        />
                        <View style={styles.cardBody}>
                          <Text style={styles.cardTitle}>{name}</Text>

                          <View style={styles.cardRow}>
                            <View style={styles.cardRowItem}>
                              <FontAwesome
                                color="#173153"
                                name="bed"
                                size={13}
                              />

                              <Text style={styles.cardRowItemText}>
                                {rooms} rooms available
                              </Text>
                            </View>

                            <View style={styles.cardRowItem}>
                              <FontAwesome
                                color="#173153"
                                name="location-dot"
                                solid={true}
                                size={13}
                              />

                              <Text style={styles.cardRowItemText}>
                                {location}
                              </Text>
                            </View>
                          </View>

                          <Text style={styles.cardPrice}>
                            {rooms > 0
                              ? `from ${cheapest.toLocaleString(locale, {
                                  currency: "GBP",
                                  style: "currency",
                                  maximumFractionDigits: 0,
                                })} / night`
                              : "This location is full on the selected dates!"}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            )
          }
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  cardWrapper: {
    borderBottomWidth: 1,
    borderColor: "#e3e3e3",
    marginBottom: 16,
  },
  cardImg: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginRight: 16,
  },
  cardBody: {
    paddingVertical: 16,
  },
  cardTitle: {
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: -6,
    marginBottom: 8,
  },
  cardRowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  cardRowItemText: {
    fontSize: 17,
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
