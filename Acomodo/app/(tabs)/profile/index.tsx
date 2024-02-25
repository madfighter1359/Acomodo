import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useSession } from "../../../ctx";
// import Button from "../../components/Button";
import { router } from "expo-router";
// import { auth } from "../../firebase-config";
// import NewGuest from "../../components/api/NewGuest";
// import Example from "../../components/Settings";
// import Settings from "../../components/Settings2";
import { ScrollView, TouchableOpacity, Switch, Image } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSettingsStore } from "../../../components/userSettings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeData } from "../../../components/store";

export default function Profile() {
  const { session, signOut, signIn } = useSession();
  const [darkMode, setDarkMode] = useState(false);

  const setLocaleGlobal = useSettingsStore((state) => state.setLocale);
  const getLocaleGlobal = useSettingsStore((state) => state.locale);

  const [locale, setLocale] = useState(getLocaleGlobal);

  const handleChangeLanguage = () => {
    // console.log(useSettingsStore((state) => state.locale));
    if (locale == "ro-RO") {
      setLocaleGlobal("en-GB");
      setLocale("en-GB");
    } else {
      setLocaleGlobal("ro-RO");
      setLocale("ro-RO");
    }
  };

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
                {/* <Image
                  alt=""
                  source={{
                    uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
                  }}
                  style={styles.profileAvatar}
                /> */}
                <FontAwesome6 name="user" size={32} style={{ padding: 13 }} />

                <View style={styles.profileBody}>
                  <Text style={styles.profileName}>{session.displayName}</Text>

                  <Text style={styles.profileHandle}>{session.email}</Text>
                </View>

                <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
              </TouchableOpacity>
            ) : (
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
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}
              >
                <Text style={styles.rowLabel}>Language</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>English</Text>

                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={handleChangeLanguage}
                style={styles.row}
              >
                <Text style={styles.rowLabel}>Region</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>
                  {(() => {
                    switch (locale) {
                      case "en-GB":
                        return "United Kingdom";
                      case "ro-RO":
                        return "Romania";
                      default:
                        return "Unkown";
                    }
                  })()}
                </Text>

                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>

            <View style={[styles.rowWrapper, styles.rowLast]}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Dark mode</Text>

                <View style={styles.rowSpacer} />

                <Switch
                  onValueChange={(darkMode) => setDarkMode(darkMode)}
                  style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                  value={darkMode}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>

          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("mailto:support@acomodo.com");
                }}
                style={styles.row}
              >
                <Text style={styles.rowLabel}>Contact Us</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}
              >
                <Text style={styles.rowLabel}>Rate the Hotels</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>

            <View style={[styles.rowWrapper, styles.rowLast]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}
              >
                <Text style={styles.rowLabel}>Terms and Privacy</Text>

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
                    signOut();
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
  /** Header */
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
    color: "#2b64e3",
  },
});
