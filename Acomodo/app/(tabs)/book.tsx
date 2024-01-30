import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Button from "../../components/Button";
import Counter from "../../components/Counter";
import DateTimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import DatePicker from "react-multi-date-picker";
import { router } from "expo-router";

export default function book() {
  const DAY = 1000 * 86400;
  const [people, setPeople] = useState(1);
  const [checkIn, setCheckIn] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [nights, setNights] = useState(1);
  const [checkOut, setcheckOut] = useState(new Date(checkIn.valueOf() + DAY));

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    type: "in" | "out"
  ) => {
    if (selectedDate) {
      if (type === "in") {
        setCheckIn(selectedDate);
        if (checkOut <= selectedDate) {
          setcheckOut(new Date(selectedDate.valueOf() + DAY));
          setNights(1);
        } else
          setNights(
            Math.round((checkOut.valueOf() - selectedDate.valueOf()) / DAY)
          );
      } else {
        setcheckOut(selectedDate);
        if (checkIn >= selectedDate) {
          setCheckIn(new Date(selectedDate.valueOf() - DAY));
          setNights(1);
        } else
          setNights(
            Math.round((selectedDate.valueOf() - checkIn.valueOf()) / DAY)
          );
      }
    }
  };

  const handleSearch = () => {
    const form = {
      checkInDate: checkIn.valueOf(),
      checkOutDate: checkOut.valueOf(),
      numberOfPeople: people,
      numberOfNights: nights,
    };
    router.push({ pathname: "/location-select", params: form });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formItem}>
        <Text style={styles.formItemText}>How many people?</Text>
        <Counter
          inc={() => {
            if (people < 8) setPeople(people + 1);
          }}
          dec={() => {
            if (people > 1) setPeople(people - 1);
          }}
          value={people}
        ></Counter>
      </View>
      <View style={styles.formItem}>
        <Text style={styles.formItemText}>Check in</Text>
        {Platform.OS === "ios" ? (
          <DateTimePicker
            testID="dateTimePicker"
            value={checkIn}
            mode="date"
            onChange={(event, selectedDate) =>
              onChange(event, selectedDate, "in")
            }
          />
        ) : (
          <Button
            size="medium"
            onPress={() => {
              DateTimePickerAndroid.open({
                testID: "dateTimePicker",
                value: checkIn,
                mode: "date",
                onChange: (event, selectedDate) =>
                  onChange(event, selectedDate, "in"),
              });
            }}
          >
            {checkIn.toString()}
          </Button>
        )}
      </View>
      <View style={styles.formItem}>
        <Text style={styles.formItemText}>How many nights?</Text>
        <Counter
          inc={() => {
            if (nights < 15) {
              setNights(nights + 1);
              setcheckOut(
                new Date(checkIn.valueOf() + (nights + 1) * 86400 * 1000)
              );
            }
          }}
          dec={() => {
            if (nights > 1) {
              setNights(nights - 1);
              setcheckOut(
                new Date(checkIn.valueOf() + (nights - 1) * 86400 * 1000)
              );
            }
          }}
          value={nights}
        ></Counter>
      </View>
      <View style={styles.formItem}>
        <Text style={styles.formItemText}>Check out</Text>
        {Platform.OS === "ios" ? (
          <DateTimePicker
            testID="dateTimePicker"
            value={checkOut}
            mode="date"
            onChange={(event, selectedDate) =>
              onChange(event, selectedDate, "out")
            }
          />
        ) : (
          <Button
            size="medium"
            onPress={() => {
              DateTimePickerAndroid.open({
                testID: "dateTimePicker",
                value: checkOut,
                mode: "date",
                onChange: (event, selectedDate) =>
                  onChange(event, selectedDate, "out"),
              });
            }}
          >
            {checkOut.toString()}
          </Button>
        )}
      </View>

      <Button onPress={handleSearch} size="large">
        Next
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  peopleCounter: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "green",
    padding: 20,
  },
  startDatePicker: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "green",
    padding: 20,
  },
  formItem: {
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: "green",
    padding: 20,
  },
  formItemText: {
    fontSize: 25,
  },
});
