import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function PostComponent({ title, city, price,creator_id,usernamesById, onPress}) {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text>Ville: {city}</Text>
            <Text>Prix: {price}$</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: { width: "100%", padding: 12, marginBottom: 10, borderColor: "#ccc", borderWidth: 1, borderRadius: 8 },
    title: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
    owner: { marginTop: 6, fontStyle: "italic" },
});
