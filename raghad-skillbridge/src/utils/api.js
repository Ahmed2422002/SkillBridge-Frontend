import { API_URL, getToken, extractErrorMessage, USE_MOCK_API } from "../api";

const USE_LOCAL_VIDEOS = USE_MOCK_API; // مع الوضع التجريبي الفيديوهات بتتخزن بالمتصفح
//const USE_LOCAL_VIDEOS = true; // خليها false لما الباك يجهّز GET/POST/DELETE /videos
const LS_KEY = "skillbridge_mentor_videos";

export function extractYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// ---------- تخزين محلي مؤقت ----------
const readLocal = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
};
const writeLocal = (list) => localStorage.setItem(LS_KEY, JSON.stringify(list));

// ---------- طلبات الباك (للمستقبل) ----------
async function request(path, options = {}) {
  const { headers, ...rest } = options;
  const token = getToken();
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
    });
  } catch {
    throw new Error("Cannot reach the server, please try again later");
  }
  if (!res.ok) {
    let data = null;
    try { data = await res.json(); } catch {}
    throw new Error(extractErrorMessage(data) || `فشل الطلب (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

// ---------- الدوال اللي الصفحات بتستعملها (نفس الأسماء والتوقيع) ----------
export const getVideosByPath = async (pathKey) =>
  USE_LOCAL_VIDEOS
    ? readLocal().filter((v) => v.pathKey === pathKey)
    : request(`/videos?path=${encodeURIComponent(pathKey)}`);

export const getAllVideos = async () =>
  USE_LOCAL_VIDEOS ? readLocal() : request(`/videos`);

export const createVideo = async (data) => {
  if (!USE_LOCAL_VIDEOS) return request(`/videos`, { method: "POST", body: JSON.stringify(data) });
  const saved = { ...data, id: Date.now(), tag: data.category, status: "Published", views: 0 };
  writeLocal([saved, ...readLocal()]);
  return saved;
};

export const deleteVideo = async (id) => {
  if (!USE_LOCAL_VIDEOS) return request(`/videos/${id}`, { method: "DELETE" });
  writeLocal(readLocal().filter((v) => v.id !== id));
  return null;
};