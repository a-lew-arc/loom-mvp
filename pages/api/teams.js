// pages/api/teams.js
import { getSheetData } from '../../lib/sheets';

export default async function handler(req, res) {
  const sheetId = '1FvuWgmK4H3qxmgDEtoXbHL1JBYdc4WiivjM2Mj_UpfA';
  const sheetRange = 'Team!A:Z'; // exact tab name + column range

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
