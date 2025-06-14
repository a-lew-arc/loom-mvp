import { fetchAirtableRecords } from '../../lib/airtable';

export default async function handler(req, res) {
  try {
    const records = await fetchAirtableRecords('Teams');
    const data = records.map(row => ({
      name: row.name || '',
      title: row.title || '',
      tags: row.tags || [],
      capacity: row.capacity || '',
      location: row.location || ''
    }));
    res.status(200).json(data);
  } catch (err) {
    console.error('Error loading teams:', err);
    res.status(500).json({ error: 'Failed to load team data' });
  }
}
