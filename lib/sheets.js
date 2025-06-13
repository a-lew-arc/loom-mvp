// lib/sheets.js
import { google } from 'googleapis';

// Decode base64 string from env and parse JSON
const serviceAccount = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8')
);

// Set up Google Auth using decoded credentials
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export async function getSheetData(sheetId, gid) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  let res;
  try {
    res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `'${gid}'`, // gid is expected to be like "Team!A:Z"
    });
  } catch (e) {
    console.error('❌ Google Sheets API error:', e.response?.data || e.message || e);
    throw e;
  }

  const [header, ...rows] = res.data.values;
  return rows.map(row =>
    Object.fromEntries(header.map((key, i) => [key.toLowerCase(), row[i]]))
  );
}
