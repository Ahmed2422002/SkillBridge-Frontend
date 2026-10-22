const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://skillbridge-ai-dwfz.onrender.com/api/v1";

const TOKEN_KEY = "token";

// ---------- التوكن ----------
export function saveToken(token, remember = true) {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

// ---------- يوتيوب ----------
export function extractYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// ---------- الطلبات ----------
async function parseError(res) {
  let msg = `فشل الطلب (${res.status})`;
  try {
    const body = await res.json();
    const d = body?.detail;
    if (typeof d === "string") msg = d;
    else if (Array.isArray(d))
      msg = d.map((x) => `${(x.loc || []).slice(1).join(".")}: ${x.msg}`).join(" | ");
    else if (body?.message) msg = body.message;
  } catch (_) {}
  return msg;
}

async function request(path, options = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch (_) {
    throw new Error("ما قدرت أوصل للسيرفر. ممكن يكون نايم، استنى دقيقة وجرب مرة ثانية.");
  }
  if (!res.ok) throw new Error(await parseError(res));
  return res.status === 204 ? null : res.json();
}

export const postJSON = (path, body) =>
  request(path, { method: "POST", body: JSON.stringify(body) });

export const getVideosByPath = (pathKey) => request(`/videos?path=${encodeURIComponent(pathKey)}`);
export const getAllVideos = () => request(`/videos`);
export const createVideo = (data) => request(`/videos`, { method: "POST", body: JSON.stringify(data) });
export const deleteVideo = (id) => request(`/videos/${id}`, { method: "DELETE" });
