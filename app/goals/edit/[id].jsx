import { useContext, useState, useEffect } from "react";
import { SafeAreaView, TextInput, Text, Pressable, StyleSheet, View } from "react-native";
import { GoalsContext } from "../../../contexts/GoalsContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EditGoal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { goals, updateGoal } = useContext(GoalsContext);

  const goal = goals.find((g) => g.id === id);
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [icon, setIcon] = useState(goal?.icon || null);

  useEffect(() => {
    if (!goal) router.back();
  }, []);

  const healthIcons = [
    { name: "heart-outline", label: "Health", suggestion: "Feeling healthy and energetic." },
    { name: "happy-outline", label: "Happy", suggestion: "Feeling joyful and positive." },
    { name: "sad-outline", label: "Sad", suggestion: "Feeling a bit down today." },
    { name: "alert-circle-outline", label: "Angry", suggestion: "Feeling frustrated or angry." },
    { name: "heart-half-outline", label: "Love", suggestion: "Feeling affectionate or loving." },
    { name: "fitness-outline", label: "Fitness", suggestion: "Feeling active and strong." },
    { name: "brain-outline", label: "Mental", suggestion: "Focusing on mental health." },
    { name: "bed-outline", label: "Rest", suggestion: "Feeling tired and need rest." },
  ];

  const handleIconSelect = (h) => {
    setIcon(h.name);
    setTitle(h.label);
    setDescription(h.suggestion);
  };

  const handleSave = async () => {
    if (!icon) return;
    await updateGoal(id, { title, description, icon });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Edit Health Log</Text>

      <TextInput
        style={styles.input}
        placeholder="How are you feeling now?"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Describe your health..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.subheading}>Choose an icon:</Text>
      <View style={styles.iconRow}>
        {healthIcons.map((h) => (
          <Pressable
            key={h.name}
            style={[styles.iconButton, icon === h.name && styles.iconSelected]}
            onPress={() => handleIconSelect(h)}
          >
            <Ionicons name={h.name} size={28} color={icon === h.name ? "#fff" : "#0f67cc"} />
            <Text style={[styles.iconLabel, icon === h.name && { color: "#fff" }]}>{h.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
     padding: 20, 
     backgroundColor: "#e8f4f8" 
    },
  heading: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#0f67cc",
     marginBottom: 20 
    },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d1ceceb4",
  },
  subheading: {
     fontSize: 16, 
     fontWeight: "600",
      marginBottom: 10, 
      color: "#555" 
    },
  iconRow: { 
    flexDirection: "row", 
    flexWrap: "wrap",
     justifyContent: "space-between",
      marginBottom: 20 
    },
  iconButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    width: 70,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginBottom: 12,
  },
  iconSelected: { backgroundColor: "#0f67cc" },
  iconLabel: { 
    marginTop: 6, 
    fontSize: 12,
     color: "#0f67cc", 
     textAlign: "center"
     },
  saveButton: { 
    backgroundColor: "#0f67cc",
     padding: 16, 
     borderRadius: 12, 
     alignItems: "center"
     },
  saveText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold"
   },
});
