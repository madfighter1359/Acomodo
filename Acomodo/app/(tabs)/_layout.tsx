import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome6";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="house" color={color} size={size * 0.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: "Book",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="suitcase" color={color} size={size * 0.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" solid color={color} size={size * 0.7} />
          ),
          // tabBarIcon: ({ focused, color, size }) => {
          //   return focused ? (
          //     <FontAwesome name="user" solid color={color} size={size * 0.7} />
          //   ) : (
          //     <FontAwesome name="user" color={color} size={size * 0.7} />
          //   );
          // },
        }}
      />
    </Tabs>
  );
}
