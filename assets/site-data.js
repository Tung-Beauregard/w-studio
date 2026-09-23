/* 網站內容集中在這裡修改。只放準備公開的資訊；不需要 API 金鑰。 */
window.SITE_DATA = {
  profile: { name: 'W', github: 'https://github.com/Tung-Beauregard' },
  projects: [
    { id: 'lab', category: 'lab', number: '01', eyebrow: 'LAB MANAGEMENT', title: '把實驗室日常，整理得剛剛好。', name: 'SFPLAB 實驗室管理系統', description: '藥品與試材、儀器使用、待辦與圖譜分析。讓實驗室的大小事，有一個共同的入口。', tags: ['實驗室管理', '工作流程', 'Web App'], url: 'https://tung-beauregard.github.io/LabManagement_SFP/', repo: 'https://github.com/Tung-Beauregard/LabManagement_SFP', note: '需實驗室帳號登入', icon: 'flask' },
    { id: 'language', category: 'language', number: '02', eyebrow: 'LANGUAGE & EXPLORATION', title: '從一句你好，開始新的探索。', name: '泰語 × 繁體中文學習', description: '用中文學泰語，也用泰語學中文。結合課程、手寫、打字、口說與測驗，找到自己的學習節奏。', tags: ['雙向學習', '手寫練習', 'Web App'], url: 'https://tung-beauregard.github.io/Thai_TraditionalChinese_learing_W/', repo: 'https://github.com/Tung-Beauregard/Thai_TraditionalChinese_learing_W', note: '打開瀏覽器即可探索', icon: 'language' },
    { id: 'astral', category: 'exploration', number: '03', eyebrow: 'ASTRAL NOTES / SELF EXPLORATION', title: '在星光之間，認識自己。', name: 'Astral Notes 星語', description: '整合西洋占星、紫微斗數與生辰八字，從本命盤到雙人合盤，用白話解讀探索自己與彼此的連結。', tags: ['命盤探索', '雙人合盤', 'Web App'], url: 'https://astral-notes.w-tw.chatgpt.site/', note: '出生資料在裝置上計算 · 命理解讀供探索參考', icon: 'spark' }
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
    { id: 'lab', name: 'SFPLAB', description: '實驗室工作入口', url: 'https://tung-beauregard.github.io/LabManagement_SFP/', icon: 'flask', color: 'blue' },
    { id: 'language', name: '語言練習', description: '泰語 × 繁體中文', url: 'https://tung-beauregard.github.io/Thai_TraditionalChinese_learing_W/', icon: 'language', color: 'purple' },
    { id: 'astral', name: 'Astral Notes 星語', description: '本命盤與雙人合盤探索', url: 'https://astral-notes.w-tw.chatgpt.site/', icon: 'spark', color: 'amber' },
    { id: 'mdn', name: 'MDN Web Docs', description: '開發文件與參考', url: 'https://developer.mozilla.org/zh-TW/', icon: 'code', color: 'mint' },
    { id: 'chatgpt', name: 'ChatGPT', description: '讓想法再往前一步', url: 'https://chatgpt.com/', icon: 'spark', color: 'amber' },
    { id: 'drive', name: 'Google Drive', description: '檔案與協作空間', url: 'https://drive.google.com/', icon: 'folder', color: 'blue' }
  ]
};
