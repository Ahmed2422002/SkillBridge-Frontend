import { learningPaths } from "../data/coursePlaylists";
import { fetchPlaylistVideos } from "./youtube";
import { isVideoCompleted } from "./progress";
import { addEvent, getCurrentUser } from "../api";

export async function notifyCategoryProgress(pathKey, categoryKey) {
  const user = getCurrentUser();
  const path = learningPaths[pathKey];
  const category = path && path.categories.find((c) => c.key === categoryKey);
  if (!user.email || !category) return;

  try {
    const vids = await fetchPlaylistVideos(category.playlistId, 100);
    if (vids.length === 0) return;
    if (vids.every((v) => isVideoCompleted(pathKey, v.id))) {
      addEvent({
        type: "course_completed",
        studentEmail: user.email,
        pathKey,
        key: categoryKey,
        label: category.label,
        pathLabel: path.title,
      });
    }
  } catch {}
}