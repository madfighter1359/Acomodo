import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

interface Props {
  checkIn: number;
  checkOut: number;
  nights: number;
  people: number;
}

const items = [
  {
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
    address: "Acomodoro Pipera",
    bedrooms: 4,
    sqft: 1250,
    price: 300,
  },
  {
    img: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    address: "Acomodoro Dristor",
    bedrooms: 2,
    sqft: 800,
    price: 100,
  },
];

export default function CardView() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Locations</Text>

      {items.map(({ img, address, bedrooms, sqft, price }, index) => {
        return (
          <View
            key={index}
            style={[styles.cardWrapper, index === 0 && { borderTopWidth: 0 }]}
          >
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
            >
              <View style={{}}>
                <Image
                  alt=""
                  resizeMode="cover"
                  source={{ uri: img }}
                  style={styles.cardImg}
                />

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{address}</Text>

                  <View style={styles.cardRow}>
                    <View style={styles.cardRowItem}>
                      <FontAwesome color="#173153" name="bed" size={13} />

                      <Text style={styles.cardRowItemText}>
                        {bedrooms} Bedrooms
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
                        {sqft.toLocaleString("en-US")} sqft
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardPrice}>
                    from {price.toLocaleString("ro-RO")}RON / night
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
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
