import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, ActivityIndicator, Pressable } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { doc, query, collection, where, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iconStats, setIconStats] = useState({});
  const router = useRouter();

  const allIcons = [
    "heart-outline",
    "happy-outline",
    "sad-outline",
    "alert-circle-outline",
    "heart-half-outline",
    "fitness-outline",
    "brain-outline",
    "bed-outline",
  ];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const refUser = doc(db, "users", user.uid);

    const unsubscribeUser = onSnapshot(
      refUser,
      (snap) => {
        if (snap.exists()) {
          setUserData((prev) => ({ ...(prev || {}), ...snap.data() }));
        }
      },
      (err) => console.error("Error fetching user profile:", err)
    );

    const goalsQuery = query(collection(db, "goals"), where("userId", "==", user.uid));

    const unsubscribeGoals = onSnapshot(goalsQuery, (snapshot) => {
      const total = snapshot.size;
      const stats = {};
      allIcons.forEach((iconName) => (stats[iconName] = 0));

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.icon) stats[data.icon] = (stats[data.icon] || 0) + 1;
      });

      const percentages = {};
      allIcons.forEach((iconName) => {
        percentages[iconName] = total ? Math.round((stats[iconName] / total) * 100) : 0;
      });

      setIconStats(percentages);
      setUserData((prev) => ({ ...(prev || {}), goalCount: total }));
    });

    setLoading(false);
    return () => {
      unsubscribeUser();
      unsubscribeGoals();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const iconMap = {
    "heart-outline": { label: "Health", color: "#f44336" },
    "happy-outline": { label: "Happy", color: "#ffeb3b" },
    "sad-outline": { label: "Sad", color: "#2196f3" },
    "alert-circle-outline": { label: "Angry", color: "#ff5722" },
    "heart-half-outline": { label: "Love", color: "#e91e63" },
    "fitness-outline": { label: "Fitness", color: "#4caf50" },
    "brain-outline": { label: "Mental", color: "#9c27b0" },
    "bed-outline": { label: "Rest", color: "#795548" },
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Your Data</Text>

      <View style={styles.centerBox}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="medical-bag" size={120} color="#0f67cc" />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.row}>
            Name: {userData?.firstName} {userData?.mi ? userData.mi + "." : ""} {userData?.lastName}
          </Text>
          <Text style={styles.row}>Username: {userData?.username}</Text>
          <Text style={styles.row}>Bio: {userData?.bio}</Text>
          <Text style={styles.row}>Health Logs Created: {userData?.goalCount || 0}</Text>

          <Text style={[styles.row, { borderBottomWidth: 0, marginTop: 10 }]}>Feelings Distribution:</Text>

          <View style={styles.iconStatsRow}>
            {allIcons.map((iconName) => (
              <View key={iconName} style={styles.iconStat}>
                <View style={[styles.circle, { backgroundColor: iconMap[iconName].color + "33" }]}>
                  <Ionicons name={iconName} size={28} color={iconMap[iconName].color} />
                  <Text style={styles.iconPercent}>{iconStats[iconName] || 0}%</Text>
                </View>
                <Text style={styles.iconLabel}>{iconMap[iconName].label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, 
    padding: 20,
     backgroundColor: "#f9f9f9" 
    },
  heading: { 
    fontSize: 24, 
    fontWeight: "bold", 
  
    marginBottom: 20, 
    textAlign: "left" 
  },
  centerBox: { 
    flex: 1, 
    justifyContent: "center",
     alignItems: "center" 
    },
  iconContainer: { 
    marginBottom: 18,
     alignItems: "center", 
     justifyContent: "center" 
    },
  infoBox: {
    marginTop: "5%",
    width: "95%",
    borderWidth: 1,
    borderColor: "#a3a0a0b4",
    borderRadius: 12,
    padding: 20,
    backgroundColor: "#d1cecee5",
    marginBottom: 20,
  },
  row: { 
    fontSize: 16, 
    paddingVertical: 8,
     borderBottomWidth: 1, 
     borderBottomColor: "#a3a0a0b4"
     },
  iconStatsRow: { 
    flexDirection: "row",
     flexWrap: "wrap", 
     marginTop: 10, 
     justifyContent: "space-around" 
    },
  iconStat: { 
    width: "22%", 
    alignItems: "center",
     marginBottom: 16 
    },
  circle: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: "center",
     alignItems: "center"
     },
  iconPercent: { 
    fontSize: 14, 
    fontWeight: "bold", 
    marginTop: 2 
  },
  iconLabel: { 
    fontSize: 12, 
    textAlign: "center",
     marginTop: 4 
    },
  logoutButton: { 
    marginTop: 20, 
    backgroundColor: "#1a4dacff",
     paddingVertical: 14, 
     paddingHorizontal: "20%", 
     borderRadius: 8 
    },
  logoutText: {
     color: "white", 
     fontWeight: "bold", 
     fontSize: 16 
    },
});
