import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Weather Briefing Endpoint
  app.post('/api/ai-insights', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({ error: 'GEMINI_API_KEY is not configured', insight: null });
      }

      const { cityName, weatherData } = req.body;
      if (!cityName || !weatherData) {
        return res.status(400).json({ error: 'Missing cityName or weatherData' });
      }

      const current = weatherData.current || {};
      const daily = weatherData.daily || {};

      const prompt = `You are a top-tier lead meteorologist and weather intelligence specialist. Provide a brief, engaging, 3-sentence daily weather briefing and lifestyle recommendation for ${cityName}.

Current Conditions:
- Temperature: ${current.temperature_2m}°C (Apparent: ${current.apparent_temperature}°C)
- Humidity: ${current.relative_humidity_2m}%
- Wind Speed: ${current.wind_speed_10m} km/h
- Precipitation: ${current.precipitation} mm
- Max Temp Today: ${daily.temperature_2m_max ? daily.temperature_2m_max[0] : 'N/A'}°C
- Min Temp Today: ${daily.temperature_2m_min ? daily.temperature_2m_min[0] : 'N/A'}°C
- UV Index Max: ${daily.uv_index_max ? daily.uv_index_max[0] : 'N/A'}

Format your answer as 3 bullet-point sentences:
1) Atmospheric Summary (What it feels like out there right now).
2) Day Progression & Outfit Advice (What to expect and wear).
3) Activity / Travel Note (Best time for outdoors, health/commute advisory).

Keep it warm, concise, clear, and actionable without any fluffy intro phrases.`;

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      return res.json({ insight: text });
    } catch (err: any) {
      console.error('Error generating AI weather insight:', err?.message || err);
      return res.status(500).json({ error: 'Failed to generate AI briefing', insight: null });
    }
  });

  // Vite development vs production static handling
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weather Intelligence server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
