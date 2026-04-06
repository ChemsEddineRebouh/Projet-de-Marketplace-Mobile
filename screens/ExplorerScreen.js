import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
  { name: "Mode", icon: "👗", count: "1.2k" },
  { name: "Maison", icon: "🏠", count: "850" },
  { name: "Tech", icon: "💻", count: "420" },
  { name: "Art", icon: "🎨", count: "310" },
  { name: "Bijoux", icon: "💍", count: "150" },
  { name: "Loisirs", icon: "🎸", count: "280" },
];

const TRENDING = ["Vase Céramique", "Veste 90s", "Montre Argent", "Vinyle Jazz", "Sneakers"];

export default function ExplorerScreen() {
  const [search, setSearch] = useState("");

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <View className="absolute top-0 w-full z-50 bg-white/90 dark:bg-neutral-900/90 pt-12 pb-4 px-6 border-b border-neutral-200 dark:border-neutral-800">
        <Text className="text-xl font-black tracking-tighter text-neutral-900 dark:text-white">Explorer</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 100, paddingBottom: 120, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <View className="flex-row items-center bg-neutral-200 dark:bg-neutral-800 rounded-2xl px-4 py-4">
            <Ionicons name="search" size={20} color="#737373" />
            <TextInput
              className="flex-1 ml-3 text-neutral-900 dark:text-white"
              placeholder="Rechercher par catégorie, marque..."
              placeholderTextColor="#737373"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        <View className="mb-10">
          <Text className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4 px-1">Catégories</Text>
          <View className="flex-row flex-wrap justify-between">
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.name}
                className="w-[48%] bg-white dark:bg-neutral-800 p-4 rounded-3xl shadow-sm flex-row items-center justify-between mb-4 active:scale-95"
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">{cat.icon}</Text>
                  <View>
                    <Text className="font-bold text-sm text-neutral-900 dark:text-white">{cat.name}</Text>
                    <Text className="text-[10px] text-neutral-500">{cat.count} articles</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#737373" />
              </Pressable>
            ))}
          </View>
        </View>

        <View className="mb-10">
          <Text className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4 px-1">Tendances</Text>
          <View className="flex-row flex-wrap gap-2">
            {TRENDING.map((tag) => (
              <Pressable
                key={tag}
                className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-full active:bg-emerald-500"
              >
                <Text className="text-xs font-bold text-neutral-900 dark:text-white">#{tag}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4 px-1">Inspirations du moment</Text>
          <View className="rounded-3xl overflow-hidden relative aspect-[16/9] shadow-sm">
            <Image
              source={{ uri: "https://picsum.photos/seed/explore/800/450" }}
              className="w-full h-full object-cover"
            />
            <View className="absolute inset-0 bg-black/20 justify-end p-6">
              <Text className="text-white font-black text-xl tracking-tight">Le Minimalisme Organique</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}