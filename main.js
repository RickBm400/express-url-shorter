import { config } from 'dotenv';
import Url from './src/models/url.model.js'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import express from 'express'

config();

const app = express();
app.set('trust proxy', true);
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const baseUrl = process.env.BASE_URL;

app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'longUrl is required' });
  }

  try {
    const url = new Url({ longUrl });
    await url.save();
    const shortUrl = `${baseUrl}/${url.shortCode}`;
    res.json({ shortUrl });
  } catch (err) {
    res.status(500).json({ error: 'Error saving URL' });
  }
});

app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    res.redirect(url.longUrl);
  } catch (err) {
    res.status(500).json({ error: 'Error finding URL' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
