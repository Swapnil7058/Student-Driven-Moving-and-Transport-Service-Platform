import { API_BASE_URL } from "../../../../config/api";

const API = API_BASE_URL;

export const getQuote = async (id) => {
  const res = await fetch(`${API}/quotes/${id}`, {
    credentials: "include",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch quote");
  }

  return data.data;
};

export const updateQuote = async (id, payload) => {
  const res = await fetch(`${API}/quotes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data.data;
};

export const createJob = async (payload) => {
  const res = await fetch(`${API}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data.data;
};


export const updateInvoice = async (id, invoice) => {

  const res = await fetch(`${API}/quotes/${id}/invoice`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(invoice),
  });

  const text = await res.text();

  const data = text ? JSON.parse(text) : {};

  if (!data.success) {
    throw new Error(data.message || "Failed to update invoice");
  }

  return data.data;
};
