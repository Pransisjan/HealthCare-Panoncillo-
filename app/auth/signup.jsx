import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TextInput, Pressable, Alert, ScrollView, View } from "react-native";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [mi, setMi] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleSignup = async () => {
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        mi,
        lastName,
        bio,
        username,
        email,
        createdAt: new Date()
      });

      await signOut(auth);

      Alert.alert("Success", "Account created successfully! Please log in.");
      router.replace("/auth/login");
    } catch (error) {
      console.log("Signup error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.row}>
          <TextInput
            placeholder="First Name"
            style={[styles.input, { flex: 2, marginRight: 8 }]}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="M.I."
            style={[styles.input, { flex: 1 }]}
            value={mi}
            onChangeText={setMi}
          />
        </View>

        <TextInput
          placeholder="Last Name"
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          placeholder="Bio (optional)"
          style={styles.input}
          value={bio}
          onChangeText={setBio}
        />

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          placeholder="Confirm Password"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#e8f4f8" 
  },
  scroll: { 
    flexGrow: 1, 
    justifyContent: "center" 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center",
    color: "#0f67cc",
  },
  row: { 
    flexDirection: "row", 
    marginBottom: 12 
  },
  input: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: "#d1ceceb4",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0f67cc",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
});
