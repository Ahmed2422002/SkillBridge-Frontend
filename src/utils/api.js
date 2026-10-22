// غيّري الرابط حسب الـ backend عندكم (CRA: process.env.REACT_APP_API_URL / Vite: import.meta.env.VITE_API_URL)
const API_BASE = "https://skillbridge-ai-dwfz.onrender.com/api/v1";

// يستخرج الـ ID من أي رابط YouTube (watch, youtu.be, embed, shorts)
export function extractYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

async function request(path, options = {}) {
  const res = await fetch(${API_BASE}${path}, {
    headers: { "Content-Type": "application/json" }, // لو عندكم توكن: أضيفي Authorization هون
    ...options,
  });
  if (!res.ok) throw new Error(فشل الطلب (${res.status}));
  return res.status === 204 ? null : res.json();
}

export const getVideosByPath = (pathKey) => request(/videos?path=${encodeURIComponent(pathKey)});
export const getAllVideos = () => request(/videos);
export const createVideo = (data) => request(/videos, { method: "POST", body: JSON.stringify(data) });
export const deleteVideo = (id) => request(/videos/${id}, { method: "DELETE" });
