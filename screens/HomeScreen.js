import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import { auth, db } from "../firebase";
import {
  collection, query, orderBy, onSnapshot, getDocs, where, documentId, doc, getDoc
} from "firebase/firestore";
import PostComponent from "./components/PostComponent";

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);                
  const [usernamesById, setUsernamesById] = useState({});

  useEffect(() => {
    const load = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) setProfile(snap.data());
    };
    load();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const loadCreators = async () => {
      const needed = new Set(posts.map(p => p.creator_id).filter(Boolean));
      const toFetch = [...needed].filter(uid => !(uid in usernamesById));
      if (toFetch.length === 0) return;

      const chunk = (arr, n) => arr.reduce((acc, _, i) => (i % n ? acc : [...acc, arr.slice(i, i + n)]), []);
      const chunks = chunk(toFetch, 10);

      const newMap = {};
      for (const ids of chunks) {
        const qs = await getDocs(
          query(collection(db, "users"), where(documentId(), "in", ids))
        );
        qs.forEach(docSnap => {
          const data = docSnap.data();
          newMap[docSnap.id] = data?.username || "(sans nom)";
        });
      }
      setUsernamesById(prev => ({ ...prev, ...newMap }));
    };

    if (posts.length) loadCreators();
  }, [posts, usernamesById]);

  const handleLogout = async () => {
    await auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const handleCreatePost = () => {
    navigation.navigate("CreatePost");
  };

  const renderItem = ({ item }) => (
    <PostComponent
      title={item.title}
      description={item.description}
      city={item.city}
      price={item.price}
      ownerName={usernamesById[item.creator_id]}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Bienvenue{profile?.username ? `, ${profile.username}` : ""}
      </Text>

      <FlatList
        style={{ width: "100%", paddingHorizontal: 16 }}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Aucun post pour l’instant.</Text>}
      />

      <View style={{ height: 12 }} />
      <Button title="Créer une publication" onPress={handleCreatePost} />
      <View style={{ height: 8 }} />
      <Button title="Se déconnecter" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, alignItems: "center" },
  text: { fontSize: 18, marginBottom: 20 },
});
