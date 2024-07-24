import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BodyData {
  date: string;
  height: string;
  weight: string;
  age: string;
  waist: string;
  hip: string;
  chest: string;
  bmi: string;
  bodyFat: string;
}

interface BodyStore {
  bodyDataHistory: BodyData[];
  updateBodyData: (newData: Omit<BodyData, "date" | "bmi" | "bodyFat">) => void;
}

const onlyNumbers = (value: string) => value.replace(/[^0-9]/g, "");

const calculateBMI = (weight: string, height: string): string => {
  const weightNum = parseFloat(onlyNumbers(weight));
  const heightNum = parseFloat(onlyNumbers(height));
  if (!weightNum || !heightNum) return "";
  const heightInMeters = heightNum / 100;
  return (weightNum / (heightInMeters * heightInMeters)).toFixed(2);
};

const calculateBodyFat = (weight: string, waist: string): string => {
  const weightNum = parseFloat(onlyNumbers(weight));
  const waistNum = parseFloat(onlyNumbers(waist));
  if (!weightNum || !waistNum) return "";
  return ((waistNum / weightNum) * 100).toFixed(2);
};

const useBodyStore = create(
  persist<BodyStore>(
    (set) => ({
      bodyDataHistory: [
        {
          date: "2024-01-01T00:00:00.000Z",
          height: "170",
          weight: "70",
          age: "30",
          waist: "80",
          hip: "90",
          chest: "100",
          bmi: calculateBMI("70", "170"),
          bodyFat: calculateBodyFat("70", "80"),
        },
        {
          date: "2024-02-01T00:00:00.000Z",
          height: "170",
          weight: "72",
          age: "30",
          waist: "82",
          hip: "90",
          chest: "100",
          bmi: calculateBMI("72", "170"),
          bodyFat: calculateBodyFat("72", "82"),
        },
        {
          date: "2024-03-01T00:00:00.000Z",
          height: "170",
          weight: "71",
          age: "30",
          waist: "81",
          hip: "90",
          chest: "100",
          bmi: calculateBMI("71", "170"),
          bodyFat: calculateBodyFat("71", "81"),
        },
      ],
      updateBodyData: (newData) =>
        set((state) => {
          const date = new Date().toISOString();
          const bmi = calculateBMI(newData.weight, newData.height);
          const bodyFat = calculateBodyFat(newData.weight, newData.waist);
          const updatedData = { ...newData, bmi, bodyFat, date };

          return {
            bodyDataHistory: [...state.bodyDataHistory, updatedData],
          };
        }),
    }),
    {
      name: "bodyHistor-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useBodyStore;
