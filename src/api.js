const ROOT_URL = "https://skillbridge-ai-dwfz.onrender.com";
const API_URL = `${ROOT_URL}/api/v1`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function wakeServer(maxWaitMs = 70000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(`${ROOT_URL}/test`, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) return true;
    } catch {
      // السيرفر لسا نايم
    }
    await sleep(3000);
  }
  return false;
}

async function send(path, body) {
  return fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function postJSON(path, body) {
  let response;
  try {
    response = await send(path, body);
  } catch (err) {
    console.error("FETCH ERROR (1st try):", err);
    const awake = await wakeServer();
    if (!awake) {
      throw new Error("Cannot reach the server, please try again later");
    }
    try {
      response = await send(path, body);
    } catch (err2) {
      console.error("FETCH ERROR (2nd try):", err2);
      throw new Error("Cannot reach the server, please try again later");
    }
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // الرد ما كان JSON
  }

  if (!response.ok) {
    let detail = null;
    if (typeof data.detail === "string") {
      detail = data.detail;
    } else if (Array.isArray(data.detail) && data.detail[0]?.msg) {
      detail = data.detail[0].msg;
    }
    const fallback =
      response.status === 401
        ? "Invalid email or password"
        : "Something went wrong, please try again";
    throw new Error(detail || data.message || fallback);
  }

  return data;
}

export function saveToken(token, remember = true) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("token", token);
}
