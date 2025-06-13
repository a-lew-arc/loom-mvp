// pages/api/cases.js
import { getSheetData } from '../../lib/sheets';

export default async function handler(req, res) {
  const sheetId = '1FvuWgmK4H3qxmgDEtoXbHL1JBYdc4WiivjM2Mj_UpfA';
  const sheetRange = 'Cases!A:Z'; // exact tab name + column range

  try {
    const rows = await getSheetData(sheetId, sheetRange);
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
