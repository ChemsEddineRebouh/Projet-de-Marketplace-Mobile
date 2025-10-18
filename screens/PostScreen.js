import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
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
import { getOrCreateChat } from "../lib/chat";

const makeChatId = (postId, uidA, uidB) => {
  const [a, b] = [uidA, uidB].sort();
  return `${postId}_${a}_${b}`;
};

export default function PostScreen({ route }) {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState("Bonjour, est-ce toujours disponible ?");
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

  if (!post) return <Text>Chargement...</Text>;
  const isSeller = auth.currentUser && post.creator_id === auth.currentUser.uid;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text>{post.description}</Text>
      <Text>Ville: {post.city}</Text>
      <Text>Prix: {post.price}</Text>
      <Text>Vendeur: {seller ? seller.username : "Chargement..."}</Text>

      {!isSeller && (
        <View style={{ marginTop: 20 }}>
          {alreadyMessaged ? (
            <Text style={styles.info}>En attente de la réponse du vendeur.</Text>
          ) : (
            <>
              <Text>Envoyer un message au vendeur :</Text>
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                editable={!alreadyMessaged}
              />
              <Button title="Envoyer" onPress={handleSendMessage} disabled={alreadyMessaged} />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 8 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  info: { marginTop: 10, fontStyle: "italic", color: "#2e7d32" },
});
