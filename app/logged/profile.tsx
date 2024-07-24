import ProfilePicture from "@/assets/images/profile.png";
import { useAuth } from "@/atoms/auth";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Caption, Title } from "react-native-paper";

const Profile = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <View style={styles.container}>
      <Avatar.Image source={ProfilePicture} size={100} />
      <Title style={styles.title}>John Doe</Title>
      <Caption style={styles.caption}>Software Engineer</Caption>
      <Button mode="contained" onPress={() => handleLogout()}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    marginTop: 4,
  },
});

export default Profile;
