import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import SearchLocation from "../../components/api/SearchSpecificLocation";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import Loading from "../../components/Loading";
import Error from "../../components/Error";

// Need to get available room types
export default function RoomSelect() {
  const form = useLocalSearchParams();
  console.log(form);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<false | "user" | "other">(false);

  const [items, setItems] = useState<
    {
      img: string;
      type: string;
      capacity: string;
      checkIn: number;
      checkOut: number;
      price: number;
      available: number;
      typeId: string;
      beds: number;
    }[]
  >([]);

  const handleBook = (
    id: string,
    name: string,
    image: string,
    price: number,
    beds: number
  ) => {
    const params = {
      locationId: form.locationId,
      roomType: id,
      numberOfPeople: form.numberOfPeople,
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
      numberOfNights: form.numberOfNights,
      locationName: form.locationName,
      typeName: name,
      roomImage: image,
      totalPrice: price,
      beds: beds,
    };
    router.push({ pathname: "/confirm-booking", params: params });
  };

  useEffect(() => {
    SearchLocation({
      checkIn: Number(form.checkInDate),
      checkOut: Number(form.checkOutDate),
      people: Number(form.numberOfPeople),
      locId: form.locationId.toString(),
    }).then((res) => {
      if (res[0] == 200) {
        let results = [];
        const data = res[1];
        for (const key in data) {
          results.push({
            img: data[key].image,
            type: data[key].typeName,
            capacity: data[key].capacity,
            checkIn: +form.checkInDate,
            checkOut: +form.checkOutDate,
            price: data[key].price * Number(form.numberOfNights),
            available: data[key].available,
            typeId: key,
            beds: data[key].beds,
          });
        }
        results.sort((a, b) => a.price - b.price);
        setItems(results);
        setError(false);
      } else if (res[0] == 400) {
        setError("user");
      } else {
        setError("other");
      }
      setLoading(false);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <Loading />
      ) : error ? (
        <Error
          desc={
            error == "user"
              ? "There was an issue with the selected dates"
              : "There was an issue connecting to the server"
          }
        />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Rooms</Text>

          {items.map(
            (
              {
                img,
                type,
                capacity,
                checkIn,
                checkOut,
                price,
                available,
                typeId,
                beds,
              },
              index
            ) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    // handle onPress
                  }}
                >
                  <View style={styles.card}>
                    <Image
                      alt=""
                      resizeMode="cover"
                      source={{ uri: img }}
                      style={styles.cardImg}
                    />
                    <View style={styles.cardBody}>
                      <Text>
                        <Text style={styles.cardTitle}>{type}</Text>
                        {"\n"}
                        <Text style={styles.cardAirport}>{capacity} PERS</Text>
                      </Text>

                      <View style={styles.cardRow}>
                        <View style={styles.cardRowItem}>
                          <FontAwesome
                            color="#6f61c4"
                            name="right-to-bracket"
                            size={10}
                          />

                          <Text style={styles.cardRowItemText}>
                            {new Date(checkIn).toLocaleDateString("ro-RO", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </Text>
                        </View>

                        <View style={styles.cardRowItem}>
                          <FontAwesome
                            color="#6f61c4"
                            name="right-from-bracket"
                            size={10}
                          />

                          <Text style={styles.cardRowItemText}>
                            {new Date(checkOut).toLocaleDateString("ro-RO", {
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
                          {price.toLocaleString("ro-RO")}{" "}
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
                        <TouchableOpacity
                          onPress={() => {
                            handleBook(typeId, type, img, price, beds);
                          }}
                        >
                          <View style={styles.btn}>
                            <Text style={styles.btnText}>Book now</Text>
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
                                fontSize: 17,
                                fontWeight: "700",
                                color: "#173153",
                                paddingBottom: 0,
                              },
                            ]}
                          >
                            {available}
                          </Text>
                          <Text style={styles.cardAvailabilityText}>
                            available
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          )}
        </ScrollView>
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
    fontSize: 22,
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
});
