import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import fonts from "@/constants/fonts";
import { supabase } from "@/service/subapabse";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

export interface Video {
  created_at: string;
  description: string;
  id: number;
  image: string;
  name: string;
  url: string;
}

export const getVideos = async (): Promise<Video[]> => {
  const { data } = await supabase.from("videos").select("*");
  return data;
};

export type useNavigationProp = {
  navigate: (screen: "workout", params: { video: Video }) => void;
};

const WorkoutList = () => {
  const { data } = useQuery({ queryKey: ["videos"], queryFn: getVideos });

  const navigation = useNavigation<useNavigationProp>();

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.videoItem}
            onPress={() => navigation.navigate("workout", { video: item })}
          >
            <Image
              source={{
                uri: item.image,
              }}
              style={styles.videoThumbnail}
            />
            <View style={styles.videoInfo}>
              <Text
                style={styles.videoItemTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
              <Text
                style={styles.videoItemDescription}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  videoContainer: {
    marginBottom: 20,
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  videoTitle: {
    color: Colors.white,
    fontSize: 24,
    fontFamily: fonts.Inter_Bold,
  },
  videoDescription: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: fonts.Inter,
  },
  videoPlayer: {
    height: 200,
    width: "100%",
  },
  subHeader: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: fonts.Inter_Bold,
    marginBottom: 10,
  },
  videoItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  videoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  videoInfo: {
    marginLeft: 10,
  },
  videoItemTitle: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: fonts.Inter_Bold,
    width: Dimensions.get("window").width - 170,
  },
  videoItemDescription: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: fonts.Inter,
    width: Dimensions.get("window").width - 170,
  },
});

export default WorkoutList;
