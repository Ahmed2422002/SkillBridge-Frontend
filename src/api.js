const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export async function postJSON(path, body) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Cannot reach the server, please try again later");
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // الرد ما كان JSON
  }

  if (!response.ok) {
    const fallback =
      response.status === 401
        ? "Invalid email or password"
        : response.status === 409
        ? "This email is already registered"
        : "Something went wrong, please try again";
    throw new Error(data.message || fallback);
  }

  return data;
}

export function saveToken(token, remember = true) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("token", token);
}