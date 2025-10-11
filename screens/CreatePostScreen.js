import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc,addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function CreatePostScreen({ navigation }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [city, setCity] = useState("");
    const [price, setPrice] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        const load = async () => {
            const uid = auth.currentUser?.uid;
            if (!uid) return;
            const snap = await getDoc(doc(db, "users", uid));
            if (snap.exists()) setProfile(snap.data());
        };
        load();
    }, []);
    const handleSavePost = async () => {
        setError("");
        try {

            const docRef = await addDoc(collection(db, "posts"), {
                creator_id: auth.currentUser?.uid,
                description,
                price,
                title,
                city,
                createdAt: serverTimestamp(),
            });

            console.log("New post ID:", docRef.id);

            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
        } catch (e) {
            console.log("Signup error", e);
            setError("Erreur d'inscription.");
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Creation de votre publication</Text>
            {!!error && <Text style={styles.error}>{error}</Text>}
            <TextInput style={styles.input} placeholder="Titre" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder="ville" value={city} onChangeText={setCity} />
            <TextInput style={styles.input} placeholder="Prix" value={price} onChangeText={setPrice} />
            <Button title="Publier la publication" onPress={handleSavePost} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 8 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    error: { color: "red", textAlign: "center", marginBottom: 10 },
});
