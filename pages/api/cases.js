// pages/api/cases.js
import { getSheetData } from '../../lib/sheets';

export default async function handler(req, res) {
  const sheetId = '1AeQ2_IRFF0xj5FUy1kXR_MZVQh-OtuiAj8T2nPxwokQ';
  const sheetRange = 'Cases!A:Z';  // "Cases" tab, columns A to Z

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
