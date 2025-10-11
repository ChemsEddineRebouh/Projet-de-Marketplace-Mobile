import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
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

      const q = query(collection(db, "users"), where("username", "==", cleanUsername));
      const snap = await getDocs(q);
      if (!snap.empty) return setError("Ce nom d'utilisateur est déjà pris.");

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

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
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextInput style={styles.input} placeholder="Nom d'utilisateur" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="S'inscrire" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 8 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
});
