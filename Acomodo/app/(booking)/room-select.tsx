import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import SearchLocation from "../../components/api/SearchSpecificLocation";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import { getLocale } from "../../components/userSettings";

export default function RoomSelect() {
  const form = useLocalSearchParams();

  // Get global user locale for formatting dates and prices
  const locale = getLocale();

  // Loading and error state variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<false | "user" | "other">(false);

  // Empty list of type "room"
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

  // Takes in the selected room and passes it to the next screen for detail review
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

  // Requests detailed information for the selected location from the server when the component mounts,
  // using the form data from the previous screen
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

  // Component template from https://withfra.me, purely for stylstic purposes (all functionality added by me)
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
            // Formatting the output, taking each result and displaying it as a pressable tile
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
                    handleBook(typeId, type, img, price, beds);
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
                        <Text style={styles.cardPers}>{capacity} PERS</Text>
                      </Text>

                      <View style={styles.cardRow}>
                        <View style={styles.cardRowItem}>
                          <FontAwesome
                            color="#6f61c4"
                            name="right-to-bracket"
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
                            name="right-from-bracket"
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
                        <Text style={styles.cardPriceCurrency}>
                          {(0)
                            .toLocaleString("en-GB", {
                              style: "currency",
                              currency: "GBP",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })
                            .replace(/\d/g, "")
                            .trim()}
                        </Text>
                        <Text style={styles.cardPriceValue}>
                          {price.toLocaleString(locale)}{" "}
                        </Text>
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
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
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#173153",
    marginRight: 8,
  },
  cardPers: {
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
