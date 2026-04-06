import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { getOrCreateChat } from "../lib/chat";

export default function PostScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;

  const [post, setPost] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPostAndSeller = async () => {
      try {
        const postSnap = await getDoc(doc(db, "posts", postId));
        if (postSnap.exists()) {
          const postData = postSnap.data();
          setPost(postData);

          if (postData.creator_id) {
            const sellerSnap = await getDoc(doc(db, "users", postData.creator_id));
            if (sellerSnap.exists()) {
              setSeller(sellerSnap.data());
            }
          }
        }
      } catch (error) {} finally {
        setLoading(false);
      }
    };

    fetchPostAndSeller();
  }, [postId]);

  const handleSendInitialMessage = async () => {
    if (post?.creator_id && post?.title) {
      try {
        const chatId = await getOrCreateChat({
          postId: postId,
          postTitle: post.title,
          sellerId: post.creator_id,
        });
        navigation.navigate("Chat", { 
          chatId: chatId, 
          initialText: message 
        });
      } catch (error) {}
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-50 dark:bg-neutral-900">
        <Text className="text-neutral-500">Publication introuvable.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      className="flex-1 bg-neutral-50 dark:bg-neutral-900"
    >
      <View className="absolute top-0 w-full z-50 bg-white/90 dark:bg-neutral-900/90 pt-12 pb-4 px-6 flex-row justify-between items-center border-b border-neutral-200 dark:border-neutral-800">
        <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={28} color="#171717" className="dark:text-white" />
        </Pressable>
        <Text className="text-xl font-black tracking-tighter text-neutral-900 dark:text-white">ClicVente</Text>
        <View className="w-8" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View className="w-full aspect-square bg-neutral-200 dark:bg-neutral-800 mt-24 items-center justify-center">
          <Ionicons name="image-outline" size={64} color="#A3A3A3" />
          <Text className="text-neutral-400 mt-2 font-bold tracking-widest">ESPACE IMAGE ARTICLE</Text>
        </View>

        <View className="px-6 py-8">
          <View className="mb-8">
            <View className="flex-row justify-between items-start gap-4 mb-2">
              <Text className="flex-1 text-3xl font-extrabold tracking-tight leading-tight text-neutral-900 dark:text-white">
                {post.title}
              </Text>
              <Text className="text-blue-600 font-bold text-2xl whitespace-nowrap">
                {post.price} $
              </Text>
            </View>
            <Text className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Catégorie : {post.category || "Général"}
            </Text>
          </View>

          <View className="mb-8">
            <Text className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
              Description
            </Text>
            <Text className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-lg">
              {post.description || "Aucune description fournie."}
            </Text>
          </View>

          <View className="p-6 bg-white dark:bg-neutral-800 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-700 mb-8">
            <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
              À propos du vendeur
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="relative">
                  <View className="w-14 h-14 rounded-full bg-neutral-200 dark:bg-neutral-700 items-center justify-center">
                    <Ionicons name="person" size={24} color="#A3A3A3" />
                  </View>
                  <View className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5 border-2 border-white dark:border-neutral-800">
                    <Ionicons name="checkmark-circle" size={14} color="white" />
                  </View>
                </View>
                <View>
                  <Text className="font-bold text-lg text-neutral-900 dark:text-white">
                    {seller?.username || "Utilisateur"}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <Ionicons name="star" size={14} color="#EAB308" />
                    <Text className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">4.9</Text>
                    <Text className="text-sm text-neutral-500 ml-1">(Vendeur vérifié)</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <Ionicons name="location" size={24} color="#2563EB" />
            <Text className="text-base font-medium text-neutral-600 dark:text-neutral-300">
              {post.city || "Laval"}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-neutral-900/90 border-t border-neutral-200 dark:border-neutral-800 flex-row gap-3 items-center">
        <TextInput
          className="flex-1 h-12 px-4 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
          placeholder="Envoyer un message au vendeur..."
          placeholderTextColor="#737373"
          value={message}
          onChangeText={setMessage}
        />
        <Pressable 
          className={`w-12 h-12 rounded-full flex items-center justify-center ${message.trim().length ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}
          onPress={handleSendInitialMessage}
          disabled={!message.trim().length}
        >
          <Ionicons name="send" size={20} color="white" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}