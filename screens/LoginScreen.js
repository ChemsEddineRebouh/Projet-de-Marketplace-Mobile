import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const mapAuthError = (err) => {
    switch (err?.code) {
      case "auth/invalid-credential": return "Email ou mot de passe invalide.";
      case "auth/too-many-requests": return "Trop de tentatives. Réessaie plus tard.";
      case "auth/network-request-failed": return "Connexion réseau instable. Veuillez réessayer.";
      default: return "Erreur de connexion.";
    }
  };

  const handleLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (err) {
      setError(mapAuthError(err));
      console.log("Login error:", err);
    }
  };
  const handleCreateAccountButton = async () => {
    navigation.navigate("Signup");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign in" onPress={handleLogin} />
      <Button title="Create an account" onPress={handleCreateAccountButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 8 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
});
