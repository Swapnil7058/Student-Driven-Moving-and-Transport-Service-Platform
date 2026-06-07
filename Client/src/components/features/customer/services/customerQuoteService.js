import { API_BASE_URL } from "../../../../config/api";

const API = API_BASE_URL;

export const getCustomersQuotes = async (email) => {
  const res = await fetch(`${API}/quotes/customer/${email}`, {
    credentials: "include",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data.data;
};

export const getCustomerQuote = async (id) => {
  const res = await fetch(`${API}/quotes/${id}`, {
    credentials: "include",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch quote");
  }

  return data.data;
};

export const updateCustomerQuoteResponse = async (id, payload) => {
  const res = await fetch(`${API}/quotes/${id}/customer-response`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update quote");
  }

  return data.data;
};

export const getCustomerJobByQuote = async (quoteId) => {
  const res = await fetch(`${API}/jobs/quote/${quoteId}`, {
    credentials: "include",
  });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch move progress");
  }

  return data.data;
};
