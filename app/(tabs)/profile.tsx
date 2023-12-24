import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useSession } from "../../ctx";
import Button from "../../components/Button";
import { router } from "expo-router";

export default function Profile() {
  const { session, signOut, signIn } = useSession();
  return (
    <SafeAreaView style={styles.container}>
      {session ? (
        <>
          <Button
            onPress={() => {
              alert(session?.uid);
            }}
            size="medium"
            type="secondary"
          >
            User
          </Button>
          <Button
            onPress={() => {
              signOut();
              router.replace("/");
            }}
            size="medium"
            type="secondary"
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button
            onPress={() => router.push("/sign-in")}
            size="medium"
            type="secondary"
          >
            Sign In
          </Button>
          <Button
            size="medium"
            type="secondary"
            onPress={() => router.push("/sign-up")}
          >
            Sign Up
          </Button>
          <Button
            size="medium"
            type="secondary"
            onPress={() => {
              signIn("a@m.com", "aqwsderf");
              router.replace("/");
            }}
          >
            Sign In (Dev)
          </Button>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
