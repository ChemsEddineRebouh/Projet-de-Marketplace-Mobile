import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomNav({ state, navigation }) {
  const navItems = [
    { name: "Home", icon: "home", label: "Accueil" },
    { name: "CreatePost", icon: "add-circle", label: "Vendre" },
    { name: "Messages", icon: "chatbubble", label: "Messages" },
    { name: "Profile", icon: "person", label: "Profil" },
  ];

  return (
    <View className="absolute bottom-0 w-full flex-row justify-around items-center px-4 pb-8 pt-4 bg-white/90 dark:bg-neutral-900/90 rounded-t-[2.5rem] shadow-lg border-t border-neutral-200 dark:border-neutral-800">
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const item = navItems.find((i) => i.name === route.name);

        if (!item) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className="flex-col items-center"
          >
            <Ionicons
              name={isFocused ? item.icon : `${item.icon}-outline`}
              size={24}
              color={isFocused ? "#10b981" : "#737373"}
            />
            <Text
              className={`text-[10px] font-bold uppercase mt-1 ${
                isFocused ? "text-emerald-500" : "text-neutral-500"
              }`}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}