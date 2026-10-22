const API_URL = "https://skillbridge-ai-dwfz.onrender.com/api/v1";

export async function postJSON(path, body) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    throw new Error("Cannot reach the server, please try again later");
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
        : response.status === 400 || response.status === 409
        ? "This email is already registered"
        : "Something went wrong, please try again";

    throw new Error(detail || data.message || fallback);
  }

  return data;
}

export function saveToken(token, remember = true) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("token", token);
}
