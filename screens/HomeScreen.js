import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../firebase";

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await auth.signOut();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {auth.currentUser?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, marginBottom: 20 },
});
