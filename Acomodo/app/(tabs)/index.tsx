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
import axios from "axios";

export default function Index() {
  const { session, signOut } = useSession();
  const [refreshing, setRefreshing] = React.useState(false);

  const [loaded, setLoaded] = React.useState(false);

  const [data, setData] = React.useState("");

  const getData = async () => {
    try {
      const response = await axios.get(
        "https://madfighter1359.github.io/alerts/data.json"
      );
      return response.data;
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
    updateData();
  }, []);

  const updateData = () => {
    getData().then((data) => {
      setData(data.body);
    });
  };

  React.useEffect(() => {
    updateData();
    setLoaded(true);
  }, []);

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
