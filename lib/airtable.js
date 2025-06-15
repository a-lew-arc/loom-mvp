// lib/airtable.js
const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function fetchAirtableRecords(tableName) {
  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${tableName}?expand=Clients`, {
  headers: {
    Authorization: `Bearer ${AIRTABLE_TOKEN}`,
  },
});

  if (!res.ok) {
    throw new Error(`Airtable fetch error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.records.map(record => {
    const normalized = {};
    for (const key in record.fields) {
      normalized[key.toLowerCase()] = record.fields[key];
    }
    return normalized;
  });
}
