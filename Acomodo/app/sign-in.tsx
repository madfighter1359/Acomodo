import React, {
  LegacyRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useSession } from "../ctx";
import {
  router,
  Link,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router";
import Loading from "../components/Loading";

export default function SignIn() {
  const { signIn, session } = useSession();
  useEffect(() => {
    if (session) router.back();
  });

  const [loaded, setLoaded] = useState(true);

  const params = useLocalSearchParams<{
    email: string;
    // prevRoute?: string;
    // prevParams?: string;
  }>();

  const [form, setForm] = useState({
    email: params.email ? params.email : "",
    password: "",
  });

  const handleSignIn = async () => {
    if (form.email && form.password) {
      console.log("Signing in");

      setLoaded(false);

      const res = await signIn(form.email, form.password);

      setLoaded(true);

      if (res === true) {
        // if (params.prevRoute) {
        //   if (params.prevParams) {
        //     router.navigate({
        //       pathname: params.prevRoute,
        //       params: JSON.parse(params.prevParams),
        //     });
        //   } else router.navigate(params.prevRoute);
        // } else {
        //   router.navigate("/");
        // }
        router.back();
        Alert.alert("Succesfully signed in!");
      } else {
        switch (res) {
          case "auth/invalid-credential":
            Alert.alert(
              "Sign in error",
              "Your email or password are incorrect. Please try again or sign up now!",
              [
                {
                  text: "Try again",
                },
                {
                  text: "Sign up",
                  onPress: () =>
                    router.navigate({
                      pathname: "/sign-up",
                      params: { email: form.email },
                    }),
                },
              ]
            );
            break;
          case "auth/invalid-email":
            Alert.alert(
              "Sign in error",
              "Your email address is invalid. Please try again",
              [
                {
                  text: "Try again",
                },
              ]
            );
            break;
          default:
            Alert.alert(
              "Sign in error",
              "An unkown error occured. Please try again",
              [
                {
                  text: "Try again",
                },
              ]
            );
        }
      }
    } else {
      alert("Please input an email and password!");
    }
  };

  if (!loaded) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back!</Text>

          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
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
            <Text style={styles.inputLabel}>Password</Text>

            <TextInput
              autoCorrect={false}
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="●●●●●●●●"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password}
            />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleSignIn}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign in</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Link href={"/sign-up"}>
            <Text style={styles.formFooter}>
              Don't have an account?{" "}
              <Text style={{ textDecorationLine: "underline" }}>Sign up</Text>
            </Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    marginVertical: 36,
  },
  form: {
    marginBottom: 24,
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#1d1d1d",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
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
});
