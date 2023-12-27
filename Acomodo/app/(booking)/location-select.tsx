import { Pressable, StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import { useLocalSearchParams, useGlobalSearchParams } from "expo-router";
import CardView from "../../components/CardView";

export default function LocationSelect() {
  const form = useGlobalSearchParams();
  console.log(form);
  return (
    <SafeAreaView>
      <Text>Nights:{form.numberOfNights}</Text>
      <Pressable onPress={() => console.log(form)}>
        <Text>l</Text>
      </Pressable>
      <CardView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
