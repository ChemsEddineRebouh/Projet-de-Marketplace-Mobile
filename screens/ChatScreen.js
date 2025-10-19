import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, TextInput, FlatList, Pressable, KeyboardAvoidingView, Platform, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc, } from "firebase/firestore";
export default function ChatScreen({ route }) {
  const { chatId, initialText } = route.params || {};
  const [text, setText] = useState(initialText || "");
  const [messages, setMessages] = useState([]);
  const insets = useSafeAreaInsets();
  const flatRef = useRef(null);
  const QUICKTYPE_OFFSET = 15;
  const KB_OFFSET =
    Platform.OS === "ios" ? insets.bottom + QUICKTYPE_OFFSET : 0;

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    if (messages.length && flatRef.current) {
      flatRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

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
    requestAnimationFrame(() => {
      flatRef.current?.scrollToEnd({ animated: true });
    });
  }, [chatId, text]);

  const getMessageDate = (m) => {
    const ts = m.createdAt || m.created_at;
    if (!ts) return null;
    if (typeof ts.toDate === "function") return ts.toDate();
    if (ts?.seconds) return new Date(ts.seconds * 1000);
    if (typeof ts === "number") return new Date(ts);
    return null;
  };

  const formatStampFR = (d) => {
    if (!d) return "";
    const months = [
      "jan", "févr", "mars", "avr", "mai", "juin",
      "juil", "août", "sept", "oct", "nov", "déc",
    ];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours(); // 0-23
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year}, ${hours} h ${minutes}`;
  };
  // ---------------------------

  const renderItem = ({ item }) => {
    const mine = item.senderId === auth.currentUser?.uid;
    const dt = getMessageDate(item);
    return (
      <View
        className={`max-w-[80%] px-3 py-2 rounded-2xl my-1.5 ${
          mine
            ? "self-end bg-blue-50 dark:bg-blue-400/10"
            : "self-start bg-neutral-100 dark:bg-neutral-800"
        }`}
      >
        <Text className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-0.5">
          {item.senderName}
        </Text>
        <Text className="text-neutral-900 dark:text-neutral-100">
          {item.text}
        </Text>
        {dt && (
          <Text className="mt-1 text-[10px] text-neutral-500 dark:text-neutral-400 self-end">
            {formatStampFR(dt)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50 dark:bg-neutral-900"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={KB_OFFSET}
    >
      <View className="flex-1">
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            flatRef.current?.scrollToEnd({ animated: false })
          }
          onLayout={() => flatRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
        />

        <View
          className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 pt-3"
          style={{
            paddingBottom:
              insets.bottom + (Platform.OS === "ios" ? QUICKTYPE_OFFSET : 10),
          }}
        >
          <View className="flex-row items-center gap-2">
            <TextInput
              className="flex-1 h-12 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              value={text}
              onChangeText={setText}
              placeholder="Écrire un message…"
              placeholderTextColor="#9ca3af"
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <Pressable
              onPress={handleSend}
              className={`h-12 px-4 rounded-xl items-center justify-center ${
                text.trim().length
                  ? "bg-blue-600 active:bg-blue-700"
                  : "bg-blue-400/60"
              }`}
            >
              <Text className="text-white font-semibold">Envoyer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
