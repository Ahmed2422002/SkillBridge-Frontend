// true = وضع تجريبي بدون باك اند (الافتراضي). false = يحكي مع الباك الحقيقي
export const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API !== "false";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

export function extractErrorMessage(data) {
  if (!data) return null;
  if (typeof data.message === "string") return data.message;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail) && data.detail.length) {
    const first = data.detail[0];
    const field = Array.isArray(first.loc) ? first.loc[first.loc.length - 1] : "";
    return field ? `${field}: ${first.msg}` : first.msg;
  }
  return null;
}

export async function postJSON(path, body, extraHeaders = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...extraHeaders },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Network error calling", `${API_URL}${path}`, err);
    throw new Error("Cannot reach the server, please try again later");
  }
  let data = {};
  try { data = await response.json(); } catch {}
  if (!response.ok) {
    const fallback =
      response.status === 401 ? "Invalid email or password"
      : response.status === 409 ? "This email is already registered"
      : "Something went wrong, please try again";
    throw new Error(extractErrorMessage(data) || fallback);
  }
  return data;
}

// ---------- التوكن والدور ----------
export function saveToken(token, remember = true) {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  (remember ? localStorage : sessionStorage).setItem("token", token);
}
export function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}
export function saveRole(role) { localStorage.setItem("role", role); }
export function getRole() { return localStorage.getItem("role"); }

// ---------- الوضع التجريبي: مستخدمين مخزنين بالمتصفح ----------
const MOCK_USERS_KEY = "mock_users";
const readMockUsers = () => {
  try { return JSON.parse(localStorage.getItem(MOCK_USERS_KEY)) || []; } catch { return []; }
};
const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// ---------- الباك الحقيقي يطلب username فريد، فنولّده من الإيميل ----------
function usernameFromEmail(email) {
  const base = email.split("@")[0].replace(/[^a-zA-Z0-9_.-]/g, "") || "user";
  return `${base}_${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function registerUser({ fullName, email, password, role = "student", extra = {} }) {
  const profile = { fullName, role, createdAt: new Date().toISOString(), ...extra };

  if (USE_MOCK_API) {
    await wait();
    const e = email.trim().toLowerCase();
    const users = readMockUsers();
    if (users.some((u) => u.email === e)) throw new Error("This email is already registered");
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([...users, { email: e, password, fullName, role }]));
    saveProfileExtra(email, profile);
    return { email: e, fullName };
  }

  const result = await postJSON("/register", {
    email,
    username: usernameFromEmail(email),
    password,
    full_name: fullName,
  });
  saveProfileExtra(email, profile);
  return result;
}

// بيرجع التوكن (نص) وبيحفظ بيانات المستخدم الحالي
export async function loginUser({ email, password, role = "student" }) {
  const e = email.trim().toLowerCase();
  const extra = readProfiles()[e] || {};

  if (USE_MOCK_API) {
    await wait();
    const user = readMockUsers().find((u) => u.email === e && u.password === password);
    if (!user) throw new Error("Invalid email or password");
    if (user.role !== role) {
      throw new Error(
        role === "mentor"
          ? "This is a student account. Please use Student Login."
          : "This is a mentor account. Please use Mentor Login."
      );
    }
    saveCurrentUser({ ...extra, email: e, fullName: extra.fullName || user.fullName, role: user.role });
    return `mock-token-${e}`;
  }

  

  const data = await postJSON("/login", { email, password });
  const token = data.access_token;

  let fullName = extra.fullName || "";
  try {
    const res = await fetch(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) fullName = (await res.json()).full_name || fullName;
  } catch {}
  saveCurrentUser({ ...extra, email: e, fullName, role });
  return token;
}
// ---------- بيانات المستخدم الحالي (الاسم، العنوان، النبذة...) ----------
const PROFILES_KEY = "skillbridge_profiles"; // بيانات إضافية لكل إيميل
const CURRENT_USER_KEY = "current_user";

const readProfiles = () => {
  try { return JSON.parse(localStorage.getItem(PROFILES_KEY)) || {}; } catch { return {}; }
};

export function saveProfileExtra(email, data) {
  const profiles = readProfiles();
  const key = email.trim().toLowerCase();
  profiles[key] = { ...(profiles[key] || {}), ...data };
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || {};
  } catch {
    return {};
  }
}

// "Reema Eyad" -> "RE"  |  "ربا ابو بليمه" -> "رأ"
export function getInitials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}


// تغيير كلمة المرور للمستخدم الحالي
export async function changePassword({ currentPassword, newPassword }) {
  const current = getCurrentUser();
  const e = (current.email || "").trim().toLowerCase();
  if (!e) throw new Error("Please log in again");

  if (USE_MOCK_API) {
    await wait();
    const users = readMockUsers();
    const idx = users.findIndex((u) => u.email === e);
    if (idx === -1) throw new Error("Account not found");
    if (users[idx].password !== currentPassword) {
      throw new Error("كلمة المرور الحالية غير صحيحة");
    }
    users[idx] = { ...users[idx], password: newPassword };
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    return { ok: true };
  }

  // الباك الحقيقي: عدّل المسار والحقول حسب ما يوفره الباك عندكم
  return postJSON(
    "/change-password",
    { current_password: currentPassword, new_password: newPassword },
    { Authorization: `Bearer ${getToken()}` }
  );
}

// قائمة كل المنتورز المسجلين (الوضع التجريبي)
export function getRegisteredMentors() {
  const profiles = readProfiles();
  return readMockUsers()
    .filter((u) => u.role === "mentor")
    .map((u) => ({
      email: u.email,
      fullName: u.fullName,
      ...(profiles[u.email] || {}),
    }));
}
 // ---------- الرسائل بين الطالب والمنتور (الوضع التجريبي) ----------
const MESSAGES_KEY = "skillbridge_messages";
const COLORS = ["#0D1B2A", "#7C4DFF", "#F5B301", "#E63946", "#0D9488", "#22D3C5"];
const norm = (s) => (s || "").trim().toLowerCase();
const colorFor = (s) => COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const readMessages = () => {
  try { return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || []; } catch { return []; }
};

// from: "student" أو "mentor"
export function sendMessage({ studentEmail, mentorEmail, from, text }) {
  const msg = {
    id: Date.now() + Math.random(),
    studentEmail: norm(studentEmail),
    mentorEmail: norm(mentorEmail),
    from,
    text,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(MESSAGES_KEY, JSON.stringify([...readMessages(), msg]));
  return msg;
}

// كل الطلاب اللي راسلوا هذا المنتور (بنفس شكل MessagesModal)
export function getMentorInbox(mentorEmail) {
  const me = norm(mentorEmail);
  const profiles = readProfiles();
  const byStudent = {};
  readMessages()
    .filter((m) => m.mentorEmail === me)
    .forEach((m) => {
      if (!byStudent[m.studentEmail]) byStudent[m.studentEmail] = [];
      byStudent[m.studentEmail].push(m);
    });

  return Object.entries(byStudent).map(([email, msgs]) => {
    const name = (profiles[email] && profiles[email].fullName) || email;
    return {
      id: email,
      name,
      initials: getInitials(name),
      color: colorFor(email),
      online: false,
      lastMessage: msgs[msgs.length - 1].text,
      messages: msgs.map((m) => ({
        id: m.id,
        from: m.from,
        text: m.text,
        time: formatTime(m.createdAt),
      })),
    };
  });
}
// محادثة طالب معين مع منتور معين (بشكل ContactModal)
export function getConversation(studentEmail, mentorEmail) {
  const s = norm(studentEmail);
  const m = norm(mentorEmail);
  return readMessages()
    .filter((x) => x.studentEmail === s && x.mentorEmail === m)
    .map((x) => ({
      from: x.from === "student" ? "me" : "mentor",
      text: x.text,
      time: formatTime(x.createdAt),
    }));
}
// مفاتيح مسار الطالب (Onboarding) → مفاتيح خبرة المنتور
const PATH_ALIASES = { datascientist: "data", uiux: "design" };
const normPath = (k) => PATH_ALIASES[k] || k;

// الطلاب المسجلين اللي مسارهم نفس خبرة هذا المنتور
export function getStudentsForMentor(mentorEmail) {
  const profiles = readProfiles();
  const mentorExpertise = normPath((profiles[norm(mentorEmail)] || {}).expertise);

  return readMockUsers()
    .filter((u) => u.role === "student")
    .map((u) => ({ u, p: profiles[u.email] || {} }))
    .filter(({ p }) => p.career && (!mentorExpertise || normPath(p.career) === mentorExpertise))
    .map(({ u, p }) => ({
      id: u.email,
      name: p.fullName || u.fullName,
      initials: getInitials(p.fullName || u.fullName),
      color: colorFor(u.email),
      path: p.career,
    }));
}
// آخر رسالة وصلت للطالب من كل منتور
export function getMessagesFromMentors(studentEmail) {
  const s = norm(studentEmail);
  const profiles = readProfiles();
  const latest = {};
  readMessages()
    .filter((m) => m.studentEmail === s && m.from === "mentor")
    .forEach((m) => { latest[m.mentorEmail] = m; }); // الأخيرة تغلب
  return Object.values(latest).map((m) => ({
    id: m.id,
    mentorEmail: m.mentorEmail,
    mentorName: (profiles[m.mentorEmail] && profiles[m.mentorEmail].fullName) || "Your mentor",
    text: m.text,
    createdAt: m.createdAt,
  }));
}

// المنتور المسجل بنفس مسار المساق (أول منتور سجّل بهذا المسار)
export function getMentorForPath(pathKey) {
  const target = normPath(pathKey);
  const found = getRegisteredMentors().filter((m) => normPath(m.expertise) === target);
  return found.length ? found[0] : null;
}

// ---------- الشهادات ----------
const CERTS_KEY = "skillbridge_certificates";
const readCerts = () => {
  try { return JSON.parse(localStorage.getItem(CERTS_KEY)) || {}; } catch { return {}; }
};

export function saveCertificate(email, pathKey, completedAt) {
  const all = readCerts();
  const key = `${norm(email)}|${pathKey}`;
  if (!all[key]) {
    all[key] = {
      completedAt: completedAt || new Date().toISOString(),
      id: "SB-" + Date.now().toString(36).toUpperCase(),
    };
    localStorage.setItem(CERTS_KEY, JSON.stringify(all));
  }
  return all[key];
}

export function getCertificate(email, pathKey) {
  return readCerts()[`${norm(email)}|${pathKey}`] || null;
}
// ---------- سجل الأحداث (للإشعارات عند المنتور) ----------
const EVENTS_KEY = "skillbridge_events";
const readEvents = () => {
  try { return JSON.parse(localStorage.getItem(EVENTS_KEY)) || []; } catch { return []; }
};

// type: "joined" | "course_completed" | "quiz_full"
export function addEvent({ type, studentEmail, pathKey, key = "", label = "", pathLabel = "" }) {
  const all = readEvents();
  const id = [type, norm(studentEmail), pathKey, key].join("|");
  if (all.some((e) => e.id === id)) return; // ما نكرر نفس الحدث
  all.push({
    id, type, studentEmail: norm(studentEmail), pathKey, label, pathLabel,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(EVENTS_KEY, JSON.stringify(all));
}

// إشعارات منتور معين: أحداث مسار خبرته + رسائل الطلاب الموجهة له
export function getMentorNotifications(mentorEmail) {
  const me = norm(mentorEmail);
  const profiles = readProfiles();
  const nameOf = (email) => (profiles[email] && profiles[email].fullName) || email;
  const expertise = normPath((profiles[me] || {}).expertise);
  const list = [];

  readEvents()
    .filter((e) => expertise && normPath(e.pathKey) === expertise)
    .forEach((e) => {
      const who = nameOf(e.studentEmail);
      let title = "";
      if (e.type === "joined") title = `A new student, ${who}, joined ${e.label}`;
      else if (e.type === "course_completed") title = `${who} completed "${e.label}" in ${e.pathLabel}`;
      else if (e.type === "quiz_full")
        title = `${who} scored 100% on ${e.label}${e.pathLabel ? ` (${e.pathLabel})` : ""}`;
      else return;
      list.push({ id: e.id, type: e.type, title, createdAt: e.createdAt });
    });

  const latest = {}; // آخر رسالة من كل طالب
  readMessages()
    .filter((m) => m.mentorEmail === me && m.from === "student")
    .forEach((m) => { latest[m.studentEmail] = m; });
  Object.values(latest).forEach((m) => {
    const text = m.text.length > 60 ? m.text.slice(0, 60) + "..." : m.text;
    list.push({
      id: `msg-${m.studentEmail}-${m.id}`,
      type: "message",
      title: `${nameOf(m.studentEmail)} sent you a message: "${text}"`,
      createdAt: m.createdAt,
    });
  });

  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// حالة "مقروء" لكل منتور
const mReadKey = (email) => `skillbridge_mnotif_read_${norm(email)}`;
export const getMentorReadIds = (email) => {
  try { return JSON.parse(localStorage.getItem(mReadKey(email))) || []; } catch { return []; }
};
export const markMentorRead = (email, ids) => {
  const merged = Array.from(new Set([...getMentorReadIds(email), ...ids]));
  localStorage.setItem(mReadKey(email), JSON.stringify(merged));
};
// ---------- الاختبارات ----------
const QUIZZES_KEY = "skillbridge_quizzes";
const readQuizzes = () => {
  try { return JSON.parse(localStorage.getItem(QUIZZES_KEY)) || []; } catch { return []; }
};

export function saveQuiz(quiz) {
  const saved = { ...quiz, id: "q" + Date.now(), createdAt: new Date().toISOString() };
  localStorage.setItem(QUIZZES_KEY, JSON.stringify([saved, ...readQuizzes()]));
  return saved;
}

export const getQuizzesByPath = (pathKey) =>
  readQuizzes().filter((q) => q.pathKey === pathKey);

// ---------- مسودة الاختبار (واحدة لكل منتور) ----------
const DRAFT_KEY = "skillbridge_quiz_draft_";
export const saveDraft = (email, draft) =>
  localStorage.setItem(DRAFT_KEY + norm(email), JSON.stringify(draft));
export const getDraft = (email) => {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY + norm(email))); } catch { return null; }
};
export const clearDraft = (email) => localStorage.removeItem(DRAFT_KEY + norm(email));




// ---------- شهادات الاختبارات ----------
const QUIZ_CERTS_KEY = "skillbridge_quiz_certs";

const readQuizCerts = () => {
  try { return JSON.parse(localStorage.getItem(QUIZ_CERTS_KEY)) || []; } catch { return []; }
};

// بتنصدر الشهادة فقط لو العلامة أكثر من النصف. إعادة الاختبار ما بتكرر الشهادة،
// بس بتحدّث العلامة إذا صارت أعلى.
export function issueQuizCertificate({ quiz, score, total }) {
  const user = getCurrentUser();
  if (!user.email || !quiz || !(total > 0) || score * 2 <= total) return null;

  const email = user.email.toLowerCase();
  const percent = Math.round((score / total) * 100);
  const all = readQuizCerts();
  const existing = all.find((c) => c.studentEmail === email && c.quizId === quiz.id);

  if (existing) {
    if (score > existing.score) {
      existing.score = score;
      existing.total = total;
      existing.percent = percent;
      localStorage.setItem(QUIZ_CERTS_KEY, JSON.stringify(all));
    }
    return existing;
  }

  // اسم المنتور بنجيبه من الإيميل اللي انحفظ مع الاختبار وقت نشره
  const mentorEmail = (quiz.mentorEmail || "").toLowerCase();
  const mentorProfile = readProfiles()[mentorEmail] || {};

  const cert = {
    id: "QC-" + Date.now().toString(36).toUpperCase(),
    studentEmail: email,
    studentName: user.fullName || "",
    quizId: quiz.id,
    quizTitle: quiz.title,
    pathKey: quiz.pathKey,
    pathLabel: quiz.pathLabel || "",
    categoryKey: quiz.categoryKey || "",
    categoryLabel: quiz.categoryLabel || "",
    score,
    total,
    percent,
    mentorEmail,
    mentorName: mentorProfile.fullName || "",
    issuedAt: new Date().toISOString(),
  };
  localStorage.setItem(QUIZ_CERTS_KEY, JSON.stringify([cert, ...all]));
  return cert;
}

export const getQuizCertificates = (email) =>
  readQuizCerts().filter((c) => c.studentEmail === (email || "").toLowerCase());

export const getQuizCertificate = (certId) =>
  readQuizCerts().find((c) => c.id === certId) || null;
// ================== لهون ==================

// ---------- آخر نشاطات الطلاب عند المنتور (بيانات حقيقية) ----------
export function getMentorActivities(mentorEmail, limit = 7) {
  const me = norm(mentorEmail);
  const profiles = readProfiles();
  const expertise = normPath((profiles[me] || {}).expertise);
  const nameOf = (email) => (profiles[email] && profiles[email].fullName) || email;
  // لو المنتور ما اختار خبرة، بنعرض كل الطلاب
  const inMyPath = (key) => !expertise || normPath(key) === expertise;

  const list = [];
  const joinedEmails = new Set();
  const events = readEvents();

  // 1) أحداث المسارات: انضمام، إكمال كورس، علامة كاملة
  events
    .filter((e) => inMyPath(e.pathKey))
    .forEach((e) => {
      const who = nameOf(e.studentEmail);
      let text = "";
      let score = null;
      if (e.type === "joined") {
        text = `${who} joined ${e.label}`;
        joinedEmails.add(e.studentEmail);
      } else if (e.type === "course_completed") {
        text = `${who} completed "${e.label}"${e.pathLabel ? ` in ${e.pathLabel}` : ""}`;
      } else if (e.type === "quiz_full") {
        text = `${who} scored 100% on ${e.label}`;
        score = 100;
      } else {
        return;
      }
      list.push({ id: e.id, studentEmail: e.studentEmail, text, score, createdAt: e.createdAt });
    });

  // 2) طلاب اجتازوا اختباراً نشره هذا المنتور (أكثر من النصف)
  const fullIds = new Set(events.map((e) => e.id));
  let certs = [];
  try { certs = JSON.parse(localStorage.getItem("skillbridge_quiz_certs")) || []; } catch {}
  certs
    .filter((c) => c.mentorEmail === me)
    .forEach((c) => {
      // لو العلامة كاملة وإلها حدث فوق، ما بنكرر
      const dup = c.percent === 100 &&
        fullIds.has(["quiz_full", c.studentEmail, c.pathKey, c.quizId].join("|"));
      if (dup) return;
      list.push({
        id: `cert-${c.id}`,
        studentEmail: c.studentEmail,
        text: `${nameOf(c.studentEmail)} passed "${c.quizTitle}"`,
        score: c.percent,
        createdAt: c.issuedAt,
      });
    });

  // 3) الطلاب المسجلين فعلياً (تاريخ إنشاء الحساب) اللي ما إلهم حدث انضمام
  readMockUsers()
    .filter((u) => u.role === "student")
    .forEach((u) => {
      const p = profiles[u.email] || {};
      if (!p.createdAt || joinedEmails.has(u.email)) return;
      if (expertise && !(p.career && normPath(p.career) === expertise)) return;
      list.push({
        id: `signup-${u.email}`,
        studentEmail: u.email,
        text: `${p.fullName || u.fullName} joined SkillBridge`,
        score: null,
        createdAt: p.createdAt,
      });
    });

  return list
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
    .map((a) => ({
      id: a.id,
      initials: getInitials(nameOf(a.studentEmail)),
      color: colorFor(a.studentEmail),
      text: a.text,
      score: a.score,
      createdAt: a.createdAt,
    }));
}

export function logoutUser() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  localStorage.removeItem(CURRENT_USER_KEY);
}
