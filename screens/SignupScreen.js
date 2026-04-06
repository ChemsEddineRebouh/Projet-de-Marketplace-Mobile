import React, { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        createdAt: serverTimestamp(),
      });
      
      navigation.reset({ index: 0, routes: [{ name: "Main" }] });
    } catch (error) {
      Alert.alert("Erreur d'inscription", error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      className="flex-1 bg-neutral-50 dark:bg-neutral-900"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 flex-col px-8 pt-16 pb-12">
          <View className="flex-row items-center mb-8">
            <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2">
              <Ionicons name="arrow-back" size={28} color="#171717" className="dark:text-white" />
            </Pressable>
            <View className="flex-1 items-center pr-8">
              <Text className="text-xl font-black tracking-tighter text-neutral-900 dark:text-white">ClicVente</Text>
            </View>
          </View>

          <View className="mb-12">
            <Text className="text-4xl font-extrabold tracking-tight leading-tight mb-3 text-neutral-900 dark:text-white">
              Rejoignez ClicVente.
            </Text>
            <Text className="text-neutral-500 text-lg leading-relaxed">
              Découvrez des pièces uniques et commencez votre collection dès aujourd'hui.
            </Text>
          </View>

          <View className="space-y-6 flex-1">
            <View className="space-y-2 mb-4">
              <Text className="text-sm font-semibold tracking-wide uppercase ml-1 text-neutral-900 dark:text-white mb-2">
                Nom d'utilisateur
              </Text>
              <TextInput 
                className="w-full h-14 px-6 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                placeholder="votre_nom"
                placeholderTextColor="#a3a3a3"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View className="space-y-2 mb-4">
              <Text className="text-sm font-semibold tracking-wide uppercase ml-1 text-neutral-900 dark:text-white mb-2">
                E-mail
              </Text>
              <TextInput 
                className="w-full h-14 px-6 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                placeholder="nom@exemple.com"
                placeholderTextColor="#a3a3a3"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="space-y-2 mb-4">
              <Text className="text-sm font-semibold tracking-wide uppercase ml-1 text-neutral-900 dark:text-white mb-2">
                Mot de passe
              </Text>
              <View className="relative justify-center">
                <TextInput 
                  className="w-full h-14 pl-6 pr-14 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  placeholder="••••••••"
                  placeholderTextColor="#a3a3a3"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable 
                  className="absolute right-4 p-2"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#737373" />
                </Pressable>
              </View>
            </View>

            <Text className="text-sm text-neutral-500 px-1 py-2 leading-relaxed mt-2">
              En créant un compte, vous acceptez nos <Text className="text-neutral-900 dark:text-white font-semibold underline">Conditions Générales</Text> et notre <Text className="text-neutral-900 dark:text-white font-semibold underline">Politique de Confidentialité</Text>.
            </Text>

            <View className="pt-4">
              <Pressable 
                className="w-full h-16 rounded-full bg-emerald-500 items-center justify-center shadow-lg active:scale-95"
                onPress={handleSignup}
              >
                <Text className="text-white font-black tracking-widest uppercase text-sm">
                  Créer un compte
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-12 items-center pb-8">
            <Text className="text-neutral-500 font-medium">Vous avez déjà un compte ?</Text>
            <Pressable onPress={() => navigation.navigate("Login")} className="mt-2 p-2">
              <Text className="text-emerald-500 font-bold">Connectez-vous ici</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}