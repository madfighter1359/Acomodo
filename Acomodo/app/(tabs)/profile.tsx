import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useSession } from "../../ctx";
import Button from "../../components/Button";
import { router } from "expo-router";
import { auth } from "../../firebase-config";
import NewGuest from "../../components/api/NewGuest";

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
          <Button
            onPress={() => {
              auth.currentUser
                ?.getIdToken(true)
                .then((token) => console.log(token));
            }}
            size="medium"
            type="secondary"
          >
            Token
          </Button>
          <Button
            onPress={() => {
              auth.currentUser?.getIdToken(true).then((token) =>
                NewGuest({
                  token: token,
                  guestName: "Testy Amith",
                  guestDoB: 1646179200000,
                  guestDocNr: "120923",
                  email: "s@s.com",
                })
              );
            }}
            size="medium"
            type="secondary"
          >
            Register
          </Button>
        </>
      ) : (
        <>
          <Button
            onPress={() => router.push("/sign-in")}
            size="medium"
            type="primary"
          >
            Sign In
          </Button>
          <Button
            size="medium"
            type="primary"
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
