import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, TextInput, FlatList, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function ChatScreen({ route, navigation }) {
  const { chatId, initialText } = route.params || {};
  const [text, setText] = useState(initialText || "");
  const [messages, setMessages] = useState([]);
  const insets = useSafeAreaInsets();
  const flatRef = useRef(null);
  
  const QUICKTYPE_OFFSET = 15;
  const KB_OFFSET = Platform.OS === "ios" ? insets.bottom + QUICKTYPE_OFFSET : 0;

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
    const hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const renderItem = ({ item }) => {
    const mine = item.senderId === auth.currentUser?.uid;
    const dt = getMessageDate(item);
    return (
      <View
        className={`max-w-[80%] px-4 py-3 rounded-2xl my-1.5 shadow-sm ${
          mine
            ? "self-end bg-emerald-500 rounded-tr-sm"
            : "self-start bg-white dark:bg-neutral-800 rounded-tl-sm border border-neutral-100 dark:border-neutral-700"
        }`}
      >
        <Text className={`text-[10px] mb-1 font-semibold ${mine ? "text-emerald-100" : "text-neutral-500 dark:text-neutral-400"}`}>
          {item.senderName}
        </Text>
        <Text className={`text-base ${mine ? "text-white" : "text-neutral-900 dark:text-white"}`}>
          {item.text}
        </Text>
        {dt && (
          <Text className={`mt-1 text-[10px] self-end ${mine ? "text-emerald-100" : "text-neutral-400"}`}>
            {formatStampFR(dt)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-50 dark:bg-neutral-900"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={KB_OFFSET}
    >
      <View className="absolute top-0 w-full z-50 bg-white/90 dark:bg-neutral-900/90 pt-12 pb-4 px-6 flex-row justify-between items-center border-b border-neutral-200 dark:border-neutral-800">
        <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={28} color="#171717" className="dark:text-white" />
        </Pressable>
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center">
            <Ionicons name="person" size={16} color="#10b981" />
          </View>
          <Text className="text-xl font-black tracking-tighter text-neutral-900 dark:text-white">Conversation</Text>
        </View>
        <View className="w-8" />
      </View>

      <View className="flex-1">
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingTop: 100, paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
          onLayout={() => flatRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
        />

        <View
          className="border-t border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 px-4 pt-3 flex-row gap-3 items-center"
          style={{ paddingBottom: insets.bottom + (Platform.OS === "ios" ? 10 : 20) }}
        >
          <TextInput
            className="flex-1 h-12 px-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
            value={text}
            onChangeText={setText}
            placeholder="Écrire un message…"
            placeholderTextColor="#737373"
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            disabled={!text.trim().length}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
              text.trim().length ? "bg-emerald-500 active:scale-95" : "bg-neutral-200 dark:bg-neutral-700"
            }`}
          >
            <Ionicons name="send" size={20} color={text.trim().length ? "white" : "#A3A3A3"} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}