import { useContext, useState } from "react";
import { SafeAreaView, TextInput, Text, Pressable, StyleSheet, View } from "react-native";
import { GoalsContext } from "../../contexts/GoalsContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CreateGoal() {
  const { createGoal } = useContext(GoalsContext);
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);

  const healthIcons = [
    { name: "heart-outline", label: "Health", suggestion: "Stay hydrated, eat balanced meals, and rest well!" },
    { name: "happy-outline", label: "Happy", suggestion: "Keep doing what makes you happy and stay positive!" },
    { name: "sad-outline", label: "Sad", suggestion: "It's okay to feel down. Talk to someone or relax with self-care." },
    { name: "alert-circle-outline", label: "Angry", suggestion: "Take a deep breath and try to calm down. Avoid stress triggers." },
    // New icons added
    { name: "heart-half-outline", label: "Love", suggestion: "Spend quality time with loved ones or express your feelings." },
    { name: "fitness-outline", label: "Fitness", suggestion: "Exercise regularly and stay active for a healthy body and mind." },
    { name: "brain-outline", label: "Mental Health", suggestion: "Practice mindfulness, meditate, or take a short break to refresh your mind." },
    { name: "bed-outline", label: "Rest", suggestion: "Ensure adequate sleep and relaxation to recharge your body." },
  ];

  const handleIconSelect = (h) => {
    setIcon(h.name);
    setTitle(h.label);
    setDescription(h.suggestion);
  };

  const handleSave = async () => {
    if (!icon) return;
    await createGoal({ title, description, icon });
    setTitle("");
    setDescription("");
    setIcon(null);
    router.push("/goals");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>New Health Log</Text>

      <TextInput
        style={styles.input}
        placeholder="How are you feeling now?"
        value={title}
        editable={false}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Describe your health..."
        value={description}
        editable={false}
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
            <Ionicons
              name={h.name}
              size={28}
              color={icon === h.name ? "#fff" : "#0f67cc"}
            />
            <Text style={[styles.iconLabel, icon === h.name && { color: "#fff" }]}>
              {h.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Log</Text>
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
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  iconSelected: { 
    backgroundColor: "#0f67cc" 
  },
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
    alignItems: "center",
  },
  saveText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});
