import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function EditPostScreen({ navigation, route }) {
  const { postId } = route.params;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const data = postSnap.data();
          setTitle(data.title || "");
          setDescription(data.description || "");
          setPrice(data.price ? String(data.price) : "");
          setCategory(data.category || "");
          setLocation(data.city || "");
        } else {
          Alert.alert("Erreur", "Annonce introuvable.");
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert("Erreur", "Impossible de charger l'annonce.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleUpdate = async () => {
    if (!title || !price || !location) {
      Alert.alert("Erreur", "Veuillez remplir les champs obligatoires (Titre, Prix, Localisation).");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        title,
        description,
        price: parseFloat(price),
        category: category || "Général",
        city: location,
        updatedAt: serverTimestamp(),
      });
      Alert.alert("Succès", "L'annonce a été mise à jour.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour l'annonce.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-50 dark:bg-neutral-900">
        <Text className="text-neutral-500">Chargement...</Text>
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
          <Ionicons name="close" size={28} color="#171717" className="dark:text-white" />
        </Pressable>
        <Text className="text-xl font-black tracking-tighter text-neutral-900 dark:text-white">Modifier l'annonce</Text>
        <View className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 items-center justify-center">
          <Ionicons name="person" size={20} color="#737373" />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 100, paddingBottom: 40, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
        <View className="mb-10">
          <Text className="text-3xl font-extrabold tracking-tight mb-2 text-neutral-900 dark:text-white">Modifier votre annonce</Text>
          <Text className="text-neutral-500 text-lg">Mettez à jour les détails de votre article.</Text>
        </View>

        <View className="mb-10">
          <Pressable className="w-full aspect-[4/3] rounded-[2rem] border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 items-center justify-center overflow-hidden relative">
            <View className="items-center gap-4 z-10">
              <View className="w-16 h-16 rounded-full bg-blue-600/10 items-center justify-center">
                <Ionicons name="camera" size={32} color="#2563EB" />
              </View>
              <View className="items-center">
                <Text className="font-bold text-neutral-900 dark:text-white">Ajouter des photos</Text>
                <Text className="text-sm text-neutral-500">Appuyez ici pour choisir</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View className="space-y-8">
          <View className="space-y-2 mb-6">
            <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500 px-1 mb-2">Titre</Text>
            <TextInput 
              className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-2xl py-4 px-6 text-neutral-900 dark:text-white" 
              placeholder="Ex: Vase en céramique tourné main" 
              placeholderTextColor="#737373"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="space-y-2 mb-6">
            <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500 px-1 mb-2">Description</Text>
            <TextInput 
              className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-[2rem] py-4 px-6 text-neutral-900 dark:text-white" 
              placeholder="Décrivez l'histoire de votre objet, les matériaux utilisés..." 
              placeholderTextColor="#737373"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View className="flex-row gap-4 mb-6">
            <View className="flex-1 space-y-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500 px-1 mb-2">Prix</Text>
              <View className="relative justify-center">
                <TextInput 
                  className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-2xl py-4 pl-6 pr-10 text-neutral-900 dark:text-white" 
                  placeholder="0.00" 
                  placeholderTextColor="#737373"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
                <Text className="absolute right-4 font-bold text-neutral-900 dark:text-white">$</Text>
              </View>
            </View>
            <View className="flex-1 space-y-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500 px-1 mb-2">Catégorie</Text>
              <TextInput 
                className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-2xl py-4 px-6 text-neutral-900 dark:text-white" 
                placeholder="Ex: Céramique" 
                placeholderTextColor="#737373"
                value={category}
                onChangeText={setCategory}
              />
            </View>
          </View>

          <View className="space-y-2 mb-8">
            <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500 px-1 mb-2">Localisation</Text>
            <View className="relative justify-center">
              <View className="absolute left-4 z-10">
                <Ionicons name="location" size={20} color="#2563EB" />
              </View>
              <TextInput 
                className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-2xl py-4 pl-12 pr-6 text-neutral-900 dark:text-white" 
                placeholder="Ex: Montréal, Plateau-Mont-Royal" 
                placeholderTextColor="#737373"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <View className="pt-2">
            <Pressable 
              className="w-full py-5 rounded-full bg-blue-600 shadow-lg items-center justify-center active:scale-95" 
              onPress={handleUpdate}
            >
              <Text className="text-white font-bold tracking-widest text-sm uppercase">
                Modifier l'annonce
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}