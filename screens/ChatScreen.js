import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { auth, db } from "../firebase";
import {
  collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc
} from "firebase/firestore";

export default function ChatScreen({ route }) {
  const { chatId, initialText } = route.params || {};
  const [text, setText] = useState(initialText || "");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [chatId]);

  const handleSend = useCallback(async () => {
    const t = text.trim();
    if (!t) return;

    const me = auth.currentUser;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: t,
      senderId: me?.uid ?? "",
      senderName: me?.email ?? "User", 
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: t,
      updatedAt: serverTimestamp(),
    });

    setText("");
  }, [chatId, text]);

  const renderItem = ({ item }) => {
    const mine = item.senderId === auth.currentUser?.uid;
    return (
      <View style={[styles.msg, mine ? styles.me : styles.them]}>
        <Text style={styles.name}>{item.senderName}</Text>
        <Text>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
      />
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Écrire un message…"
        />
        <Button title="Envoyer" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  msg: { padding: 10, borderRadius: 10, marginVertical: 6, maxWidth: "80%" },
  me: { alignSelf: "flex-end", backgroundColor: "#e6f0ff" },
  them: { alignSelf: "flex-start", backgroundColor: "#f1f1f1" },
  name: { fontSize: 11, color: "#666", marginBottom: 2 },
  row: { flexDirection: "row", alignItems: "center", padding: 8, borderTopWidth: 1, borderColor: "#ddd" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginRight: 8 },
});
