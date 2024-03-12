import { Alert, Linking, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useSession } from "../../../ctx";
import { router } from "expo-router";
import { ScrollView, TouchableOpacity, Switch } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSettingsStore, getLocale } from "../../../components/userSettings";

export default function Profile() {
  const { session, signOut } = useSession();
  const setLocaleGlobal = useSettingsStore((state) => state.setLocale);
  const [locale, setLocale] = useState(getLocale());

  // Functionality for switching region
  const handleChangeRegion = () => {
    if (locale == "ro-RO") {
      setLocaleGlobal("en-GB");
      setLocale("en-GB");
    } else {
      setLocaleGlobal("ro-RO");
      setLocale("ro-RO");
    }
  };

  // Component template from https://withfra.me, purely for stylstic purposes (all functionality added by me)
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { paddingTop: 4 }]}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.sectionBody}>
            {session ? (
              <TouchableOpacity
                onPress={() => {
                  router.push("/(tabs)/profile/edit-profile");
                }}
                style={styles.profile}
              >
                <FontAwesome6 name="user" size={32} style={{ padding: 13 }} />

                <View style={styles.profileBody}>
                  <Text style={styles.profileName}>{session.displayName}</Text>

                  <Text style={styles.profileHandle}>{session.email}</Text>
                </View>

                <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
              </TouchableOpacity>
            ) : (
              // Display authentication buttons if not signed in
              <>
                <View
                  style={[
                    styles.rowWrapper,
                    styles.rowFirst,
                    { alignItems: "center" },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => router.push("/sign-in")}
                    style={styles.row}
                  >
                    <Text style={[styles.rowLabel, styles.rowLabelSign]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
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
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst, styles.rowLast]}>
              <TouchableOpacity onPress={handleChangeRegion} style={styles.row}>
                <Text style={styles.rowLabel}>Region</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>
                  {
                    // Formats locale
                    (() => {
                      switch (locale) {
                        case "en-GB":
                          return "United Kingdom";
                        case "ro-RO":
                          return "Romania";
                        default:
                          return "Unkown";
                      }
                    })()
                  }
                </Text>

                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>

          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst, styles.rowLast]}>
              <TouchableOpacity
                onPress={() => {
                  // Opens support email template
                  Linking.openURL("mailto:support@acomodo.com");
                }}
                style={styles.row}
              >
                <Text style={styles.rowLabel}>Contact Us</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {session && (
          <View style={styles.section}>
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
                  onPress={() => {
                    // Handles log out
                    signOut();
                    Alert.alert("Successfully logged out!");
                  }}
                  style={styles.row}
                >
                  <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                    Log Out
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <Text style={styles.contentFooter}>App Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
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
    color: "#2b64e3",
  },
});
