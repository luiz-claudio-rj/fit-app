import { Video } from "@/app/logged/WorkoutList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WorkoutWatched = {
  watchedAt: Date;
  video: Video;
};

type WorkoutsHistoryState = {
  lastWorkoutsVideosWatched: WorkoutWatched[];
  addLastWorkoutVideo: (videoUrl: Video) => void;
};

export const useWorkoutsHistory = create(
  persist<WorkoutsHistoryState>(
    (set) => ({
      lastWorkoutsVideosWatched: [],
      addLastWorkoutVideo: (video) => {
        set((state) => ({
          lastWorkoutsVideosWatched: [
            ...state.lastWorkoutsVideosWatched.filter(
              (item) => item.video.url !== video.url
            ),
            {
              watchedAt: new Date(),
              video,
            },
          ],
        }));
      },
    }),
    {
      name: "workouts-History",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
