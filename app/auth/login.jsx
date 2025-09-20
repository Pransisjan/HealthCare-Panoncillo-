import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TextInput, Pressable, Alert, View } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/"); // Redirect to main page
    } catch (error) {
      console.log("Login error:", error);

      // Friendly messages for common errors
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        Alert.alert("Login Failed", "Invalid username or password.");
      } else if (error.code === "auth/too-many-requests") {
        Alert.alert("Login Failed", "Too many failed attempts. Please try again later.");
      } else {
        Alert.alert("Login Failed", error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      <View style={styles.signupContainer}>
        <Text style={styles.text}>Don’t have an account? </Text>
        <Pressable onPress={() => router.push("/auth/signup")}>
          <Text style={styles.signupText}>Sign up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#e8f4f8",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f67cc",
    marginBottom: 20,
  },
  input: {
    width: "100%",
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
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: "gray",
  },
  signupText: {
    fontSize: 16,
    color: "#0f67cc",
    fontWeight: "bold",
  },
});
