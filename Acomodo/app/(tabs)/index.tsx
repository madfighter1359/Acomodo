import { StyleSheet, Text, View, Platform } from "react-native";
import React, { useState } from "react";
import Button from "../../components/Button";
import Counter from "../../components/Counter";
import DateTimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { router, useFocusEffect } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { getLocale } from "../../components/userSettings";

export default function book() {
  const DAY = 1000 * 86400;
  const OFFSET = new Date().getTimezoneOffset();
  const [people, setPeople] = useState(1);
  const [checkIn, setCheckIn] = useState(
    new Date(new Date(new Date().setHours(0, 0, 0, 0)).setMinutes(-OFFSET))
  );
  const [nights, setNights] = useState(1);
  const [checkOut, setcheckOut] = useState(new Date(checkIn.valueOf() + DAY));

  const locale = getLocale();

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    type: "in" | "out"
  ) => {
    console.log(selectedDate);
    if (selectedDate) {
      if (type === "in") {
        setCheckIn(selectedDate);
        if (checkOut <= selectedDate) {
          setcheckOut(new Date(selectedDate.valueOf() + DAY));
          setNights(1);
        } else {
          if (checkOut.getTime() - selectedDate.getTime() < DAY * 15) {
            setNights(
              Math.round((checkOut.valueOf() - selectedDate.valueOf()) / DAY)
            );
          } else {
            setcheckOut(new Date(selectedDate.valueOf() + DAY * 15));
            setNights(15);
          }
        }
      } else {
        setcheckOut(selectedDate);
        if (checkIn >= selectedDate) {
          setCheckIn(new Date(selectedDate.valueOf() - DAY));
          setNights(1);
        } else {
          if (selectedDate.valueOf() - checkIn.valueOf() < DAY * 15) {
            setNights(
              Math.round((selectedDate.valueOf() - checkIn.valueOf()) / DAY)
            );
          } else {
            setCheckIn(new Date(selectedDate.valueOf() - DAY * 15));
            setNights(15);
          }
        }
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
    <View style={styles.container}>
      <View style={styles.formItem}>
        <Text style={styles.formItemText}>How many people?</Text>
        <Counter
          inc={() => {
            if (people < 4) setPeople(people + 1);
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
            timeZoneName={"Europe/London"}
            minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
            themeVariant="light"
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
                timeZoneName: "Europe/London",
                minimumDate: new Date(new Date().setHours(0, 0, 0, 0)),
              });
            }}
          >
            {new Date(checkIn).toLocaleDateString(locale, {
              dateStyle: "medium",
            })}
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
            timeZoneName={"Europe/London"}
            minimumDate={new Date(new Date().setHours(22, 0, 0, 0))}
            themeVariant="light"
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
                timeZoneName: "Europe/London",
                minimumDate: new Date(new Date().setHours(24, 0, 0, 0)),
              });
            }}
          >
            {new Date(checkOut).toLocaleDateString(locale, {
              dateStyle: "medium",
            })}
          </Button>
        )}
      </View>

      <Button onPress={handleSearch} size="large">
        Next
      </Button>
    </View>
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
    padding: 20,
  },
  startDatePicker: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  formItem: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  formItemText: {
    fontSize: 25,
  },
});
