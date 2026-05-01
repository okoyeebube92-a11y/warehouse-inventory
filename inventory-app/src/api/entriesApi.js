const BASE_URL = "http://localhost:5000/api/entries";

export async function createEntries(entries) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(entries)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create entries");
  }

  return data;
}