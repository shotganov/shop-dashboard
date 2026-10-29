const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options) {
  const res = await fetch(API_URL + path, {
    ...options,
    headers: options?.body ? { "Content-Type": "application/json" } : undefined,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Ошибка сервера (${res.status})`);
  }
  return res;
}

export async function getCustomers(offset, limit) {
  const res = await request(`/customers?offset=${offset}&limit=${limit}`);
  return res.json();
}

export async function getOrders(customerId) {
  const res = await request(`/orders?customerId=${customerId}`);
  return res.json();
}

export async function createOrder(data) {
  const res = await request("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateOrder(id, data) {
  const res = await request(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteOrder(id) {
  await request(`/orders/${id}`, { method: "DELETE" });
}
