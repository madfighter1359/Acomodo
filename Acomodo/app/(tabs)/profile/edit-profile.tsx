import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Stack, Tabs, router } from "expo-router";
import PrimaryButton from "../../../components/Button";
import { auth } from "../../../firebase-config";
import { FirebaseError } from "firebase/app";
import {
  AuthCredential,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet/";
import bottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet";
import { useSession } from "../../../ctx";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useHeaderHeight } from "@react-navigation/elements";
import Loading from "../../../components/Loading";

export default function EditProfile() {
  const [loaded, setLoaded] = useState(true);

  const handleDelete = async (pass?: string) => {
    if (pass == "" || !pass) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      if (auth.currentUser?.email) {
        setLoaded(false);
        try {
          await signInWithEmailAndPassword(auth, auth.currentUser.email, pass);
          await auth.currentUser.delete();
          router.navigate("/profile");
          Alert.alert("Account deleted successfully!");
        } catch (e) {
          if (e instanceof FirebaseError) {
            console.log(e.code);
            if (e.code == "auth/invalid-credential") {
              Alert.alert("Erorr", "The password you entered was incorred", [
                { text: "Try again" },
              ]);
            } else if (e.code == "auth/too-many-requests") {
              Alert.alert(
                "Erorr",
                "Too many requests, please try again later",
                [{ text: "Close" }]
              );
            } else {
              Alert.alert("Erorr", "An unkown error occurred", [
                { text: "Close" },
              ]);
            }
          } else
            Alert.alert("Erorr", "An unkown error occurred", [
              { text: "Close" },
            ]);
        }
        setLoaded(true);
      }
    }
  };

  const bottomSheetRef = useRef<bottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    setPassword("");
  }, []);

  const [password, setPassword] = useState("");

  const headerHeight = useHeaderHeight();

  if (!loaded) return <Loading />;

  return (
    <GestureHandlerRootView
      style={[styles.container, { marginTop: headerHeight }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { paddingTop: 4 }]}>
          <Text style={styles.sectionTitle}>Edit Account</Text>
          <View style={styles.sectionBody}>
            <View
              style={[
                styles.rowWrapper,
                styles.rowFirst,
                styles.rowLast,
                { alignItems: "center" },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleDelete()}
                style={styles.row}
              >
                <Text style={[styles.rowLabel, styles.rowLabelSign]}>
                  Delete account
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View
              style={[
                styles.rowWrapper,
                styles.rowLast,
                { alignItems: "center" },
              ]}
            >
              <TouchableOpacity
                onPress={() => router.push("/sign-up")}
                style={styles.row}
              >
                <Text style={[styles.rowLabel, styles.rowLabelSign]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ display: "none" }}
      >
        <Pressable
          onPress={() => bottomSheetRef.current?.close()}
          style={{ marginLeft: "auto" }}
        >
          <Text
            style={{
              alignSelf: "flex-start",
              marginLeft: "auto",
              paddingRight: 22,
              color: "#0569FF",
              fontSize: 16,
            }}
          >
            Cancel
          </Text>
        </Pressable>

        <View style={styles.container}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>
              Please re-enter your password if you are sure you wish to delete
              your account
            </Text>
            <BottomSheetTextInput
              autoCorrect={false}
              onChangeText={(password) => setPassword(password)}
              placeholder="●●●●●●●●"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={password}
            />
          </View>
          <PrimaryButton
            size="large"
            onPress={() => handleDelete(password)}
            color="#D22B2B"
          >
            Confirm delete
          </PrimaryButton>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  input: {
    marginBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
    paddingVertical: 10,
    // padding: 10,
    textAlign: "center",
    // width: Dimensions.get("window").width,
    // backgroundColor: "green",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#000",
  },
  /** Content */
  content: {
    paddingHorizontal: 16,
  },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    color: "#a69f9f",
  },
  /** Section */
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: "500",
    color: "#a69f9f",
    textTransform: "uppercase",
  },
  sectionBody: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  /** Profile */
  profile: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    marginRight: 12,
  },
  profileBody: {
    marginRight: "auto",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#292929",
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "400",
    color: "#858585",
  },
  /** Row */
  row: {
    height: 44,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    fontSize: 16,
    letterSpacing: 0.24,
    color: "#000",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ababab",
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowLabelLogout: {
    width: "100%",
    textAlign: "center",
    fontWeight: "600",
    color: "#dc2626",
  },
  rowLabelSign: {
    width: "100%",
    textAlign: "center",
    fontWeight: "600",
    color: "#dc2626",
  },
});
