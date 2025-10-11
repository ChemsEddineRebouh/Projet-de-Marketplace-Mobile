import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PostComponent({ title, description, city, price, ownerName }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text>{description}</Text>
      <Text>Ville: {city}</Text>
      <Text>Prix: {price}$</Text>
      <Text style={styles.owner}>Par: {ownerName ?? "Utilisateur"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", padding: 12, marginBottom: 10, borderColor: "#ccc", borderWidth: 1, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  owner: { marginTop: 6, fontStyle: "italic" },
});
