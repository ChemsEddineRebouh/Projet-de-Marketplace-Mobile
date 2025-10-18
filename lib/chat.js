import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const makeChatId = (postId, uidA, uidB) => {
  const [a, b] = [uidA, uidB].sort();
  return `${postId}_${a}_${b}`;
};

export async function getOrCreateChat({ postId, postTitle, sellerId }) {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error("Utilisateur non connecté");

  const chatId = makeChatId(postId, me, sellerId);
  const chatRef = doc(db, "chats", chatId);
  const snap = await getDoc(chatRef);

  if (!snap.exists()) {
    await setDoc(chatRef, {
      postId,
      postTitle: postTitle ?? "",
      participants: [me, sellerId],
      lastMessage: "",
      updatedAt: serverTimestamp(),
    });
  }

  return chatId;
}
