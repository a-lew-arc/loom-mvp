// pages/api/teams.js
import { getSheetData } from '../../lib/sheets';

export default async function handler(req, res) {
  const sheetId = '1AeQ2_IRFF0xj5FUy1kXR_MZVQh-OtuiAj8T2nPxwokQ';
  const sheetRange = 'Team!A:Z';  // "Team" tab, columns A to Z

  try {
    const rows = await getSheetData(sheetId, sheetRange);
    const data = rows.map(row => ({
      name: row.name || '',
      title: row.title || '',
      tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
      capacity: row.capacity || '',
      location: row.location || '',
    }));
    res.status(200).json(data);
  } catch (err) {
    console.error('Error loading teams:', err);
    res.status(500).json({ error: 'Failed to load team data' });
  }
}
