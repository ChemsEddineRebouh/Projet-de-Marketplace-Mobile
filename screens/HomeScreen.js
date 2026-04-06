import React, { useEffect, useState, useMemo } from "react";
import { View, Text, FlatList, Pressable, TextInput, useWindowDimensions } from "react-native";
import { auth, db } from "../firebase";
import { collection, query, orderBy, onSnapshot, getDocs, where, documentId, doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const ListHeader = React.memo(({ search, setSearch, handleLogout }) => (
  <View className="pt-6 px-4">
    <View className="flex-row justify-between items-center mb-8">
      <Text className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">ClicVente</Text>
      <View className="flex-row items-center gap-4">
        <Pressable className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden" onPress={handleLogout}>
          <View className="w-full h-full items-center justify-center bg-neutral-200 dark:bg-neutral-800">
            <Ionicons name="person" size={20} color="#737373" />
          </View>
        </Pressable>
      </View>
    </View>

    <View className="mb-8">
      <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-4 py-4">
        <Ionicons name="search" size={20} color="#737373" />
        <TextInput
          className="flex-1 ml-3 text-neutral-900 dark:text-white"
          placeholder="Rechercher des trésors..."
          placeholderTextColor="#737373"
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </View>
  </View>
));

const renderItem = ({ item, usernamesById, navigation }) => (
  <Pressable
    className="flex-1 bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-sm mx-2 mb-4"
    onPress={() => navigation.navigate("PostScreen", { postId: item.id })}
  >
    <View className="aspect-[3/4] w-full relative items-center justify-center bg-neutral-200 dark:bg-neutral-800">
      <Ionicons name="image" size={40} color="#737373" />
      <View className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full shadow-sm">
        <Text className="text-xs font-bold text-blue-600">{item.price} $</Text>
      </View>
    </View>
    <View className="p-4">
      <Text className="font-bold text-sm text-neutral-900 dark:text-white" numberOfLines={1}>{item.title}</Text>
      <Text className="text-[11px] text-neutral-500 mt-1">{item.city || "Laval"}</Text>
      <Text className="text-[10px] text-blue-500 mt-1">@{usernamesById[item.creator_id] || "..."}</Text>
    </View>
  </Pressable>
);

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [usernamesById, setUsernamesById] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const loadCreators = async () => {
      const needed = new Set(posts.map((p) => p.creator_id).filter(Boolean));
      const toFetch = [...needed].filter((uid) => !(uid in usernamesById));
      if (toFetch.length === 0) return;

      const chunk = (arr, n) => arr.reduce((acc, _, i) => (i % n ? acc : [...acc, arr.slice(i, i + n)]), []);
      const chunks = chunk(toFetch, 10);

      const newMap = {};
      for (const ids of chunks) {
        const qs = await getDocs(query(collection(db, "users"), where(documentId(), "in", ids)));
        qs.forEach((docSnap) => {
          const data = docSnap.data();
          newMap[docSnap.id] = data?.username || "(sans nom)";
        });
      }
      setUsernamesById((prev) => ({ ...prev, ...newMap }));
    };

    if (posts.length) loadCreators();
  }, [posts]);

  const handleLogout = async () => {
    await auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const filteredPosts = useMemo(() => posts.filter((p) => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.city?.toLowerCase().includes(search.toLowerCase())
  ), [posts, search]);

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900 pt-10 relative">
      <FlatList
        data={filteredPosts}
        ListHeaderComponent={<ListHeader search={search} setSearch={setSearch} handleLogout={handleLogout} />}
        renderItem={(props) => renderItem({ ...props, usernamesById, navigation })}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}