import { Pressable, StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import { useLocalSearchParams, useGlobalSearchParams } from "expo-router";
import CardView from "../../components/CardView";
import SearchForRoom from "../../components/SearchForRoom";
import axios from "axios";

type FormProps = {
  checkInDate: string;
  checkOutDate: string;
  numberOfPeople: string;
  numberOfNights: string;
};

export default function LocationSelect() {
  const form = useGlobalSearchParams();
  console.log(form);

  return (
    <SafeAreaView>
      <Text>Nights:{form.numberOfNights}</Text>
      <Pressable
        onPress={() =>
          SearchForRoom({
            checkIn: Number(form.checkInDate),
            checkOut: Number(form.checkOutDate),
            people: Number(form.numberOfPeople),
          })
        }
      >
        <Text style={{ fontSize: 20 }}>Press</Text>
      </Pressable>
      <CardView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
