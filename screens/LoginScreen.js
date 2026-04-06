import React, { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.reset({ index: 0, routes: [{ name: "Main" }] });
    } catch (error) {
      Alert.alert("Erreur de connexion", error.message);
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
        <View className="flex-1 flex-col px-8 pt-24 pb-12">
          <View className="mb-12">
            <Text className="text-4xl font-extrabold tracking-tight leading-tight mb-3 text-neutral-900 dark:text-white">
              Bon retour.
            </Text>
            <Text className="text-neutral-500 text-lg leading-relaxed">
              Connectez-vous pour continuer sur ClicVente.
            </Text>
          </View>

          <View className="space-y-6 flex-1">
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

            <View className="space-y-2 mb-8">
              <View className="flex-row justify-between items-end mb-2 ml-1">
                <Text className="text-sm font-semibold tracking-wide uppercase text-neutral-900 dark:text-white">
                  Mot de passe
                </Text>
                <Pressable>
                  <Text className="text-xs font-semibold text-emerald-500">Oublié ?</Text>
                </Pressable>
              </View>
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

            <View className="pt-4">
              <Pressable 
                className="w-full h-16 rounded-full bg-emerald-500 items-center justify-center shadow-lg active:scale-95"
                onPress={handleLogin}
              >
                <Text className="text-white font-black tracking-widest uppercase text-sm">
                  Se connecter
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-12 items-center pb-8">
            <Text className="text-neutral-500 font-medium">Vous n'avez pas de compte ?</Text>
            <Pressable onPress={() => navigation.navigate("Signup")} className="mt-2 p-2">
              <Text className="text-emerald-500 font-bold">Inscrivez-vous ici</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}