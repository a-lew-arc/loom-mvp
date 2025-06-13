// pages/api/cases.js
import { getSheetData } from '../../lib/sheets';

export default async function handler(req, res) {
  const sheetId = '1FvuWgmK4H3qxmgDEtoXbHL1JBYdc4Wi1vjM2Mj_UpfA';
  const sheetGid = 'Cases!A:Z';

  try {
    const rows = await getSheetData(sheetId, sheetGid);
    const data = rows.map(row => ({
      client: row.client || '',
      type: row.type || '',
      result: row.result || '',
      tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
    }));
    res.status(200).json(data);
  } catch (err) {
    console.error('Error loading cases:', err);
    res.status(500).json({ error: 'Failed to load case data' });
  }
}
