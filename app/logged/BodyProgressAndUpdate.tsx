import { useAuth } from "@/atoms/auth";
import Linechart from "@/components/Linechart";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import fonts from "@/constants/fonts";
import { supabase } from "@/service/subapabse";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import TextInputMask from "react-native-mask-input";
import { Button, TextInput } from "react-native-paper";

interface bodyInfo {
  breast: number;
  created_at: string;
  height: number;
  hip: number;
  id: number;
  user_id: string;
  waist: number;
  weight: number;
}

const getBodyHistory = async (id: string): Promise<bodyInfo[]> => {
  const { data: body, error: bodyErro } = await supabase
    .from("log_body_history")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .limit(12);

  if (bodyErro) throw bodyErro;
  return body;
};

const calcIMC = (height: number, weight: number) => {
  return weight / ((height / 100) * (height / 100));
};

const calcBodyFat = (bmi: number, birthdate: string, gender: string) => {
  const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
  if (gender === "male") {
    return 1.2 * bmi + 0.23 * age - 16.2;
  }
  return 1.2 * bmi + 0.23 * age - 5.4;
};

const BodyProgressAndUpdate = () => {
  const { profile } = useAuth();
  const { data, error, refetch } = useQuery({
    queryKey: ["bodyHistory", profile!.id],
    queryFn: () => getBodyHistory(profile!.id),
  });
  const lastBodyData = data?.[0];
  const [height, setHeight] = useState(lastBodyData?.height.toString() ?? "");
  const [weight, setWeight] = useState(lastBodyData?.weight.toString() ?? "");
  const [waist, setWaist] = useState(lastBodyData?.waist.toString() ?? "");
  const [hip, setHip] = useState(lastBodyData?.hip.toString() ?? "");
  const [chest, setChest] = useState(lastBodyData?.breast.toString() ?? "");
  const [loading, setLoading] = useState(false);

  const updateBodyData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("log_body_history").insert([
        {
          user_id: profile!.id,
          height: parseFloat(height),
          weight: parseFloat(weight.replace(",", ".")),
          waist: parseFloat(waist),
          hip: parseFloat(hip),
          breast: parseFloat(chest),
        },
      ]);

      if (error) throw error;
      refetch();
    } catch (error: any) {
      Alert.alert("Erro ao salvar dados", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!height || !weight || !waist || !hip || !chest) return;
    const newData = { height, weight, waist, hip, chest };
    updateBodyData();
  };

  const limit = 12;

  // Extraindo dados para os gráficos
  const weightData =
    data
      ?.slice(-limit)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .map((data) => ({
        value: data.weight,
        label: format(new Date(data.created_at), "MM/yy", { locale: ptBR }),
      })) ?? [];
  const bmiData =
    data
      ?.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .map((data) => ({
        value: calcIMC(data.height, data.weight),
        label: format(new Date(data.created_at), "MM/yy", { locale: ptBR }),
      })) ?? [];
  const bodyFatData =
    data
      ?.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .map((data) => ({
        value: calcBodyFat(
          calcIMC(data.height, data.weight),
          profile!.birthdate,
          profile!.gender
        ),
        label: format(new Date(data.created_at), "MM/yy", { locale: ptBR }),
      })) ?? [];

  useEffect(() => {
    if (data) {
      const lastData = data[0];
      setHeight(lastData.height.toString());
      setWeight(lastData.weight.toString());
      setWaist(lastData.waist.toString());
      setHip(lastData.hip.toString());
      setChest(lastData.breast.toString());
    }
  }, [data]);

  if (!data) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Evolução Corporal</Text>
      {data.length === 0 ? (
        <>
          <Text style={styles.subHeader}>Sem dados disponíveis</Text>
        </>
      ) : (
        <>
          <Text style={styles.chartTitle}>Peso</Text>
          <Linechart
            data={weightData}
            colors={(opacity = 1) => `rgba(134, 65, 244, ${opacity})`}
            legend={["Peso (Kg)"]}
            config={chartConfig}
            style={styles.chart}
          />

          <Text style={styles.chartTitle}>IMC</Text>
          <Linechart
            data={bmiData}
            config={chartConfig}
            colors={(opacity = 1) => `rgba(75, 192, 192, ${opacity})`}
            style={styles.chart}
            legend={["IMC"]}
          />

          <Text style={styles.chartTitle}>Índice de Gordura Corporal</Text>
          <Linechart
            data={bodyFatData}
            colors={(opacity = 1) => `rgba(255, 99, 132, ${opacity})`}
            config={chartConfig}
            style={styles.chart}
            legend={["Índice de Gordura Corporal (%)"]}
          />
        </>
      )}

      <Text style={styles.subHeader}>Atualizar Informações Corporais</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          label={<Text>Altura (cm) </Text>}
          mode="outlined"
          render={(props) => (
            <TextInputMask
              {...props}
              mask={[/\d/, /\d/, /\d/]}
              keyboardType="numeric"
            />
          )}
          error={!!height && parseFloat(height) < 9}
        />
        <TextInput
          label={<Text>Peso (kg)</Text>}
          value={weight}
          onChangeText={(value) =>
            setWeight(
              value
                .replace(/[^0-9,]/g, "") // Remove non-digits and commas
                .replace(/,(?=.*,)/g, "") // Remove extra commas
                .replace(/,(\d{3})\d+/, "$1")
            )
          }
          keyboardType="numeric"
          mode="outlined"
          error={!!weight && parseFloat(weight.replace(",", "")) < 30}
          style={styles.input}
        />

        <TextInput
          style={styles.input}
          value={waist}
          onChangeText={setWaist}
          keyboardType="numeric"
          mode="outlined"
          label={<Text>Cintura (cm) </Text>}
          render={(props) => (
            <TextInputMask
              {...props}
              mask={[/\d/, /\d/, /\d/]}
              keyboardType="numeric"
            />
          )}
          error={!!waist && parseFloat(waist) < 9}
        />
        <TextInput
          style={styles.input}
          value={hip}
          onChangeText={setHip}
          keyboardType="numeric"
          mode="outlined"
          label={<Text>Quadril (cm) </Text>}
          render={(props) => (
            <TextInputMask
              {...props}
              mask={[/\d/, /\d/, /\d/]}
              keyboardType="numeric"
            />
          )}
          error={!!hip && parseFloat(hip) < 9}
        />
        <TextInput
          style={styles.input}
          value={chest}
          onChangeText={setChest}
          keyboardType="numeric"
          mode="outlined"
          label={<Text>Peito (cm)</Text>}
          render={(props) => (
            <TextInputMask
              {...props}
              mask={[/\d/, /\d/, /\d/]}
              keyboardType="numeric"
            />
          )}
          error={!!chest && parseFloat(chest) < 9}
        />
        <Button
          onPress={handleSave}
          mode="contained"
          style={{
            borderRadius: 5,
            alignItems: "center",
            marginVertical: 10,
          }}
          loading={loading}
          disabled={loading}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: fonts.Inter_Bold,
            }}
          >
            SALVAR
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
};

const chartConfig: AbstractChartConfig = {
  backgroundColor: "transparent",
  backgroundGradientFrom: "transparent",
  backgroundGradientTo: "transparent",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#fff",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    textAlign: "center",
    fontSize: 24,
    fontFamily: fonts.Inter_Bold,
    color: Colors.white,
    marginVertical: 20,
  },
  subHeader: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: fonts.Inter_Bold,
    color: Colors.white,
    marginVertical: 20,
  },
  chartTitle: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: fonts.Inter_Bold,
    color: Colors.white,
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  formContainer: {
    padding: 10,
    marginBottom: 80,
  },
  input: {
    marginBottom: 15,
    color: Colors.white,
  },
});

export default BodyProgressAndUpdate;
