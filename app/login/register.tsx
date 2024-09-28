import { useAuth } from "@/atoms/auth";
import fonts from "@/constants/fonts";
import { supabase } from "@/service/subapabse";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, Image, ImageBackground, ScrollView, View } from "react-native";
import TextInputMask from "react-native-mask-input";
import {
  Button,
  Text as PaperText,
  ProgressBar,
  TextInput,
  useTheme,
} from "react-native-paper";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
const Logo = require("../../assets/images/logo_white.png");
const Background = require("../../assets/images/background_signup.png");

interface FormData {
  email: string;
  password: string;
  name: string;
  birthdate: string;
  height: string;
  weight: string;
  waist: string;
  hip: string;
  chest: string;
}

const Text = (props: any) => (
  <PaperText
    {...props}
    style={[{ fontSize: 16, fontFamily: fonts.Inter }, { ...props.style }]}
  />
);

const isEmailValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const validateBirthdate = (birthdate: string) => {
  if (!birthdate) return true;
  const [day, month, year] = birthdate.split("/");
  if (!day || !month || !year) return false;
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return false;
  if (parseInt(day) < 1 || parseInt(day) > 31) return false;
  if (parseInt(month) < 1 || parseInt(month) > 12) return false;
  if (parseInt(year) < 1900 || parseInt(year) > new Date().getFullYear())
    return false;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date instanceof Date && !isNaN(date.getTime());
};
// Função auxiliar para inserir ou atualizar roles do usuário
const upsertUserRole = async (userId: string, role: string) => {
  const { error } = await supabase.from("user_roles").upsert({
    user_id: userId,
    role: role,
  });

  if (error) throw new Error(error.message);
};
const SignupScreen = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    birthdate: "",
    height: "",
    weight: "",
    waist: "",
    hip: "",
    chest: "",
  });

  const { login } = useAuth();
  const { colors } = useTheme();

  const canNextPage = () => {
    if (step === 1) {
      return (
        !!formData.email &&
        isEmailValid(formData.email) &&
        !!formData.password &&
        !!formData.name &&
        formData.name.length >= 3 &&
        validateBirthdate(formData.birthdate) &&
        !!formData.birthdate &&
        formData.birthdate.length === 10 &&
        formData.password.length >= 6
      );
    } else if (step === 2) {
      return (
        !!formData.height &&
        formData.height.length > 2 &&
        !!formData.weight &&
        formData.weight.length > 2 &&
        !!formData.waist &&
        formData.waist.length > 2 &&
        !!formData.hip &&
        formData.hip.length > 2 &&
        !!formData.chest &&
        formData.chest.length > 2
      );
    }
    return false;
  };

  const handleNext = async () => {
    if (step === 1) {
      setLoading(true);
      try {
        const { error, data } = await supabase
          .from("profiles")
          .select("email")
          .eq("email", formData.email.trim().toLowerCase());

        if (data?.length) {
          alert("E-mail já cadastrado");
          return;
        }
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setLoading(false);
      }
    }
    if (step < 3) setStep(step + 1);
  };

  const navigation = useNavigation();

  const handleBack = () => {
    if (step === 1) {
      navigation.goBack();
      return;
    }
    if (step > 1) setStep(step - 1);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const [day, month, year] = formData.birthdate.split("/");
    const dataToSend = {
      full_name: formData.name,
      email: formData.email,
      roles: isCoach ? "COACH,STUDENT" : "STUDENT",
      username: formData.email, // ou gere um valor de username, como o próprio email
      birthdate: new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        .toISOString()
        .split("T")[0],
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      waist: parseInt(formData.waist),
      hip: parseInt(formData.hip),
      chest: parseInt(formData.chest),
    };

    try {
      // Cadastrar o usuário
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw new Error(error.message);

      if (!data || !data.user) throw new Error("Erro ao cadastrar usuário");

      // Inserir ou atualizar dados do perfil
      const { error: errorProfiles } = await supabase.from("profiles").upsert({
        id: data.user?.id,
        full_name: dataToSend.full_name,
        isActive: true,
        email: dataToSend.email,
        birthdate: dataToSend.birthdate,
      });

      if (errorProfiles) throw new Error(errorProfiles.message);

      // Inserir ou atualizar roles
      await upsertUserRole(data.user?.id, "STUDENT");

      if (isCoach) {
        await upsertUserRole(data.user?.id, "COACH");
      }

      await supabase.from("log_body_history").insert([
        {
          user_id: data.user?.id,
          height: dataToSend.height,
          weight: dataToSend.weight,
          waist: dataToSend.waist,
          hip: dataToSend.hip,
          breast: dataToSend.chest,
        },
      ]);

      Alert.alert("Cadastro realizado com sucesso!", "", [
        {
          text: "OK",
          onPress: () =>
            login({
              email: formData.email,
              password: formData.password,
            }),
        },
      ]);
    } catch (error: any) {
      console.error("Error: ", error);
      alert("Erro ao cadastrar: " + error!.message!);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={Background}
      style={{ flex: 1, justifyContent: "center" }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <Image
          source={Logo}
          style={{
            width: 300,
            height: 200,
            marginVertical: 20,
            alignSelf: "center",
          }}
          resizeMode="contain"
        />
        <ProgressBar
          progress={step / 2}
          color={colors.primary}
          style={{ marginBottom: 20 }}
        />

        {step === 1 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TextInput
              label={<Text>E-mail</Text>}
              value={formData.email}
              onChangeText={(value) =>
                handleInputChange("email", value.trim().toLowerCase())
              }
              keyboardType="email-address"
              style={{ marginBottom: 10 }}
              mode="outlined"
              error={!!formData.email.length && !isEmailValid(formData.email)}
            />
            <TextInput
              label={<Text>Senha</Text>}
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry={!seePassword}
              style={{ marginBottom: 10 }}
              mode="outlined"
              right={
                <TextInput.Icon
                  icon={seePassword ? "eye" : "eye-off"}
                  onPress={() => setSeePassword(!seePassword)}
                />
              }
              error={!!formData.password && formData.password.length < 6}
            />
            <TextInput
              label={<Text>Nome</Text>}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              style={{ marginBottom: 10 }}
              mode="outlined"
              error={!!formData.name && formData.name.length < 3}
            />
            <TextInput
              label={<Text>Data de Nascimento</Text>}
              value={formData.birthdate}
              onChangeText={(value) => handleInputChange("birthdate", value)}
              style={{ marginBottom: 10 }}
              mode="outlined"
              error={!validateBirthdate(formData.birthdate)}
              render={(props) => (
                <TextInputMask
                  {...props}
                  mask={[
                    /\d/,
                    /\d/,
                    "/",
                    /\d/,
                    /\d/,
                    "/",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ]}
                />
              )}
            />

            <Button
              mode={isCoach ? "contained" : "outlined"}
              style={{ marginBottom: 10 }}
              onPress={() => setIsCoach(!isCoach)}
            >
              <Text>Quero ser um coach</Text>
            </Button>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TextInput
              label={<Text>Altura (cm)</Text>}
              value={formData.height}
              onChangeText={(value) => handleInputChange("height", value)}
              keyboardType="numeric"
              style={{ marginBottom: 10 }}
              render={(props) => (
                <TextInputMask
                  {...props}
                  mask={[/\d/, /\d/, /\d/]}
                  keyboardType="numeric"
                />
              )}
              mode="outlined"
              error={!!formData.height && formData.height.length < 2}
            />
            <TextInput
              label={<Text>Peso (kg)</Text>}
              value={formData.weight}
              onChangeText={(value) => handleInputChange("weight", value)}
              keyboardType="numeric"
              style={{ marginBottom: 10 }}
              mode="outlined"
              render={(props) => (
                <TextInputMask
                  {...props}
                  mask={[/\d/, /\d/, /\d/]}
                  keyboardType="numeric"
                />
              )}
              error={!!formData.weight && formData.weight.length < 2}
            />
            <TextInput
              label={<Text>Cintura (cm)</Text>}
              value={formData.waist}
              onChangeText={(value) => handleInputChange("waist", value)}
              keyboardType="numeric"
              style={{ marginBottom: 10 }}
              mode="outlined"
              render={(props) => (
                <TextInputMask
                  {...props}
                  mask={[/\d/, /\d/, /\d/]}
                  keyboardType="numeric"
                />
              )}
              error={!!formData.waist && formData.waist.length < 2}
            />
            <TextInput
              label={<Text>Quadril (cm)</Text>}
              value={formData.hip}
              onChangeText={(value) => handleInputChange("hip", value)}
              keyboardType="numeric"
              style={{ marginBottom: 10 }}
              mode="outlined"
              render={(props) => (
                <TextInputMask
                  {...props}
                  mask={[/\d/, /\d/, /\d/]}
                  keyboardType="numeric"
                />
              )}
              error={!!formData.hip && formData.hip.length < 2}
            />
            <TextInput
              label={<Text>Peito (cm)</Text>}
              value={formData.chest}
              onChangeText={(value) => handleInputChange("chest", value)}
              keyboardType="numeric"
              style={{ marginBottom: 10 }}
              mode="outlined"
              render={(props) => (
                <TextInputMask
                  {...props}
                  mask={[/\d/, /\d/, /\d/]}
                  keyboardType="numeric"
                />
              )}
              error={!!formData.chest && formData.chest.length < 2}
            />
          </Animated.View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button mode="outlined" onPress={handleBack}>
            Voltar
          </Button>
          {step < 2 ? (
            <Button
              mode="contained"
              onPress={handleNext}
              disabled={!canNextPage() || loading}
              loading={loading}
            >
              Próximo
            </Button>
          ) : (
            <Button mode="contained" onPress={handleSubmit}>
              Enviar
            </Button>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default SignupScreen;
