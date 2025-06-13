// lib/sheets.js or wherever you defined getSheetData
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export async function getSheetData(sheetId, gid) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `'${gid}'`,
  });

  const [header, ...rows] = res.data.values;
  return rows.map(row =>
    Object.fromEntries(header.map((key, i) => [key.toLowerCase(), row[i]]))
  );
}

