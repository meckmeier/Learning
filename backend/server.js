const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
const PORT = 3000;

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json', // 🔁 Replace with path to your service account JSON file
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

app.use(cors()); // Allow your frontend to connect

app.get('/data', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1RAXnenoil23Duut543eoK-UCphBONYIBoavfrsWWJIQ'; // 🔁 Replace with your actual Sheet ID
    const range = 'Organizations!A1:P100'; // Adjust as needed

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    });

    res.json(response.data);
  } catch (error) {
    console.error('🔥 ERROR:');
    console.error(error); // ✅ we want to see this full stack trace
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
