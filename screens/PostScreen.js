import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";

const makeChatId = (postId, uidA, uidB) => {
  const [a, b] = [uidA, uidB].sort();
  return `${postId}_${a}_${b}`;
};

export default function PostScreen({ route }) {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState(
    "Bonjour, est-ce toujours disponible ?"
  );
  const [alreadyMessaged, setAlreadyMessaged] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const snap = await getDoc(doc(db, "posts", postId));
      if (snap.exists()) {
        const postData = { id: snap.id, ...snap.data() };
        setPost(postData);
        const userSnap = await getDoc(doc(db, "users", postData.creator_id));
        if (userSnap.exists()) setSeller(userSnap.data());
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    const checkExistingChat = async () => {
      const me = auth.currentUser?.uid;
      if (!post || !me) return;
      if (post.creator_id === me) return;
      const chatId = makeChatId(post.id, me, post.creator_id);
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);
      if (chatSnap.exists()) {
        setAlreadyMessaged(true);
        setInfoMessage("Un message a déjà été envoyé pour cet item.");
      } else {
        setAlreadyMessaged(false);
        setInfoMessage("");
      }
    };
    checkExistingChat();
  }, [post]);

  const handleSendMessage = async () => {
    if (!seller || !post || !message.trim() || alreadyMessaged) return;
    try {
      const chatId = makeChatId(post.id, auth.currentUser.uid, post.creator_id);
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          postId: post.id,
          postTitle: post.title ?? "",
          participants: [auth.currentUser.uid, post.creator_id],
          lastMessage: message.trim(),
          updatedAt: serverTimestamp(),
        });
      }

      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: message.trim(),
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: message.trim(),
        updatedAt: serverTimestamp(),
      });

      setAlreadyMessaged(true);
      setInfoMessage("Un message a déjà été envoyé pour cet item.");
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
      setInfoMessage("❌ Une erreur est survenue. Réessaie plus tard.");
    }
  };

  if (!post) return <Text className="px-4 py-6">Chargement...</Text>;
  const isSeller = auth.currentUser && post.creator_id === auth.currentUser.uid;

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-neutral-900"
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      bounces
    >
      <View className="bg-white dark:bg-neutral-800 rounded-3xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-lg shadow-black/5">
        <Text className="text-2xl font-extrabold text-neutral-900 dark:text-white">
          {post.title}
        </Text>

        {!!post.description && (
          <Text className="mt-2 text-neutral-700 dark:text-neutral-300">
            {post.description}
          </Text>
        )}

        <View className="mt-4 flex-row flex-wrap items-center gap-2">
          <Text className="px-2 py-0.5 rounded-full text-xs bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
            {post.city}
          </Text>
          <Text className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
            {post.price}$
          </Text>
          <Text className="text-xs text-neutral-500 dark:text-neutral-400">
            Vendeur :{" "}
            <Text className="font-medium">
              {seller ? seller.username : "Chargement..."}
            </Text>
          </Text>
        </View>
      </View>

      {!isSeller && (
        <View className="mt-5 bg-white dark:bg-neutral-800 rounded-3xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-sm">
          {alreadyMessaged ? (
            <Text className="text-green-700 dark:text-green-400 italic">
              En attente de la réponse du vendeur.
            </Text>
          ) : (
            <>
              <Text className="text-neutral-700 dark:text-neutral-300 mb-2">
                Envoyer un message au vendeur :
              </Text>

              <TextInput
                className="h-12 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white"
                value={message}
                onChangeText={setMessage}
                editable={!alreadyMessaged}
                placeholder="Bonjour, est-ce toujours disponible ?"
                placeholderTextColor="#9ca3af"
              />

              <Pressable
                onPress={handleSendMessage}
                disabled={alreadyMessaged}
                className={`mt-3 h-12 rounded-xl items-center justify-center ${
                  alreadyMessaged
                    ? "bg-blue-600/60"
                    : "bg-blue-600 active:bg-blue-700"
                }`}
              >
                <Text className="text-white font-semibold">Envoyer</Text>
              </Pressable>
            </>
          )}

          {!!infoMessage && (
            <Text className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
              {infoMessage}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}
