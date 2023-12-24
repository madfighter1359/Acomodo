import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Button from "../../components/Button";
import Counter from "../../components/Counter";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import DatePicker from "react-multi-date-picker";

export default function book() {
  const [people, setPeople] = useState(0);
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState(new Date(1598051730000));

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Booking</Text>
      <Counter
        inc={() => setPeople(people + 1)}
        dec={() => setPeople(people - 1)}
        value={people}
      ></Counter>

      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode="date"
        onChange={onChange}
      />
      <Button onPress={() => alert(people)} size="small">
        Count
      </Button>
      {/* <DatePicker
        value={date}
        onChange={(date: Date | null) => setDate(date)}
      /> */}
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
