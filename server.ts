import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Persistent submissions directory and files
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Creator PIN
const DEFAULT_CREATOR_PIN = '241003';

if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ creatorPin: DEFAULT_CREATOR_PIN }, null, 2), 'utf-8');
}

function getConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed.creatorPin ? parsed : { creatorPin: DEFAULT_CREATOR_PIN };
  } catch {
    return { creatorPin: DEFAULT_CREATOR_PIN };
  }
}

function saveConfig(cfg: any) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf-8');
}

function getSubmissions(): any[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveSubmissions(list: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

// Middleware: Authenticate creator
function requireCreatorAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers['x-creator-pin'] || req.query.pin;
  const cfg = getConfig();
  if (!token || token !== cfg.creatorPin) {
    return res.status(401).json({ error: 'Acceso restringido únicamente a la creadora de la app' });
  }
  next();
}

// 1. Students submit results (open, anonymous)
app.post('/api/results', (req, res) => {
  try {
    const { predominantStyle, percentages, topCharacters, userStats, gender } = req.body;
    if (!predominantStyle || !percentages) {
      return res.status(400).json({ error: 'Faltan datos del test' });
    }

    const newRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      gender: gender || 'otro',
      predominantStyle,
      percentages,
      topCharacter: topCharacters?.[0]?.character?.name || 'Desconocido',
      topCharacterTrait: topCharacters?.[0]?.character?.trait || '',
      topCharacterCompatibility: topCharacters?.[0]?.compatibility || 0,
      userStats: userStats || {}
    };

    const current = getSubmissions();
    current.push(newRecord);
    saveSubmissions(current);

    res.status(201).json({ success: true, count: current.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Creator Login / Verification
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  const cfg = getConfig();
  if (pin === cfg.creatorPin) {
    return res.json({ success: true, token: cfg.creatorPin });
  }
  return res.status(401).json({ success: false, error: 'Código PIN incorrecto' });
});

// 3. Creator Changes PIN
app.post('/api/admin/change-pin', requireCreatorAuth, (req, res) => {
  const { newPin } = req.body;
  if (!newPin || String(newPin).trim().length < 4) {
    return res.status(400).json({ error: 'El PIN debe tener al menos 4 caracteres' });
  }
  const cfg = getConfig();
  cfg.creatorPin = String(newPin).trim();
  saveConfig(cfg);
  res.json({ success: true });
});

// 4. View results (Restricted strictly to creator)
app.get('/api/results', requireCreatorAuth, (_req, res) => {
  try {
    const list = getSubmissions();
    res.json({ results: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Reset results (Restricted strictly to creator)
app.post('/api/results/reset', requireCreatorAuth, (_req, res) => {
  try {
    saveSubmissions([]);
    res.json({ success: true, count: 0 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static dist folder in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
