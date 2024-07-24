import useBodyStore from "@/atoms/bodyStore";
import Linechart from "@/components/Linechart";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import fonts from "@/constants/fonts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { TextInput } from "react-native-paper";

const minValue = (minValue: number, value: number) => {
  if (value < minValue) return minValue;
  return value;
};

const BodyProgressAndUpdate = () => {
  const { bodyDataHistory, updateBodyData } = useBodyStore();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [chest, setChest] = useState("");

  const handleSave = () => {
    if (!height || !weight || !age || !waist || !hip || !chest) return;
    const newData = { height, weight, age, waist, hip, chest };
    updateBodyData(newData);
  };

  const limit = 12;

  // Extraindo dados para os gráficos
  const weightData = bodyDataHistory.slice(-limit).map((data) => ({
    value: parseFloat(data.weight),
    label: format(new Date(data.date), "MM/yy", { locale: ptBR }),
  }));
  const bmiData = bodyDataHistory.map((data) => ({
    value: parseFloat(data.bmi),
    label: format(new Date(data.date), "MM/yy", { locale: ptBR }),
  }));
  const bodyFatData = bodyDataHistory.map((data) => ({
    value: parseFloat(data.bodyFat),
    label: format(new Date(data.date), "MM/yy", { locale: ptBR }),
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Evolução Corporal</Text>
      {bodyDataHistory.length === 0 ? (
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
        />
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          label={<Text>Peso (kg) </Text>}
          mode="outlined"
        />
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          label={<Text>Idade </Text>}
          mode="outlined"
        />
        <TextInput
          style={styles.input}
          value={waist}
          onChangeText={setWaist}
          keyboardType="numeric"
          mode="outlined"
          label={<Text>Cintura (cm) </Text>}
        />
        <TextInput
          style={styles.input}
          value={hip}
          onChangeText={setHip}
          keyboardType="numeric"
          mode="outlined"
          label={<Text>Quadril (cm) </Text>}
        />
        <TextInput
          style={styles.input}
          value={chest}
          onChangeText={setChest}
          keyboardType="numeric"
          mode="outlined"
          label={<Text>Peito (cm)</Text>}
        />
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: Colors.secondary,
            padding: 15,
            borderRadius: 5,
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              color: Colors.white,
              textAlign: "center",
              fontFamily: fonts.Inter_Bold,
            }}
          >
            SALVAR
          </Text>
        </TouchableOpacity>
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
    backgroundColor: Colors.darkGray,
  },
});

export default BodyProgressAndUpdate;
