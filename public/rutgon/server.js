const express = require('express');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'links.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readLinks() {
  if (!fs.existsSync(DATA_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveLinks(links) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2), 'utf8');
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

app.post('/api/shorten', (req, res) => {
  const { url, customCode } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ message: 'Link không hợp lệ. Link phải bắt đầu bằng http:// hoặc https://' });
  }

  const links = readLinks();
  let code = customCode && String(customCode).trim() ? String(customCode).trim() : nanoid(6);

  if (!/^[a-zA-Z0-9_-]{3,30}$/.test(code)) {
    return res.status(400).json({ message: 'Mã tuỳ chỉnh chỉ được chứa chữ, số, dấu _ hoặc -, từ 3 đến 30 ký tự.' });
  }

  if (links[code]) {
    return res.status(409).json({ message: 'Mã này đã tồn tại, hãy chọn mã khác.' });
  }

  links[code] = {
    url,
    createdAt: new Date().toISOString(),
    clicks: 0
  };

  saveLinks(links);

  const shortUrl = `${req.protocol}://${req.get('host')}/${code}`;
  res.json({ code, shortUrl, originalUrl: url });
});

app.get('/api/links', (req, res) => {
  const links = readLinks();
  const data = Object.entries(links).map(([code, item]) => ({
    code,
    shortUrl: `${req.protocol}://${req.get('host')}/${code}`,
    originalUrl: item.url,
    clicks: item.clicks || 0,
    createdAt: item.createdAt
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(data);
});

app.get('/:code', (req, res) => {
  const { code } = req.params;
  const links = readLinks();

  if (!links[code]) {
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }

  links[code].clicks = (links[code].clicks || 0) + 1;
  saveLinks(links);
  res.redirect(links[code].url);
});

app.listen(PORT, () => {
  console.log(`Link shortener is running at http://localhost:${PORT}`);
});
