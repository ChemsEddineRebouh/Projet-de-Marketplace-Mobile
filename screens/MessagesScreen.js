import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { auth, db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot, } from "firebase/firestore";

export default function MessagesScreen({ navigation }) {
  const [chats, setChats] = useState([]);

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

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("Chat", { chatId: item.id })}
      className="relative p-4 rounded-2xl border border-neutral-200 bg-white shadow-sm
                 active:bg-neutral-50
                 dark:bg-neutral-800 dark:border-neutral-700 dark:active:bg-neutral-700"
      android_ripple={{ color: "rgba(0,0,0,0.06)" }}
      hitSlop={6}
    >
      <Text
        className="pr-6 text-base font-semibold text-neutral-900 dark:text-white"
        numberOfLines={1}
      >
        {item.postTitle || "Annonce"}
      </Text>
      <Text
        className="mt-1 pr-6 text-sm text-neutral-600 dark:text-neutral-300"
        numberOfLines={1}
      >
        {item.lastMessage || "Nouvelle conversation"}
      </Text>

      <Text className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 dark:text-neutral-500">
        ›
      </Text>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-neutral-900">
      <FlatList
        data={chats}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className="text-neutral-500 dark:text-neutral-400">
              Aucune conversation.
            </Text>
          </View>
        }
        contentContainerStyle={{ padding: 12, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
