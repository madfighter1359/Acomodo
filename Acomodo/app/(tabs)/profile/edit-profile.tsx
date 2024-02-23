import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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

export default function EditProfile() {
  const handleDelete = async (pass?: string) => {
    if (pass == "" || !pass) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      if (auth.currentUser?.email) {
        try {
          await signInWithEmailAndPassword(auth, auth.currentUser.email, pass);
          await auth.currentUser.delete();
          router.navigate("/profile");
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
      }
    }
  };

  const bottomSheetRef = useRef<bottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    setPassword("");
  }, []);

  const [password, setPassword] = useState("");

  return (
    <GestureHandlerRootView style={styles.container}>
      <PrimaryButton size="large" onPress={() => handleDelete()}>
        Delete account
      </PrimaryButton>
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
              placeholder="********"
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
    width: Dimensions.get("window").width / 1.2,
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
});
