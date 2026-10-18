// الرابط الأساسي مع إضافة /api/v1 ليتطابق مع مسارات الباك إند
const API_BASE = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/v1` 
  : "https://skillbridge-ai-dwfz.onrender.com/api/v1";

// يستخرج الـ ID من أي رابط YouTube (watch, youtu.be, embed, shorts)
export function extractYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`فشل الطلب (${res.status})`);
  return res.status === 204 ? null : res.json();
}

export const getVideosByPath = (pathKey) => request(`/videos?path=${encodeURIComponent(pathKey)}`);
export const getAllVideos = () => request(`/videos`);
export const createVideo = (data) => request(`/videos`, { method: "POST", body: JSON.stringify(data) });
export const deleteVideo = (id) => request(`/videos/${id}`, { method: "DELETE" });

// دالة لحفظ التوكن (تستخدم في تسجيل الدخول)
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// دالة لإرسال طلبات POST بصيغة JSON (تستخدم في التسجيل والدخول)
export const postJSON = async (url, data) => {
  const response = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("فشل الاتصال بالسيرفر");
  }
  
  return response.json();
};
