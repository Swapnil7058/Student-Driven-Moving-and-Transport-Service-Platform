import { API_BASE_URL } from "../config/api";

export const response = async (form) => {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to send message");
    }

    return data; // ✅ return backend response
  } catch (error) {
    console.error("Support API error:", error);
    throw error; // ✅ rethrow so UI can handle it
  }
};
