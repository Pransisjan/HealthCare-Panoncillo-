import { useContext, useEffect, useState } from "react";
import { SafeAreaView, FlatList, View, Text, Pressable, StyleSheet } from "react-native";
import { GoalsContext } from "../../contexts/GoalsContext";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { Ionicons } from "@expo/vector-icons";

export default function GoalsScreen() {
  const { goals, fetchGoals, deleteGoal } = useContext(GoalsContext);
  const [expandedId, setExpandedId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) fetchGoals(auth.currentUser.uid);
  }, []);

  const renderGoal = ({ item }) => (
    <Pressable
      style={styles.goalCard}
      onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        {expandedId === item.id && (
          <Text style={styles.description}>{item.description || "No description"}</Text>
        )}
      </View>

      <Menu>
        <MenuTrigger>
          <Ionicons name="ellipsis-vertical" size={20} color="#555" />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => router.push(`/goals/edit/${item.id}`)} text="Edit" />
          <MenuOption onSelect={() => deleteGoal(item.id)} text="Delete" />
        </MenuOptions>
      </Menu>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Health Logs</Text>

      {goals.length === 0 ? (
        <Text style={styles.empty}>No logs yet. Add one!</Text>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={renderGoal}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#e8f4f8" 
  },
  heading: { 
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20, 
    color: "#0f67cc" 
  },
  empty: { 
    fontSize: 16, 
    color: "#555", 
    textAlign: "center", 
    marginTop: 50 
  },
  goalCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#0f67cc"
  },
  description: { 
    marginTop: 8, 
    fontSize: 14, 
    color: "#555" 
  },
});
