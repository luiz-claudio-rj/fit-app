import { useAuth } from "@/atoms/auth";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors"; // Certifique-se de que este arquivo está atualizado com as novas cores
import fonts from "@/constants/fonts";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Modal, Portal, TextInput } from "react-native-paper";

const WelcomeImage = require("../../assets/images/welcome.jpg");
const Logo = require("../../assets/images/logo_white.png");

const WIDTH = Dimensions.get("window").width;

const Welcome: React.FC = () => {
  const [openEnterModal, setOpenEnterModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login } = useAuth();
  const navigation = useNavigation();

  const loginWithPassword = async () => {
    const { error } = await login({
      email,
      password,
    });
    if (error) {
      console.log("Error Login: ", error.message);
      Alert.alert("Erro ao logar", error.message);
      return;
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    await loginWithPassword();
    setLoading(false);
  };

  const handleEnter = () => {
    setOpenEnterModal(true);
  };

  const handleRegister = () => {
    navigation.navigate("register");
  };

  const handleCloseModal = () => {
    setOpenEnterModal(false);
    clearFields();
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <View style={styles.container}>
      <Image
        source={WelcomeImage}
        style={styles.welcomeImage}
        resizeMode="cover"
      />
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.tagline}>
        Transforme seu corpo, alcance seus objetivos com Sampson.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          activeOpacity={0.8}
          onPress={handleEnter}
        >
          <Text style={styles.textStart}>ENTRAR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSecondary}
          activeOpacity={0.8}
          onPress={handleRegister}
        >
          <Text style={styles.textRegister}>CADASTRE-SE</Text>
        </TouchableOpacity>
      </View>
      <Portal>
        <Modal
          visible={openEnterModal}
          onDismiss={handleCloseModal}
          style={styles.modal}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Bem vindo ao Sampson</Text>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            outlineColor="black"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            mode="outlined"
            style={styles.input}
            outlineColor="black"
            autoCapitalize="none"
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>
              {loading ? "Carregando..." : "Entrar"}
            </Text>
          </TouchableOpacity>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  welcomeImage: {
    width: WIDTH,
    position: "absolute",
    top: 0,
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
    fontFamily: fonts.Inter_Semibold,
    color: Colors.onSurface, // Use a cor do tema para texto
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  buttonPrimary: {
    backgroundColor: Colors.secondary,
    width: WIDTH - 40,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: Colors.background,
    width: "100%",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  textStart: {
    color: Colors.onPrimary, // Texto sobre a cor primária
    fontFamily: fonts.Inter_Semibold,
    fontSize: 16,
  },
  textRegister: {
    color: Colors.onSurface, // Texto sobre a cor secundária
    fontFamily: fonts.Inter_Semibold,
    fontSize: 16,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    gap: 10,
  },
  modalTitle: {
    fontFamily: fonts.Inter_Semibold,
    fontSize: 22,
    color: Colors.onSurface, // Texto sobre superfície
    textAlign: "center",
  },
  input: {
    // backgroundColor: "white",
    // color: "black",
  },
  loginButton: {
    backgroundColor: Colors.secondary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  loginButtonText: {
    color: Colors.onSecondary,
    fontFamily: fonts.Inter_Semibold,
  },
});

export default Welcome;
