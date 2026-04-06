import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) setProfile(snap.data());
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <View className="absolute top-0 w-full z-50 bg-white/90 dark:bg-neutral-900/90 pt-12 pb-4 px-6 border-b border-neutral-200 dark:border-neutral-800">
        <Text className="text-xl font-black tracking-tighter text-neutral-900 dark:text-white">Profil</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 100, paddingBottom: 120, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden mb-4 border-4 border-white dark:border-neutral-800 shadow-sm items-center justify-center">
            <Ionicons name="person" size={48} color="#737373" />
          </View>
          <Text className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {profile?.username || auth.currentUser?.email || "Utilisateur"}
          </Text>
          <Text className="text-sm text-neutral-500 mt-1">
            Membre depuis 2026
          </Text>
        </View>

        <View className="space-y-4 mb-8">
          <Pressable className="bg-white dark:bg-neutral-800 p-4 rounded-2xl flex-row items-center justify-between shadow-sm active:scale-95 mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center">
                <Ionicons name="cube" size={20} color="#10b981" />
              </View>
              <Text className="font-bold text-neutral-900 dark:text-white">Mes annonces</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#737373" />
          </Pressable>


          <Pressable className="bg-white dark:bg-neutral-800 p-4 rounded-2xl flex-row items-center justify-between shadow-sm active:scale-95 mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center">
                <Ionicons name="settings" size={20} color="#10b981" />
              </View>
              <Text className="font-bold text-neutral-900 dark:text-white">Paramètres</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#737373" />
          </Pressable>
        </View>

        <Pressable 
          onPress={handleLogout}
          className="bg-red-50 dark:bg-red-500/10 p-4 rounded-2xl flex-row items-center justify-center shadow-sm active:scale-95"
        >
          <Ionicons name="log-out" size={20} color="#EF4444" className="mr-2" />
          <Text className="font-bold text-red-500">Se déconnecter</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}