import React, { useState } from "react";
import { View, TextInput, Text, Pressable, Platform } from "react-native";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreatePostScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const priceNumber = parseFloat(String(price).replace(",", "."));
  const isValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    city.trim().length > 0 &&
    !Number.isNaN(priceNumber);

  const handleSavePost = async () => {
    setError("");
    if (!isValid) {
      setError("Tous les champs sont requis et le prix doit être valide.");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        creator_id: auth.currentUser?.uid || null,
        title: title.trim(),
        description: description.trim(),
        city: city.trim(),
        price: priceNumber,
        createdAt: serverTimestamp(),
      });
      console.log("New post ID:", docRef.id);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (e) {
      console.log("Create post error", e);
      setError("Erreur lors de la création de la publication.");
    }
  };

  const onChangePrice = (t) => {
    let s = t.replace(/[^\d.,]/g, "");
    const sepIdxs = [s.indexOf(","), s.indexOf(".")].filter((i) => i !== -1);
    const firstSepIdx = sepIdxs.length ? Math.min(...sepIdxs) : -1;
    if (firstSepIdx !== -1) {
      const sep = s[firstSepIdx];
      const head = s.slice(0, firstSepIdx).replace(/[.,]/g, "");
      let tail = s.slice(firstSepIdx + 1).replace(/[.,]/g, "");
      tail = tail.slice(0, 2);
      s = head + sep + tail;
    } else {
      s = s.replace(/[.,]/g, "");
    }
    setPrice(s);
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-neutral-900 px-6 py-8">
      <Text className="text-2xl font-extrabold text-center mb-6 text-neutral-900 dark:text-white">
        Création de votre publication
      </Text>

      {!!error && (
        <Text className="text-red-600 text-sm mb-3 text-center">{error}</Text>
      )}

      <View className="bg-white dark:bg-neutral-800 rounded-3xl p-5 border border-neutral-100 dark:border-neutral-700">
        <Text className="text-neutral-700 dark:text-neutral-300 text-sm mb-1">
          Titre
        </Text>
        <TextInput
          className="h-12 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white mb-4"
          placeholder="Titre"
          placeholderTextColor="#9ca3af"
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
        />

        <Text className="text-neutral-700 dark:text-neutral-300 text-sm mb-1">
          Description
        </Text>
        <TextInput
          className="min-h-[96px] px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white mb-4"
          placeholder="État, accessoires, dimensions…"
          placeholderTextColor="#9ca3af"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-neutral-700 dark:text-neutral-300 text-sm mb-1">
              Ville
            </Text>
            <TextInput
              className="h-12 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white"
              placeholder="Montréal"
              placeholderTextColor="#9ca3af"
              value={city}
              onChangeText={setCity}
              returnKeyType="next"
            />
          </View>

          <View className="w-36">
            <Text className="text-neutral-700 dark:text-neutral-300 text-sm mb-1">
              Prix
            </Text>
            <TextInput
              className="h-12 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white"
              placeholder="13,22"
              placeholderTextColor="#9ca3af"
              value={price}
              onChangeText={onChangePrice}
              keyboardType={
                Platform.OS === "ios"
                  ? "numbers-and-punctuation"
                  : "decimal-pad"
              }
              returnKeyType="done"
            />
          </View>
        </View>

        <Pressable
          onPress={handleSavePost}
          disabled={!isValid}
          className={`mt-5 h-12 rounded-xl items-center justify-center ${
            isValid ? "bg-blue-600 active:bg-blue-700" : "bg-blue-400/60"
          }`}
        >
          <Text className="text-white font-semibold">
            Publier la publication
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
