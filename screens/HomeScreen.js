import React, { useEffect, useState, useMemo } from "react";
import { View, Text, FlatList, Pressable, useWindowDimensions, } from "react-native";
import { auth, db } from "../firebase";
import { collection, query, orderBy, onSnapshot, getDocs, where, documentId, doc, getDoc, } from "firebase/firestore";
import PostComponent from "./components/PostComponent";

export default function HomeScreen({ navigation }) {
  const { height: screenH } = useWindowDimensions();
  const LIST_MAX = Math.round(screenH * 0.55);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [usernamesById, setUsernamesById] = useState({});

  useEffect(() => {
    const load = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) setProfile(snap.data());
    };
    load();
  }, []);

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

      const chunk = (arr, n) =>
        arr.reduce(
          (acc, _, i) => (i % n ? acc : [...acc, arr.slice(i, i + n)]),
);
      const chunks = chunk(toFetch, 10);

      const newMap = {};
      for (const ids of chunks) {
        const qs = await getDocs(
          query(collection(db, "users"), where(documentId(), "in", ids))
        );
        qs.forEach((docSnap) => {
          const data = docSnap.data();
          newMap[docSnap.id] = data?.username || "(sans nom)";
        });
      }
      setUsernamesById((prev) => ({ ...prev, ...newMap }));
    };

    if (posts.length) loadCreators();
  }, [posts, usernamesById]);

  const handleLogout = async () => {
    await auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const handleCreatePost = () => {
    navigation.navigate("CreatePost");
  };

  const renderItem = ({ item }) => (
    <PostComponent
      title={item.title}
      city={item.city}
      price={item.price}
      creator_id={item.creator_id}
      usernamesById={item.usernamesById}
      onPress={() => navigation.navigate("PostScreen", { postId: item.id })}
    />
  );

  return (
    <View className="flex-1 pt-10 items-center bg-white dark:bg-neutral-900">
      <Text className="text-lg mb-5 text-neutral-900 dark:text-white">
        Bienvenue{profile?.username ? `, ${profile.username}` : ""}
      </Text>

      <Pressable
        className="mb-3 px-4 py-2 rounded-xl bg-blue-600 active:bg-blue-700"
        onPress={() => navigation.navigate("Messages")}
      >
        <Text className="text-white font-semibold">Messages</Text>
      </Pressable>

      <View className="w-full px-4" style={{ maxHeight: LIST_MAX }}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Text className="text-neutral-500 dark:text-neutral-400">
                Aucun post pour l’instant.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View className="h-3" />
      <Pressable
        onPress={handleCreatePost}
        className="px-4 py-3 rounded-xl bg-blue-600 active:bg-blue-700"
      >
        <Text className="text-white font-semibold">Créer une publication</Text>
      </Pressable>

      <View className="h-2" />
      <Pressable
        onPress={handleLogout}
        className="px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600"
      >
        <Text className="text-neutral-800 dark:text-neutral-100 font-semibold">
          Se déconnecter
        </Text>
      </Pressable>
    </View>
  );
}
