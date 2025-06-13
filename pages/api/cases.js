// loadCases.js
import { getSheetData } from './sheets';

export async function loadCases() {
  const sheetId = '1FvuWgmK4H3qxmgDEtoXbHL1JBYdc4Wi1vjM2Mj_UpfA'; // Replace with your actual Sheet ID
  const sheetGid = '1545500112'; // GID for the "Cases" tab
  const rows = await getSheetData(sheetId, sheetGid);
  const data = rows.map(row => ({
    client: row.client || '',
    type: row.type || '',
    result: row.result || '',
    tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
  }));
  res.status(200).json(data);
}