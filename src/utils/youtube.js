// ✅ الفرونت إند يستدعي الباك إند، مش YouTube مباشرة
const API_URL = process.env.REACT_APP_API_URL;

export async function fetchPlaylistVideos(topic, maxResults = 5) {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/videos/search?q=${encodeURIComponent(topic)}&max_results=${maxResults}`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

export function formatDuration(iso) {
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

export async function fetchVideoDurations() { return {}; }
export async function getCompletedVideos() { return []; }
export async function markVideoCompleted() { return true; }
export async function isVideoCompleted() { return false; }
