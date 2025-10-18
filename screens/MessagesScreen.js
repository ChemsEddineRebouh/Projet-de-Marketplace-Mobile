import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { auth, db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

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
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setChats(list);
    });

    return () => unsub();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("Chat", { chatId: item.id })}
      style={styles.chatRow}
    >
      <Text style={styles.title}>{item.postTitle || "Annonce"}</Text>
      <Text style={styles.preview} numberOfLines={1}>
        {item.lastMessage || "Nouvelle conversation"}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Aucune conversation.</Text>}
      />
    </View>
  );
}
//
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  chatRow: { borderColor: "#ccc", borderWidth: 1, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: "600" },
  preview: { color: "#666", marginTop: 4 },
});
