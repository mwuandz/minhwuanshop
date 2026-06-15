const form = document.getElementById('shortenForm');
const urlInput = document.getElementById('url');
const customCodeInput = document.getElementById('customCode');
const result = document.getElementById('result');
const shortUrlInput = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');
const message = document.getElementById('message');
const linksList = document.getElementById('linksList');
const refreshBtn = document.getElementById('refreshBtn');

function showMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('Đang tạo link...', '');

  try {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: urlInput.value.trim(),
        customCode: customCodeInput.value.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Có lỗi xảy ra.', 'error');
      return;
    }

    shortUrlInput.value = data.shortUrl;
    result.classList.remove('hidden');
    showMessage('Tạo link thành công!', 'success');
    form.reset();
    loadLinks();
  } catch (error) {
    showMessage('Không kết nối được server.', 'error');
  }
});

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(shortUrlInput.value);
  showMessage('Đã copy link!', 'success');
});

async function loadLinks() {
  linksList.innerHTML = '<p>Đang tải...</p>';

  try {
    const response = await fetch('/api/links');
    const links = await response.json();

    if (!links.length) {
      linksList.innerHTML = '<p>Chưa có link nào.</p>';
      return;
    }

    linksList.innerHTML = links.map(link => `
      <div class="link-item">
        <a href="/${link.code}" target="_blank">${link.shortUrl}</a>
        <p class="original">${link.originalUrl}</p>
        <div class="meta">Mã: ${link.code} • Click: ${link.clicks} • Tạo lúc: ${new Date(link.createdAt).toLocaleString('vi-VN')}</div>
      </div>
    `).join('');
  } catch (error) {
    linksList.innerHTML = '<p>Không tải được danh sách link.</p>';
  }
}

refreshBtn.addEventListener('click', loadLinks);
loadLinks();
