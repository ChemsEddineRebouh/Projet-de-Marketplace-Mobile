import React, { useState } from "react";
import { View, TextInput, Text, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    try {
      const cleanUsername = username.trim();
      if (!cleanUsername) return setError("Choisis un nom d'utilisateur.");

      const q = query(
        collection(db, "users"),
        where("username", "==", cleanUsername)
      );
      const snap = await getDocs(q);
      if (!snap.empty) return setError("Ce nom d'utilisateur est déjà pris.");

      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await setDoc(doc(db, "users", cred.user.uid), {
        id: cred.user.uid,
        username: cleanUsername,
        email: cred.user.email,
        createdAt: serverTimestamp(),
      });

      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (e) {
      console.log("Signup error", e);
      setError("Erreur d'inscription.");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50 dark:bg-neutral-900"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 px-6 py-8">
          <View className="mt-4 mb-8">
            <Text className="text-3xl font-extrabold text-neutral-900 dark:text-white">
              Créer un compte
            </Text>
            <Text className="text-neutral-500 dark:text-neutral-400 mt-1">
              Rejoins-nous en quelques secondes
            </Text>
          </View>

          <View className="bg-white dark:bg-neutral-800 rounded-3xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-lg shadow-black/5">
            {!!error && (
              <Text className="text-red-600 text-sm mb-3 text-center">
                {error}
              </Text>
            )}

            <View className="mb-4">
              <Text className="text-neutral-700 dark:text-neutral-300 text-sm mb-1">
                Nom d'utilisateur
              </Text>
              <TextInput
                className="h-12 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white"
                placeholder="ex. username"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View className="mb-4">
              <Text className="text-neutral-700 dark:text-neutral-300 text-sm mb-1">
                Email
              </Text>
              <TextInput
                className="h-12 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white"
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>

            <View className="mb-2">
              <Text className="text-neutral-700 dark:text-neutral-300 text-sm mb-1">
                Mot de passe
              </Text>
              <TextInput
                className="h-12 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white"
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
              />
            </View>

            <Pressable
              onPress={handleSignup}
              className="mt-5 h-12 rounded-xl items-center justify-center bg-blue-600 active:bg-blue-700"
            >
              <Text className="text-white font-semibold text-base">
                S'inscrire
              </Text>
            </Pressable>
          </View>

          <Text className="text-center text-xs text-neutral-400 mt-6">
            En continuant, tu acceptes nos Conditions et Politique de
            confidentialité.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
