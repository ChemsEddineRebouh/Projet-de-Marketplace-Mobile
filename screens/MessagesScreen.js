import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Image, ScrollView } from "react-native";
import { auth, db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function MessagesScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", uid),
      orderBy("updatedAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setChats(list);
    });

    return () => unsub();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } else if (diffDays === 1) {
      return "Hier";
    } else {
      const months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
      return `${date.getDate()} ${months[date.getMonth()]}`;
    }
  };

  const ListHeader = () => (
    <View className="mb-4">
      <Text className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">Messages</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
        <Pressable 
          onPress={() => setFilter("all")}
          className={`px-5 py-2.5 rounded-full mr-3 flex-row items-center justify-center ${filter === "all" ? "bg-emerald-500" : "bg-neutral-200 dark:bg-neutral-800"}`}
        >
          <Text className={`text-sm font-semibold ${filter === "all" ? "text-white" : "text-neutral-600 dark:text-neutral-400"}`}>Tout</Text>
        </Pressable>
        <Pressable 
          onPress={() => setFilter("ventes")}
          className={`px-5 py-2.5 rounded-full mr-3 flex-row items-center justify-center ${filter === "ventes" ? "bg-emerald-500" : "bg-neutral-200 dark:bg-neutral-800"}`}
        >
          <Text className={`text-sm font-semibold ${filter === "ventes" ? "text-white" : "text-neutral-600 dark:text-neutral-400"}`}>Ventes</Text>
        </Pressable>
        <Pressable 
          onPress={() => setFilter("achats")}
          className={`px-5 py-2.5 rounded-full mr-3 flex-row items-center justify-center ${filter === "achats" ? "bg-emerald-500" : "bg-neutral-200 dark:bg-neutral-800"}`}
        >
          <Text className={`text-sm font-semibold ${filter === "achats" ? "text-white" : "text-neutral-600 dark:text-neutral-400"}`}>Achats</Text>
        </Pressable>
      </ScrollView>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <Pressable
      onPress={() => navigation.navigate("Chat", { chatId: item.id })}
      className="flex-row items-center p-4 rounded-2xl bg-white dark:bg-neutral-800/50 mb-2 active:bg-neutral-100 dark:active:bg-neutral-800"
    >
      <View className="relative mr-4">
        <View className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500/20 bg-neutral-200 items-center justify-center">
          <Ionicons name="person" size={24} color="#737373" />
        </View>
        {index === 0 && (
          <View className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-neutral-900 rounded-full" />
        )}
      </View>
      <View className="flex-1 min-w-0">
        <View className="flex-row justify-between items-baseline mb-1">
          <Text className="text-base font-bold text-neutral-900 dark:text-white truncate flex-1 pr-2" numberOfLines={1}>
            {item.postTitle || "Annonce"}
          </Text>
          <Text className={`text-xs font-semibold ${index === 0 ? "text-emerald-500" : "text-neutral-500"}`}>
            {formatTime(item.updatedAt)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center gap-2">
          <Text 
            className={`text-sm flex-1 truncate ${index === 0 ? "font-semibold text-neutral-900 dark:text-white italic" : "text-neutral-500 dark:text-neutral-400"}`} 
            numberOfLines={1}
          >
            {item.lastMessage || "Nouvelle conversation"}
          </Text>
          {index === 0 && (
            <View className="w-5 h-5 bg-emerald-500 rounded-full items-center justify-center">
              <Text className="text-[10px] font-bold text-white">1</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900 relative">
      <View className="absolute top-0 w-full z-50 bg-white/90 dark:bg-neutral-900/90 pt-12 pb-4 px-6 flex-row justify-between items-center border-b border-neutral-200 dark:border-neutral-800">
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="menu" size={28} color="#5f5e60" className="dark:text-white" />
          </Pressable>
          <Text className="text-xl font-black tracking-tighter text-neutral-900 dark:text-white">ClicVente</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Ionicons name="search" size={24} color="#5f5e60" className="dark:text-white" />
          <View className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden items-center justify-center">
            <Ionicons name="person" size={20} color="#737373" />
          </View>
        </View>
      </View>

      <FlatList
        data={chats}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 100, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}