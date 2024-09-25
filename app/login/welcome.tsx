import { useAuth } from "@/atoms/auth";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import fonts from "@/constants/fonts";
import { supabase } from "@/service/subapabse";
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

// import { Container } from './styles';

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), time));

const Welcome: React.FC = () => {
  const [openEnterModal, setOpenEnterModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const { login } = useAuth();

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
  }

  const register = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options:{
        data: {
          full_name: name
        }
      }
    });
    if (error) {
      console.log("Error register: ", error.message);
      Alert.alert("Erro ao cadastrar", error.message);
      return;
    }
    loginWithPassword();
  }

  const handleLogin = async () => {
    if (openRegisterModal) {
      if (password !== confirmPassword) {
        alert("As senhas não coincidem");
        return;
      }
      setLoading(true);
      await register();
      setLoading(false);
      return;
    }
    setLoading(true);
    await loginWithPassword();
    setLoading(false);
  };

  const handleEnter = () => {
    setOpenEnterModal(true);
  };

  const handleRegister = () => {
    setOpenRegisterModal(true);
  };

  const handleCloseModal = () => {
    setOpenEnterModal(false);
    setOpenRegisterModal(false);
    clearFields();
  };

  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <View style={styles.container}>
      <Image
        source={WelcomeImage}
        style={{ width: WIDTH, position: "absolute", top: 0 }}
        resizeMode="cover"
      />
      <Image
        source={Logo}
        style={{ width: 300, height: 200, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={styles.tagline}>
        Transforme seu corpo, alcance seus objetivos com Sampson.
      </Text>
      <View style={styles.starButtonContainer}>
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
          visible={openEnterModal || openRegisterModal}
          onDismiss={handleCloseModal}
          style={{
            justifyContent: "flex-end",
            margin: 0,
          }}
          contentContainerStyle={{
            backgroundColor: "white",
            paddingHorizontal: 20,
            paddingVertical: 20,
            borderTopEndRadius: 8,
            borderTopStartRadius: 8,
            gap: 10,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.Inter_Semibold,
              fontSize: 22,
              color: "#000",
              textAlign: "center",
            }}
          >
            Bem vindo ao Sampson
          </Text>

          {openRegisterModal && (
            <TextInput
              label="Nome"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={{
                backgroundColor: "white",
                color: "black",
              }}
              textColor="black"
              outlineColor="black"
            />
          )}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={{
              backgroundColor: "white",
              color: "black",
            }}
            textColor="black"
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
            style={{
              backgroundColor: "white",
              color: "black",
            }}
            textColor="black"
            outlineColor="black"
            autoCapitalize="none"
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />
          {openRegisterModal && (
            <TextInput
              label="Confirme a senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
              mode="outlined"
              style={{
                backgroundColor: "white",
                color: "black",
              }}
              textColor="black"
              outlineColor="black"
              autoCapitalize="none"
              right={
                <TextInput.Icon
                  icon={confirmPasswordVisible ? "eye-off" : "eye"}
                  onPress={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                />
              }
            />
          )}
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              padding: 15,
              borderRadius: 5,
              alignItems: "center",
            }}
            onPress={handleLogin}
          >
            <Text style={{ color: "white", fontFamily: fonts.Inter_Semibold }}>
              {loading
                ? "Carregando..."
                : openRegisterModal
                ? "Cadastrar"
                : "Entrar"}
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
  appName: {
    fontSize: 36,
    marginBottom: 20,
    fontFamily: fonts.Libre_Bold,
  },
  tagline: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
    fontFamily: fonts.Inter_Semibold,
  },
  starButtonContainer: {
    width: "100%",
    gap: 10,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    width: WIDTH - 40,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
    width: "100%",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  textStart: {
    color: Colors.white,
    fontFamily: fonts.Inter_Semibold,
    fontSize: 16,
  },
  textRegister: {
    color: Colors.primary,
    fontFamily: fonts.Inter_Semibold,
    fontSize: 16,
  },
});

export default Welcome;
