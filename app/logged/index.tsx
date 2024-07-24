import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";

import headerImage from "@/assets/images/header.png";
import profilePicture from "@/assets/images/profile.png";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import fonts from "@/constants/fonts";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { ScrollView } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const width = Dimensions.get("window").width;

export default function TabOneScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={[styles.container]}>
      <Image
        source={headerImage}
        resizeMode="cover"
        style={{
          width: width,
          height: 300,
          top: 0,
          position: "absolute",
          opacity: 0.8,
        }}
      />
      <View
        style={{
          padding: 20,
          paddingTop: insets.top + 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FontAwesome6 name="calendar-day" size={16} color="white" />
            <Text
              style={{
                color: "white",
                fontFamily: fonts.Inter,
                marginLeft: 10,
              }}
            >
              {format(new Date(), "PP", {
                locale: ptBR,
              })}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              console.log("pressed");
            }}
            style={{
              backgroundColor: "#ffffff30",
              padding: 10,
              borderRadius: 15,
            }}
          >
            <FontAwesome name="bell" size={20} color="white" />
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            source={profilePicture}
            style={{ width: 80, height: 80, borderRadius: 8 }}
          />
          <View>
            <Text
              style={{
                fontSize: 26,
                fontFamily: fonts.Inter_Bold,
              }}
            >
              Olá, Nafissa
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Text>
                <FontAwesome name="star" size={20} color="#eac012" /> 88% Saúde
              </Text>
              <Text>
                <FontAwesome name="star" size={20} color="#1448a2" /> PRO
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          padding: 20,
        }}
      >
        <Card
          style={{
            width: "100%",
            borderRadius: 20,
            marginRight: 20,
            padding: 20,
            backgroundColor: Colors.secondary,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.Inter_Bold,
              }}
            >
              {format(new Date(), "PP", {
                locale: ptBR,
              })}
            </Text>
            <Pressable
              onPress={() => {
                navigation.navigate("two");
              }}
              style={{
                backgroundColor: Colors.white,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontFamily: fonts.Inter,
                  textAlign: "center",
                }}
              >
                Ver Detalhes
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: fonts.Inter_Bold,
                  fontSize: 16,
                }}
              >
                Peso
              </Text>
              <Text
                style={{
                  fontFamily: fonts.Inter,
                  fontSize: 16,
                }}
              >
                65kg
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontFamily: fonts.Inter_Bold,
                  fontSize: 16,
                }}
              >
                Altura
              </Text>
              <Text
                style={{
                  fontFamily: fonts.Inter,
                  fontSize: 16,
                }}
              >
                1.65m
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontFamily: fonts.Inter_Bold,
                  fontSize: 16,
                }}
              >
                IMC
              </Text>
              <Text
                style={{
                  fontFamily: fonts.Inter,
                  fontSize: 16,
                }}
              >
                24.5
              </Text>
            </View>
          </View>
        </Card>
      </View>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontFamily: fonts.Inter_Bold,
            marginLeft: 20,
            marginBottom: 20,
          }}
        >
          Seu Progresso
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            paddingLeft: 20,
            marginBottom: 20,
          }}
        >
          <Card
            style={{
              width: 200,
              height: 200,
              borderRadius: 20,
              marginRight: 20,
              padding: 20,
            }}
          >
            <Text>Card 5</Text>
          </Card>
          <Card
            style={{
              width: 200,
              height: 200,
              borderRadius: 20,
              marginRight: 20,
              padding: 20,
            }}
          >
            <Text>Card 2</Text>
          </Card>
          <Card
            style={{
              width: 200,
              height: 200,
              borderRadius: 20,
              marginRight: 20,
              padding: 20,
            }}
          >
            <Text>Card 3</Text>
          </Card>
          <Card
            style={{
              width: 200,
              height: 200,
              borderRadius: 20,
              marginRight: 20,
              padding: 20,
            }}
          >
            <Text>Card 4</Text>
          </Card>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
