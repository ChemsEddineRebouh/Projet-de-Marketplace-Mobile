import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function CreateAccountScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async () => {
        setError("");
        try {
            await createUserWithEmailAndPassword(auth, email.trim(), password);
            navigation.navigate("Home");
        } catch (err) {
            console.log("Signup error:", err.code, err.message);
            setError(mapAuthError(err));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create an account</Text>
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

            <Button title="Sign up" onPress={handleSignUp} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 8 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    error: { color: "red", textAlign: "center", marginBottom: 10 },
});
