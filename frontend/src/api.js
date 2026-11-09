const BASE = "http://localhost:8080/api/expenses";

async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let message = "Something went wrong";
    try {
      const data = await res.json();
      message = data.message || Object.values(data).join(", ") || message;
    } catch {
      // the server sent no JSON, keep the default message
    }
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
}

export function getExpenses(month, category) {
  const params = new URLSearchParams();
  if (month) params.set("month", month);
  if (month && category) params.set("category", category);
  const query = params.toString();
  return request(query ? `${BASE}?${query}` : BASE);
}

export function getSummary(month) {
  return request(`${BASE}/summary?month=${month}`);
}

export function addExpense(expense) {
  return request(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
}

export function updateExpense(id, expense) {
  return request(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
}

export function deleteExpense(id) {
  return request(`${BASE}/${id}`, { method: "DELETE" });
}