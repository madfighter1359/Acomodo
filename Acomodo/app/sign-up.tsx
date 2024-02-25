import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useSession } from "../ctx";
import DateTimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import Button from "../components/Button";
import { FontAwesome } from "@expo/vector-icons";
import Loading from "../components/Loading";

export default function SignUp() {
  const { signUp, session } = useSession();
  if (session) router.back();

  const params = useLocalSearchParams<{
    email: string;
    // prevRoute?: string;
    // prevParams?: string;
  }>();

  const [form, setForm] = useState({
    fullname: "",
    email: params.email ? params.email : "",
    docNr: "",
    dob: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    password: "",
    confirmPassword: "",
  });

  const [loaded, setLoaded] = useState(true);

  const handleSignUp = async () => {
    if (
      form.email &&
      form.password &&
      form.fullname &&
      form.docNr &&
      form.dob
    ) {
      if (form.password.length < 6) {
        Alert.alert(
          "Your password is too weak. Please use at least six characters",
          "",
          [
            {
              text: "Retry",
            },
          ]
        );
        return;
      }
      if (form.password === form.confirmPassword) {
        console.log("Signing up");

        setLoaded(false);

        const res = await signUp(
          form.email,
          form.password,
          form.fullname,
          form.docNr,
          form.dob
        );

        setLoaded(true);

        console.log(res);

        if (res === true) {
          router.back();
          Alert.alert("Account created succesfully!");
        } else {
          switch (res) {
            case "auth/weak-password":
              Alert.alert(
                "Sign up error",
                "Your password is too weak. Please use at least six characters",
                [
                  {
                    text: "Retry",
                  },
                ]
              );
              break;
            case "auth/invalid-email":
              Alert.alert(
                "Sign up error",
                "Your email address is invalid. Please try again",
                [
                  {
                    text: "Retry",
                  },
                ]
              );
              break;
            case "auth/email-already-in-use":
              Alert.alert(
                "Sign up error",
                "Your email address is already in use. Please sign in or use a different email",
                [
                  {
                    text: "Sign in",
                    onPress: () =>
                      router.navigate({
                        pathname: "/sign-in",
                        params: { email: form.email },
                      }),
                  },
                  {
                    text: "Retry",
                  },
                ]
              );
              break;
            default:
              Alert.alert(
                "Sign up error",
                "There was an unkown error signing up. Please check your details or try again later",
                [
                  {
                    text: "Try again",
                  },
                ]
              );
          }
        }
      } else {
        alert("Passwords must match!");
      }
    } else {
      alert("Please input all the required details!");
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

  if (!loaded) return <Loading />;

  return (
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
                themeVariant="light"
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
                {form.dob.toUTCString()}
              </Button>
            )}
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Personal document number</Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onChangeText={(docNr) => setForm({ ...form, docNr })}
              placeholder="12345678ABC"
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
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 24,
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
