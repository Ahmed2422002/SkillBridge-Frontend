
const STORAGE_KEY = "skillbridge_progress";

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function normalizeEntry(e) {
  return typeof e === "string"
    ? { id: e, title: "", duration: "", category: "", categoryKey: "", completedAt: null }
    : e;
}
// نفس التوقيع القديم بالضبط — ما يتغير أي استدعاء موجود
export function getCompletedVideos(pathKey) {
  const all = readAll();
  const entries = all[pathKey] || [];
  return entries.map((e) => normalizeEntry(e).id);
}

export function markVideoCompleted(pathKey, videoId, extra = {}) {
  const all = readAll();
  const current = all[pathKey] || [];
  const alreadyDone = current.some((e) => normalizeEntry(e).id === videoId);

  if (!alreadyDone) {
    all[pathKey] = [
      ...current,
      {
        id: videoId,
        title: extra.title || "",
        duration: extra.duration || "",
        category: extra.category || "",
        categoryKey: extra.categoryKey || "",   // ← جديد
        completedAt: new Date().toISOString(),
      },
    ];
    writeAll(all);
  }
}

export function isVideoCompleted(pathKey, videoId) {
  return getCompletedVideos(pathKey).includes(videoId);
}

// ===== دوال جديدة، فقط لصفحة My Progress =====

export function getCompletedVideoDetails(pathKey) {
  const all = readAll();
  const entries = all[pathKey] || [];
  return entries.map(normalizeEntry);
}

export function getAllCompletedVideoDetails() {
  const all = readAll();
  const result = [];
  Object.keys(all).forEach((pathKey) => {
    (all[pathKey] || []).forEach((e) => {
      result.push({ pathKey, ...normalizeEntry(e) });
    });
  });
  return result;
}

export function getRecentActivity(limit = 5) {
  return getAllCompletedVideoDetails()
    .filter((e) => e.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, limit);
}

function durationToSeconds(duration) {
  if (!duration) return 0;
  const parts = duration.split(":").map(Number);
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((acc, val) => acc * 60 + val, 0);
}

export function getTotalStudySeconds() {
  return getAllCompletedVideoDetails().reduce(
    (sum, e) => sum + durationToSeconds(e.duration),
    0
  );
}

// تقريبي: عدد أيام التتابع بالاعتماد على تواريخ الإكمال المخزّنة
export function getCurrentStreak() {
  const dates = getAllCompletedVideoDetails()
    .filter((e) => e.completedAt)
    .map((e) => new Date(e.completedAt).toDateString());

  const uniqueDays = [...new Set(dates)].map((d) => new Date(d));
  uniqueDays.sort((a, b) => b - a);

  if (uniqueDays.length === 0) return 0;

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDays.length; i++) {
    const diffDays = Math.round((cursor - uniqueDays[i]) / (1000 * 60 * 60 * 24));
    if (diffDays === 0 || diffDays === 1) {
      streak++;
      cursor = uniqueDays[i];
    } else {
      break;
    }
  }
  return streak;
}
const LAST_PATH_KEY = "skillbridge_last_path";

export function setLastVisitedPath(pathKey) {
  try {
    localStorage.setItem(LAST_PATH_KEY, pathKey);
  } catch {
    // تجاهل أي خطأ تخزين
  }
}

export function getLastVisitedPath() {
  try {
    return localStorage.getItem(LAST_PATH_KEY);
  } catch {
    return null;
  }
}