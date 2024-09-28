import { supabase } from "./subapabse";

interface ContentVideo {
  updated_at: string;
  video_id: number;
  videos: Videos;
}

interface Videos {
  image: string;
  name: string;
}

const fetchLastWatchedVideos = async (
  user_id: string
): Promise<ContentVideo[]> => {
  const { data, error } = await supabase
    .from("log_video_watch")
    .select("video_id, updated_at, videos(name, image)") // Ajuste conforme necessário
    .eq("user_id", user_id)
    .order("updated_at", { ascending: false })
    .limit(10);

  if (error) throw new Error(error.message);
  return data as any;
};
export default fetchLastWatchedVideos;
