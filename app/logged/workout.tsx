import { useWorkoutsHistory } from "@/atoms/workoutsHistory";
import { Text } from "@/components/Themed";
import VideoPlayer from "@/components/VideoPlayer";
import Colors from "@/constants/Colors";
import fonts from "@/constants/fonts";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useNavigationProps } from "./_layout";

export interface Video {
  created_at: string;
  description: string;
  id: number;
  image: string;
  name: string;
  url: string;
}
interface Props {
  route: {
    params: {
      video: Video;
    };
  };
}
const Workout = ({ route }: Props) => {
  const { data: videos } = useQuery<Video[]>({ queryKey: ["videos"] });
  const setVideoHistory = useWorkoutsHistory(
    (state) => state.addLastWorkoutVideo
  );
  const navigation = useNavigation<useNavigationProps>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoHistory(route.params.video);
      console.log("video watched");
    }, 3000);

    return () => clearTimeout(timer);
  }, [route.params.video]);

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <VideoPlayer video={route.params.video.url} />

        <Text style={styles.videoTitle}>{route.params.video.name}</Text>
        <ScrollView
          style={{ maxHeight: 200 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text style={styles.videoDescription}>
            {route.params.video.description}
          </Text>
        </ScrollView>
      </View>
      <Text style={styles.subHeader}>Outros vídeos</Text>
      <FlatList
        data={videos?.filter((video) => video.id !== route.params.video.id)}
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
    paddingHorizontal: 20,
    paddingVertical: StatusBar.currentHeight,
  },
  videoContainer: {
    marginBottom: 20,
    width: "100%",
    height: 450,
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

export default Workout;
