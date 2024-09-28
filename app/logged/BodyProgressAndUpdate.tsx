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

function calculateBodyMetrics(bodyInfo: bodyInfo, birthdate: string, gender: string) {
  const heightInMeters = bodyInfo.height / 100;
  const weight = bodyInfo.weight;
  const age = new Date().getFullYear() - new Date(birthdate).getFullYear();


  // Calcular IMC
  const bmi = weight / (heightInMeters * heightInMeters);

  // Calcular RCQ (Relação Cintura-Quadril)
  const waistToHipRatio = bodyInfo.waist / bodyInfo.hip;

  // Calcular IGC (Índice de Gordura Corporal)
  let bodyFatPercentage;
  if (gender === 'male') {
    bodyFatPercentage = 1.20 * bmi + 0.23 * age - 16.2;
  } else {
    bodyFatPercentage = 1.20 * bmi + 0.23 * age - 5.4;
  }

  // Calcular Área de Superfície Corporal (ASC) usando a fórmula de Mosteller
  const bsa = Math.sqrt((bodyInfo.height * weight) / 3600);

  // Calcular Taxa Metabólica Basal (TMB) usando a fórmula de Harris-Benedict
  let bmr;
  if (gender === 'male') {
    bmr = 88.36 + (13.4 * weight) + (4.8 * bodyInfo.height) - (5.7 * age);
  } else {
    bmr = 447.6 + (9.2 * weight) + (3.1 * bodyInfo.height) - (4.3 * age);
  }

  // Calcular RCAlt (Relação Cintura-Altura)
  const waistToHeightRatio = bodyInfo.waist / bodyInfo.height;

  return {
    weight,
    bmi: parseFloat(bmi.toFixed(2)),
    waistToHipRatio: parseFloat(waistToHipRatio.toFixed(2)),
    bodyFatPercentage: parseFloat(bodyFatPercentage.toFixed(2)),
    bsa: parseFloat(bsa.toFixed(2)),
    bmr: parseFloat(bmr.toFixed(2)),
    waistToHeightRatio: parseFloat(waistToHeightRatio.toFixed(2)),
  };
}


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

  const bodyRegister = data?.slice(-limit).sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).map((data) => ({
    value: calculateBodyMetrics(data, profile.birthdate, profile.gender),
    label: format(new Date(data.created_at), "MM/yy", { locale: ptBR }),
  })) ?? [];

  // Extraindo dados para os gráficos
  const weightData = bodyRegister.map((data) => ({
    value: data.value.weight,
    label: data.label,
  }));
  const bmiData = bodyRegister.map((data) => ({
    value: data.value.bmi,
    label: data.label,
    }));
  const bodyFatData = bodyRegister.map((data) => ({
    value: data.value.bodyFatPercentage,
    label: data.label,
    }));
  const waistToHipData = bodyRegister.map((data) => ({
    value: data.value.waistToHipRatio,
    label: data.label,
    }));
  const bsaData = bodyRegister.map((data) => ({
    value: data.value.bsa,
    label: data.label,
    }));
  const bmrData = bodyRegister.map((data) => ({
    value: data.value.bmr,
    label: data.label,
    }));
  const waistToHeightData = bodyRegister.map((data) => ({
    value: data.value.waistToHeightRatio,
    label: data.label,
  }));
  
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

          <Text style={styles.chartTitle}>Relação Cintura-Quadril</Text>
          <Linechart
            data={waistToHipData}
            colors={(opacity = 1) => `rgba(255, 206, 86, ${opacity})`}
            config={chartConfig}
            style={styles.chart}
            legend={["Relação Cintura-Quadril"]}
          />

          <Text style={styles.chartTitle}>Área de Superfície Corporal</Text>
          <Linechart
            data={bsaData}
            colors={(opacity = 1) => `rgba(54, 162, 235, ${opacity})`}
            config={chartConfig}
            style={styles.chart}
            legend={["Área de Superfície Corporal"]}
          />

          <Text style={styles.chartTitle}>Taxa Metabólica Basal</Text>
          <Linechart
            data={bmrData}
            colors={(opacity = 1) => `rgba(153, 102, 255, ${opacity})`}
            config={chartConfig}
            style={styles.chart}
            legend={["Taxa Metabólica Basal"]}
          />

          <Text style={styles.chartTitle}>Relação Cintura-Altura</Text>
          <Linechart
            data={waistToHeightData}
            colors={(opacity = 1) => `rgba(255, 159, 64, ${opacity})`}
            config={chartConfig}
            style={styles.chart}
            legend={["Relação Cintura-Altura"]}
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
  backgroundGradientFrom: "transparent",
  backgroundGradientTo: "transparent",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  

  propsForDots: {
    r: "5",
    strokeWidth: "1",
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
