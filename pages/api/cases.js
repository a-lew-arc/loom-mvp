import { fetchAirtableRecords } from '../../lib/airtable';

export default async function handler(req, res) {
  try {
    const records = await fetchAirtableRecords('Cases');
    const data = records.map(row => ({
      client: Array.isArray(row.clients) ? row.clients[0]?.name || '' : row.clients?.name || row.clients || '',
      type: row.type || '',
      result: row.result || '',
      tags: row.tags || [],
    }));
    res.status(200).json(data);
  } catch (err) {
    console.error('Error loading cases:', err);
    res.status(500).json({ error: 'Failed to load case data' });
  }
}
