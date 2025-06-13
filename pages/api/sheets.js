// 1. sheets.js - utility for reading from Google Sheets

import { google } from 'googleapis';
import { readFileSync } from 'fs';
import path from 'path';

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), 'loom-sheets-creds.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export async function getSheetData(sheetId, sheetGid) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const res = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    includeGridData: true,
    ranges: [`gid:${sheetGid}`],
  });

  const grid = res.data.sheets[0].data[0].rowData;
  const rows = grid.map(row => row.values?.map(cell => cell.formattedValue || ''));
  const [headers, ...data] = rows;

  return data.map(row => Object.fromEntries(row.map((v, i) => [headers[i], v])));
}