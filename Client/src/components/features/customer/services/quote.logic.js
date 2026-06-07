import { API_BASE_URL } from "../../../../config/api";

// Post Quote data to backend

export const response = async (data) => {
  try {
    const res = await fetch(`${API_BASE_URL}/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to submit quote");
    }

    return await res.json(); // backend response

  } catch (error) {
    console.error("Quote API error:", error);
    throw error; // rethrow so UI can handle it
  }
};
