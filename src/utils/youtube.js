
const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const PLAYLIST_URL = "https://www.googleapis.com/youtube/v3/playlistItems";
const VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

// يحوّل مدة ISO 8601 (زي PT24M15S) لشكل مقروء (24:15)
function formatDuration(iso) {
  if (!iso) return "";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  const pad = (n) => String(n).padStart(2, "0");
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  return `${minutes}:${pad(seconds)}`;
}

// يجيب مدة عدة فيديوهات دفعة وحدة (يوتيوب يسمح بحد أقصى 50 معرف بكل طلب)
async function fetchVideoDurations(videoIds) {
  if (!videoIds.length) return {};
  const url = `${VIDEOS_URL}?part=contentDetails&id=${videoIds.join(",")}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) return {};

  const durations = {};
  (data.items || []).forEach((item) => {
    durations[item.id] = formatDuration(item.contentDetails?.duration);
  });
  return durations;
}

export async function fetchPlaylistVideos(playlistId, maxResults = 50) {
  if (!API_KEY) {
    throw new Error("مفتاح API غير موجود — تأكد من ملف .env وإعادة تشغيل npm start");
  }
  if (!playlistId) {
    throw new Error("playlistId غير موجود لهذا التصنيف");
  }

  let allVideos = [];
  let nextPageToken = "";
  let fetchedCount = 0;

  do {
    const url = `${PLAYLIST_URL}?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}${
      nextPageToken ? `&pageToken=${nextPageToken}` : ""
    }`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      const reason = data?.error?.message || `HTTP ${res.status}`;
      throw new Error(`فشل جلب الفيديوهات: ${reason}`);
    }

    const videos = (data.items || [])
      .filter((item) => item.snippet?.resourceId?.videoId)
      .map((item) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description || "",
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      }));

    allVideos = allVideos.concat(videos);
    fetchedCount += videos.length;
    nextPageToken = data.nextPageToken || "";
  } while (nextPageToken && fetchedCount < maxResults);

  const trimmed = allVideos.slice(0, maxResults);

  // نجيب مدة كل الفيديوهات (على دفعات من 50، حسب حد يوتيوب)
  const durationMap = {};
  for (let i = 0; i < trimmed.length; i += 50) {
    const batchIds = trimmed.slice(i, i + 50).map((v) => v.id);
    const batchDurations = await fetchVideoDurations(batchIds);
    Object.assign(durationMap, batchDurations);
  }

  return trimmed.map((v) => ({ ...v, duration: durationMap[v.id] || "" }));
}