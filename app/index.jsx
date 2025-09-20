import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0f67cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Health Care at your service</Text>
      <Text style={styles.subheading}>
        Track your health and feelings daily to gain insights
      </Text>

      <View style={styles.cardContainer}>
        <Pressable
          style={styles.healthCard}
          onPress={() => router.push("/goals")}
        >
          <Ionicons name="heart-circle-outline" size={60} color="#ff6b6b" />
          <Text style={styles.cardText}>Health & Feelings</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f4f8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f67cc",
    marginBottom: 10,
    textAlign: "center",
  },
  subheading: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 50,
  },
  cardContainer: {
    width: "100%",
    alignItems: "center",
  },
  healthCard: {
    backgroundColor: "#ffffff",
    width: 200,
    height: 200,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    padding: 16,
  },
  cardText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#0f67cc",
    textAlign: "center",
  },
});
