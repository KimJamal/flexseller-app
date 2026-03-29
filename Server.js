// Server.js
const express = require("express");
const config = require('./config.json');

const DIGIKEY_CLIENT_ID = config.DIGIKEY_CLIENT_ID;
const DIGIKEY_CLIENT_SECRET = config.DIGIKEY_CLIENT_SECRET;
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const DIGIKEY_TOKEN_URL = 'https://api.digikey.com/v1/oauth2/token';
const DIGIKEY_SEARCH_URL = 'https://api.digikey.com/products/v4/search/keyword';

app.post('/api/token', async (req, res ) => {
  // Use credentials from config.json
  const client_id = DIGIKEY_CLIENT_ID;
  const client_secret = DIGIKEY_CLIENT_SECRET;
  try {
    const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const response = await axios.post(DIGIKEY_TOKEN_URL, 'grant_type=client_credentials', {
      headers: { 
        'Authorization': `Basic ${authHeader}`, 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      timeout: 15000 // 15 second timeout
    });
    res.json(response.data);
  } catch (err) {
    console.error('Digi-Key token error:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    const errorMsg = err.response?.data || { error: err.message };
    res.status(status).json(errorMsg);
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/digikey/search', async (req, res) => {
  const { sku } = req.query;
  // Use credentials from config.json
  const clientId = DIGIKEY_CLIENT_ID;
  const clientSecret = DIGIKEY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    // Credentials are now loaded from config.json, so this check is no longer needed
    // return res.status(400).json({ error: 'Missing Digi-Key credentials in headers' });
  }

  try {
    // 1. Get Token
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await axios.post(DIGIKEY_TOKEN_URL, 'grant_type=client_credentials', {
      headers: { 
        'Authorization': `Basic ${authHeader}`, 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      timeout: 10000
    });
    const token = tokenRes.data.access_token;

    // 2. Perform Search
    const searchRes = await axios.post(DIGIKEY_SEARCH_URL, { keywords: sku, limit: 1 }, {
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'X-DIGIKEY-Client-Id': clientId,
        'Content-Type': 'application/json' 
      },
      timeout: 15000
    });

    console.log('--- DIGI-KEY API RESPONSE START ---');
    console.log(JSON.stringify(searchRes.data, null, 2));
    console.log('--- DIGI-KEY API RESPONSE END ---');

    res.json(searchRes.data);
  } catch (err) {
    console.error('Digi-Key search failed:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    const errorMsg = err.response?.data || { error: err.message };
    res.status(status).json(errorMsg);
  }
});

app.listen(5177, () => console.log('Backend running on http://localhost:5177'));
_File_content_redacted_
