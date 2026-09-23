/* 網站內容集中在這裡修改。只放準備公開的資訊；不需要 API 金鑰。 */
window.SITE_DATA = {
  profile: { name: 'W', github: 'https://github.com/Tung-Beauregard' },
  projects: [
    { id: 'language', category: 'language', number: '01', eyebrow: 'LANGUAGE & EXPLORATION', title: '從一句你好，開始新的探索。', name: '泰語 × 繁體中文學習', description: '用中文學泰語，也用泰語學中文。結合課程、手寫、打字、口說與測驗，找到自己的學習節奏。', tags: ['雙向學習', '手寫練習', 'Web App'], url: 'https://tung-beauregard.github.io/Thai_TraditionalChinese_learing_W/', repo: 'https://github.com/Tung-Beauregard/Thai_TraditionalChinese_learing_W', note: '打開瀏覽器即可探索', icon: 'language' },
    { id: 'astral', category: 'exploration', number: '02', eyebrow: 'ASTRAL NOTES / SELF EXPLORATION', title: '在星光之間，認識自己。', name: 'Astral Notes 星語', description: '整合西洋占星、紫微斗數與生辰八字，從本命盤到雙人合盤，用白話解讀探索自己與彼此的連結。', tags: ['命盤探索', '雙人合盤', 'Web App'], url: 'https://astral-notes.w-tw.chatgpt.site/', note: '出生資料在裝置上計算 · 命理解讀供探索參考', icon: 'spark' },
    { id: 'line-zh-th', category: 'translation', number: '03', eyebrow: 'W TRANSLATE / CHINESE × THAI', title: '中文與泰文，在對話中相遇。', name: '中泰翻譯 LINE 機器人', description: '把中文與泰文翻譯的入口，放進熟悉的 LINE。從日常問候到跨語言聊天，讓溝通多一點方便。', tags: ['中文 / ไทย', 'LINE 機器人', '語言翻譯'], url: 'https://line.me/R/ti/p/%40441rouxg', linkLabel: '加入 LINE', lineId: '@441rouxg', qr: './assets/line-zh-th-qr.png', note: 'LINE ID：@441rouxg · 掃碼加入，或直接開啟 LINE', icon: 'chat' },
    { id: 'line-zh-en-ko', category: 'translation', number: '04', eyebrow: 'W TRANSLATE / CHINESE × ENGLISH × KOREAN', title: '三種語言，讓對話更靠近。', name: '中英韓翻譯 LINE 機器人', description: '中文、英文與韓文的翻譯入口，集中在 LINE 對話裡。加入機器人，探索跨語言溝通的更多可能。', tags: ['中文 / English / 한국어', 'LINE 機器人', '語言翻譯'], url: 'https://line.me/R/ti/p/%40492xqnyt', linkLabel: '加入 LINE', lineId: '@492xqnyt', qr: './assets/line-zh-en-ko-qr.png', note: 'LINE ID：@492xqnyt · 掃碼加入，或直接開啟 LINE', icon: 'chat' }
  ],
  // 只加入你指定要公開的小工具，不會從 GitHub 專案自動產生下載。
  // published === true、fileName 與有效 downloadUrl 齊備，才出現下載按鈕。
  // downloadUrl 支援 HTTPS 檔案網址或 ./downloads/檔名；不能填 C:\\ 本機路徑。
  tools: [
    /* 指定實際檔案後，依此格式新增（以下範例不會出現在網站）：
    {
      id: 'my-utility', icon: 'code', title: '我的本機小工具',
      description: '這個工具可以幫你完成什麼工作。',
      type: 'Windows · ZIP', requirements: '請填入支援的系統與使用方式。',
      fileName: 'my-utility-v1.0.zip', downloadUrl: './downloads/my-utility-v1.0.zip',
      published: false
    }
    */
  ],
  shortcuts: [
    { id: 'github', name: '我的 GitHub', description: '程式碼與開發紀錄', url: 'https://github.com/Tung-Beauregard', icon: 'github', color: 'mint' },
    { id: 'language', name: '語言練習', description: '泰語 × 繁體中文', url: 'https://tung-beauregard.github.io/Thai_TraditionalChinese_learing_W/', icon: 'language', color: 'purple' },
    { id: 'astral', name: 'Astral Notes 星語', description: '本命盤與雙人合盤探索', url: 'https://astral-notes.w-tw.chatgpt.site/', icon: 'spark', color: 'amber' },
    { id: 'line-zh-th', name: '中泰翻譯 LINE', description: '中文 / ไทย · @441rouxg', url: 'https://line.me/R/ti/p/%40441rouxg', icon: 'chat', color: 'amber' },
    { id: 'line-zh-en-ko', name: '中英韓翻譯 LINE', description: '中文 / English / 한국어 · @492xqnyt', url: 'https://line.me/R/ti/p/%40492xqnyt', icon: 'chat', color: 'purple' },
    { id: 'mdn', name: 'MDN Web Docs', description: '開發文件與參考', url: 'https://developer.mozilla.org/zh-TW/', icon: 'code', color: 'mint' },
    { id: 'chatgpt', name: 'ChatGPT', description: '讓想法再往前一步', url: 'https://chatgpt.com/', icon: 'spark', color: 'amber' },
    { id: 'drive', name: 'Google Drive', description: '檔案與協作空間', url: 'https://drive.google.com/', icon: 'folder', color: 'blue' }
  ]
};
