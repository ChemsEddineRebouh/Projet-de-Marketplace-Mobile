import React, { useState } from "react";
import { View, TextInput, Pressable, Text, ActivityIndicator, } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const mapAuthError = (err) => {
    switch (err?.code) {
      case "auth/invalid-credential":
        return "Email ou mot de passe invalide.";
      case "auth/too-many-requests":
        return "Trop de tentatives. Réessaie plus tard.";
      case "auth/network-request-failed":
        return "Connexion réseau instable. Veuillez réessayer.";
      default:
        return "Erreur de connexion.";
    }
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (err) {
      setError(mapAuthError(err));
      console.log("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccountButton = () => {
    navigation.navigate("Signup");
  };

  return (
    <View className="flex-1 justify-center px-5 bg-white dark:bg-neutral-900">
      <Text className="text-3xl font-bold text-center mb-6 text-neutral-900 dark:text-white">
        Login
      </Text>

      {!!error && (
        <Text className="text-red-600 text-center mb-3">{error}</Text>
      )}

      <TextInput
        className="border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 mb-3 text-base text-neutral-900 dark:text-white bg-white dark:bg-neutral-800"
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        returnKeyType="next"
      />

      <TextInput
        className="border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 mb-4 text-base text-neutral-900 dark:text-white bg-white dark:bg-neutral-800"
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        returnKeyType="done"
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        className={`rounded-2xl px-4 py-3 items-center ${
          loading ? "opacity-60 bg-blue-600" : "bg-blue-600 active:bg-blue-700"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">Sign in</Text>
        )}
      </Pressable>

      <Pressable
        onPress={handleCreateAccountButton}
        className="mt-3 rounded-2xl px-4 py-3 items-center border border-blue-600"
      >
        <Text className="text-blue-600 font-semibold text-base">
          Create an account
        </Text>
      </Pressable>
    </View>
  );
}
