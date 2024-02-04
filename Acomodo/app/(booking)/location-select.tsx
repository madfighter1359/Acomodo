import {
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import SearchForRoom from "../../components/SearchForRoom";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";

export default function LocationSelect() {
  // Get search terms passed to screen
  const form = useLocalSearchParams();
  console.log(form);

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

  // Runs on load, makes the search and sets state with results
  useEffect(() => {
    SearchForRoom({
      checkIn: Number(form.checkInDate),
      checkOut: Number(form.checkOutDate),
      people: Number(form.numberOfPeople),
    }).then((data) => {
      let results = [];
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

  return (
    <SafeAreaView>
      {/* <Pressable
        onPress={() =>
          SearchForRoom({
            checkIn: Number(form.checkInDate),
            checkOut: Number(form.checkOutDate),
            people: Number(form.numberOfPeople),
          })
        }
      >
        <Text style={{ fontSize: 20 }}>Press</Text>
      </Pressable> */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Locations</Text>

        {items.map(
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
                  onPress={() => handleSelect(locationId, name)}
                >
                  <View style={{}}>
                    <Image
                      alt=""
                      resizeMode="cover"
                      source={{ uri: img }}
                      style={styles.cardImg}
                    />

                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>{name}</Text>

                      <View style={styles.cardRow}>
                        <View style={styles.cardRowItem}>
                          <FontAwesome color="#173153" name="bed" size={13} />

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

                          <Text style={styles.cardRowItemText}>{location}</Text>
                        </View>
                      </View>

                      <Text style={styles.cardPrice}>
                        from {cheapest.toLocaleString("ro-RO")}RON / night
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }
        )}
      </ScrollView>
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
