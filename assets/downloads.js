/* 明確發布的單一檔案清單；不推測網址、不列出本機目錄或 GitHub 原始碼。 */
((root) => {
  'use strict';
  function resolveDownload(tool) {
    if (!tool || tool.published !== true || typeof tool.fileName !== 'string' ||
        !tool.fileName.trim() || /[\\/\x00-\x1f\x7f]/.test(tool.fileName) ||
        typeof tool.downloadUrl !== 'string') return null;
    const value = tool.downloadUrl.trim();
    if (/^https:\/\//i.test(value)) {
      try {
        const url = new URL(value);
        if (url.protocol !== 'https:' || url.username || url.password) return null;
        return { href: url.href, fileName: tool.fileName.trim(), local: false };
      } catch { return null; }
    }
    if (!value.startsWith('./downloads/')) return null;
    try {
      const segments = value.slice('./downloads/'.length).split('/').map(decodeURIComponent);
      if (!segments.length || segments.some(s => !s || s === '.' || s === '..' || /[\\/\x00-\x1f\x7f?#:]/.test(s))) return null;
      return { href: './downloads/' + segments.map(encodeURIComponent).join('/'), fileName: tool.fileName.trim(), local: true };
    } catch { return null; }
  }
  root.W_STUDIO_DOWNLOADS = { resolveDownload };
})(typeof window === 'undefined' ? globalThis : window);
