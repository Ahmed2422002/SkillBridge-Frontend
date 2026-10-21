import { learningPaths } from "../data/coursePlaylists";
import { fetchPlaylistVideos } from "./youtube";
import { getCompletedVideos, getCompletedVideoDetails } from "./progress";
import { getCurrentUser, getMessagesFromMentors, saveCertificate, getQuizCertificates } from "../api";

const TOTALS_KEY = "skillbridge_path_totals";
const DAY = 24 * 60 * 60 * 1000;

// عدد دروس المسار (نفس طريقة MyProgress) مع كاش ليوم كامل
async function getPathTotal(pathKey, path) {
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(TOTALS_KEY)) || {}; } catch {}
  const hit = cache[pathKey];
  if (hit && Date.now() - hit.at < DAY) return hit.total;

  const results = await Promise.allSettled(
    path.categories.map((c) => fetchPlaylistVideos(c.playlistId, 100))
  );
  const total = results.reduce(
    (sum, r) => sum + (r.status === "fulfilled" ? r.value.length : 0),
    0
  );
  if (total > 0) {
    cache[pathKey] = { total, at: Date.now() };
    localStorage.setItem(TOTALS_KEY, JSON.stringify(cache));
  }
  return total;
}

export async function buildNotifications() {
  const user = getCurrentUser();
  const list = [];

  for (const [pathKey, path] of Object.entries(learningPaths)) {
    const done = getCompletedVideos(pathKey).length;
    if (done === 0) continue;
    const total = await getPathTotal(pathKey, path);
    if (total === 0) continue;

    const dates = getCompletedVideoDetails(pathKey)
      .map((d) => d.completedAt)
      .filter(Boolean)
      .sort();
    const dateAt = (n) => dates[Math.min(n, dates.length) - 1] || new Date().toISOString();

    if (done * 2 >= total) {
      list.push({
        id: `half-${pathKey}`,
        kind: "half",
        type: "learning",
        pathKey,
        title: "Halfway There! 50% Completed",
        description: `Great job! You've reached 50% of your ${path.title} learning path.`,
        createdAt: dateAt(Math.ceil(total / 2)),
      });
    }
    if (done >= total) {
      const cert = saveCertificate(user.email, pathKey, dateAt(total));
      list.push({
        id: `cert-${pathKey}`,
        kind: "certificate",
        type: "achievements",
        pathKey,
        title: "Certificate Earned!",
        description: `Congratulations! You have completed the ${path.title} course. Your certificate is ready.`,
        createdAt: cert.completedAt,
      });
    }
  }

  getMessagesFromMentors(user.email).forEach((m) => {
    list.push({
      id: `msg-${m.mentorEmail}-${m.id}`,
      kind: "message",
      type: "system",
      mentorEmail: m.mentorEmail,
      title: `New Message from ${m.mentorName}`,
      description: m.text.length > 100 ? m.text.slice(0, 100) + "..." : m.text,
      createdAt: m.createdAt,
    });
  });

  // ===== جديد: شهادات الاختبارات (علامة أكثر من النصف) =====
  getQuizCertificates(user.email).forEach((c) => {
    list.push({
      id: `quizcert-${c.id}`,
      kind: "quizCert",
      type: "achievements",
      certId: c.id,
      title: "Certificate Earned!",
      description: `Congratulations! You scored ${c.percent}% in "${c.quizTitle}"${
        c.categoryLabel ? ` (${c.categoryLabel})` : ""
      }. Your certificate is ready.`,
      createdAt: c.issuedAt,
    });
  });
  // ===== نهاية الجديد =====

  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// ---------- حالة "مقروء" لكل طالب ----------
const readKey = () => `skillbridge_notif_read_${getCurrentUser().email || "guest"}`;

export const getReadIds = () => {
  try { return JSON.parse(localStorage.getItem(readKey())) || []; } catch { return []; }
};

export const markRead = (ids) => {
  const merged = Array.from(new Set([...getReadIds(), ...ids]));
  localStorage.setItem(readKey(), JSON.stringify(merged));
};

export function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
}