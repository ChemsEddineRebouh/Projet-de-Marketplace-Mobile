import React from "react";
import { View, Text, Pressable } from "react-native";

export default function PostComponent({ title, city, price, creator_id, usernamesById, onPress, }) {
  const author = usernamesById?.[creator_id];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="relative w-full p-4 mb-3 rounded-2xl border border-neutral-200 bg-white shadow-sm
                 active:bg-neutral-50
                 dark:bg-neutral-800 dark:border-neutral-700 dark:active:bg-neutral-700"
      android_ripple={{ color: "rgba(0,0,0,0.06)" }}
      hitSlop={6}
    >
      <View className="flex-row items-start justify-between">
        <Text className="flex-1 pr-3 text-base font-semibold text-neutral-900 dark:text-white">
          {title}
        </Text>
        <Text
          className="px-2.5 py-1 rounded-full text-xs font-semibold
                         bg-blue-50 text-blue-700
                         dark:bg-blue-400/10 dark:text-blue-300"
        >
          {price}$
        </Text>
      </View>

      <View className="mt-2 flex-row flex-wrap items-center gap-2">
        <Text
          className="px-2 py-0.5 rounded-full text-xs
                         bg-neutral-100 text-neutral-700
                         dark:bg-neutral-700 dark:text-neutral-200"
        >
          {city}
        </Text>

        {!!author && (
          <Text className="text-xs text-neutral-500 dark:text-neutral-400">
            par <Text className="font-medium">{author}</Text>
          </Text>
        )}
      </View>

      <Text className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 dark:text-neutral-500">
        ›
      </Text>
    </Pressable>
  );
}
