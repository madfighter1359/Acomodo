import {
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from "react-native";
import React from "react";
import { Link } from "expo-router";
import { useSession } from "../../ctx";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import axios from "axios";
import { useFocusEffect } from "expo-router";

export default function Index() {
  const { session, signOut } = useSession();
  const [refreshing, setRefreshing] = React.useState(false);

  const [loaded, setLoaded] = React.useState(false);

  const [data, setData] = React.useState("...");

  const getData = async () => {
    try {
      const url = "https://api.jsonbin.io/v3/b/659d88a8266cfc3fde74cc41";
      const headers = {
        "X-Master-Key":
          "$2a$10$bKGnyfpkW0yIN3/US.mr1O5di5EhgxF6J2T7L/mVCkVs10aCP1e2y",
      };
      const resp = await axios.get(url, { headers: headers });

      // const timestamp = new Date().getTime();
      // const response = await axios.get(
      //   `https://madfighter1359.github.io/alerts/data.json?timestamp=${timestamp}`
      // );
      return resp.data.record;
    } catch (e) {
      console.log(e);
      return {
        body: "Error loading data",
      };
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    setLoaded(false);
    updateData();
  }, []);

  const updateData = () => {
    getData().then((data) => {
      setData(data.body);
      if (!loaded) setLoaded(true);
    });
  };

  // const updateData = new Promise(() => {
  //   getData().then((data) => {
  //     setData(data.body);
  //     // if (!loaded) setLoaded(true);
  //   });
  // })

  React.useEffect(() => {
    updateData();
  }, []);

  useFocusEffect(() => setStatusBarStyle("dark"));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.scrollView}
      >
        <Text style={{ fontSize: 23 }}>{loaded ? data : "Loading..."}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "red",
  },
  scrollViewContent: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    //width: 200,
    //backgroundColor: "green",
    padding: 40,
  },
  scrollView: {
    flex: 1,
    //backgroundColor: "yellow",
    width: "100%",
  },
});
