// loadTeams.js
import { getSheetData } from './sheets';

export async function loadTeams() {
  const sheetId = '1FvuWgmK4H3qxmgDEtoXbHL1JBYdc4Wi1vjM2Mj_UpfA'; // Your shared Google Sheet ID
  const sheetGid = '1166101006'; // GID for the "Teams" tab
  const rows = await getSheetData(sheetId, sheetGid);
  const data = rows.map(row => ({
    name: row.name || '',
    title: row.title || '',
    tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
    capacity: row.capacity || '',
    location: row.location || '',
  }));
  res.status(200).json(data);
}