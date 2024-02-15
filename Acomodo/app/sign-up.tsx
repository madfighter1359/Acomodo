import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Link, router } from "expo-router";
import { useSession } from "../ctx";
import DateTimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import Button from "../components/Button";

export default function SignUp() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    docNr: "",
    dob: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    password: "",
    confirmPassword: "",
  });

  const { signUp } = useSession();

  const handleSignUp = () => {
    if (
      form.email &&
      form.password &&
      form.fullname &&
      form.docNr &&
      form.dob
    ) {
      if (form.password === form.confirmPassword) {
        console.log("Signing up");

        signUp(form.email, form.password, form.fullname, form.docNr, form.dob);

        router.back();
      } else {
        alert("Passwords must match!");
      }
    } else {
      alert("Please input an email and password!");
    }
  };

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (selectedDate) {
      // set
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Getting Started</Text>

          <Text style={styles.subtitle}>Create an account to continue</Text>
        </View>

        <KeyboardAwareScrollView>
          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Full name</Text>

              <TextInput
                onChangeText={(fullname) => setForm({ ...form, fullname })}
                placeholder="John Doe"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.fullname}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email address</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={(email) => setForm({ ...form, email })}
                placeholder="john@example.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Date of birth</Text>

              {Platform.OS === "ios" ? (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={form.dob}
                  mode="date"
                  onChange={(event, dob) =>
                    // onChange(event, selectedDate)
                    {
                      if (dob) setForm({ ...form, dob });
                    }
                  }
                  timeZoneName={"UTC"}
                  maximumDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18)
                    )
                  }
                  style={styles.datePicker}
                />
              ) : (
                <Button
                  size="medium"
                  onPress={() => {
                    DateTimePickerAndroid.open({
                      testID: "dateTimePicker",
                      value: form.dob,
                      mode: "date",
                      onChange: (event, dob) => {
                        if (dob) setForm({ ...form, dob });
                      },
                      timeZoneName: "UTC",
                      maximumDate: new Date(
                        new Date().setFullYear(new Date().getFullYear() - 18)
                      ),
                    });
                  }}
                >
                  {form.dob.toString()}
                </Button>
              )}
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Personal document number</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                onChangeText={(docNr) => setForm({ ...form, docNr })}
                placeholder="12345678"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.docNr}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>

              <TextInput
                autoCorrect={false}
                onChangeText={(password) => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Confirm Password</Text>

              <TextInput
                autoCorrect={false}
                onChangeText={(confirmPassword) =>
                  setForm({ ...form, confirmPassword })
                }
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.confirmPassword}
              />
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleSignUp}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Sign up</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Link href="/sign-in" replace={false}>
              <Text style={styles.formFooter}>
                Already have an account?{" "}
                <Text style={{ textDecorationLine: "underline" }}>Sign in</Text>
              </Text>
            </Link>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    marginVertical: 24,
    paddingHorizontal: 24,
  },
  form: {
    paddingHorizontal: 24,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    textAlign: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1d1d1d",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#929292",
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#007aff",
    borderColor: "#007aff",
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },
  datePicker: {
    marginRight: "auto",
  },
});
