import React, { useEffect, useState, useMemo } from "react";
import { View, Text, FlatList, Pressable, Image } from "react-native";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const ListHeader = () => (
  <View className="pt-6 px-4">
    <View className="flex-row justify-between items-center mb-8">
      <Text className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">Mes annonces</Text>
    </View>
  </View>
);

const renderItem = ({ item, navigation }) => (
  <Pressable
    className="flex-1 bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-sm mx-2 mb-4"
    onPress={() => navigation.navigate("PostScreen", { postId: item.id })}
  >
    <View className="aspect-[3/4] w-full relative items-center justify-center bg-neutral-200 dark:bg-neutral-800">
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} className="w-full h-full" />
      ) : (
        <Ionicons name="image" size={40} color="#737373" />
      )}
      <View className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full shadow-sm">
        <Text className="text-xs font-bold text-blue-600">{item.price} $</Text>
      </View>
    </View>
    <View className="p-4">
      <Text className="font-bold text-sm text-neutral-900 dark:text-white" numberOfLines={1}>{item.title}</Text>
      <Text className="text-[11px] text-neutral-500 mt-1">{item.city || "Laval"}</Text>
    </View>
  </Pressable>
);

export default function MyPostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, "posts"),
      where("creator_id", "==", uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      setPosts(list);
    });
    return () => unsub();
  }, []);

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900 pt-10 relative">
      <FlatList
        data={posts}
        ListHeaderComponent={<ListHeader />}
        renderItem={(props) => renderItem({ ...props, navigation })}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}