import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, useGlobalSearchParams } from "expo-router";
import { useSession } from "../../ctx";

export default function ConfirmBooking() {
  const form = useGlobalSearchParams();
  const { session } = useSession();
  console.log(form);
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      {session ? (
        <Text>
          {form.roomType} {"  "}
          {form.locationId}
        </Text>
      ) : (
        <View>
          <Text>Please sign in!</Text>
          <Link href="/sign-in">
            <Text style={{ fontSize: 25 }}>Sign in</Text>
          </Link>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
