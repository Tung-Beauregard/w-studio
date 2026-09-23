/* 網站內容集中在這裡修改。只放準備公開的資訊；不需要 API 金鑰。 */
window.SITE_DATA = {
  profile: { name: 'W', github: 'https://github.com/Tung-Beauregard' },
  projects: [
    { id: 'language', category: 'language', number: '01', eyebrow: 'LANGUAGE & EXPLORATION', title: '從一句你好，開始新的探索。', name: '泰語 × 繁體中文學習', description: '用中文學泰語，也用泰語學中文。結合課程、手寫、打字、口說與測驗，找到自己的學習節奏。', tags: ['雙向學習', '手寫練習', 'Web App'], url: 'https://tung-beauregard.github.io/Thai_TraditionalChinese_learing_W/', repo: 'https://github.com/Tung-Beauregard/Thai_TraditionalChinese_learing_W', note: '打開瀏覽器即可探索', icon: 'language' },
    { id: 'astral', category: 'exploration', number: '02', eyebrow: 'ASTRAL NOTES / SELF EXPLORATION', title: '在星光之間，認識自己。', name: 'Astral Notes 星語', description: '整合西洋占星、紫微斗數與生辰八字，從本命盤到雙人合盤，用白話解讀探索自己與彼此的連結。', tags: ['命盤探索', '雙人合盤', 'Web App'], url: 'https://astral-notes.w-tw.chatgpt.site/', note: '出生資料在裝置上計算 · 命理解讀供探索參考', icon: 'spark' },
    { id: 'line-zh-th', category: 'translation', number: '03', eyebrow: 'W TRANSLATE / CHINESE × THAI', title: '中泰翻譯，直接用 LINE。', name: '中泰翻譯 LINE 機器人', description: '翻譯中文和泰文用的小工具。加入 LINE 好友就能使用，操作方式請看聊天室內的說明。', tags: ['中文 / ไทย', 'LINE 機器人', '語言翻譯'], url: 'https://line.me/R/ti/p/%40441rouxg', linkLabel: '加入 LINE', lineId: '@441rouxg', qr: './assets/line-zh-th-qr.png', note: 'LINE ID：@441rouxg · 掃碼加入，或直接開啟 LINE', icon: 'chat' },
    { id: 'line-zh-en-ko', category: 'translation', number: '04', eyebrow: 'W TRANSLATE / CHINESE × ENGLISH × KOREAN', title: '中英韓翻譯，直接用 LINE。', name: '中英韓翻譯 LINE 機器人', description: '支援中文、英文和韓文翻譯。加入 LINE 好友就能使用，操作方式請看聊天室內的說明。', tags: ['中文 / English / 한국어', 'LINE 機器人', '語言翻譯'], url: 'https://line.me/R/ti/p/%40492xqnyt', linkLabel: '加入 LINE', lineId: '@492xqnyt', qr: './assets/line-zh-en-ko-qr.png', note: 'LINE ID：@492xqnyt · 掃碼加入，或直接開啟 LINE', icon: 'chat' }
    ,{
      id: 'agent-hub', category: 'ai-development', number: '05',
      eyebrow: 'MYCELINT / AI DEVELOPMENT', name: 'Mycelint', brand: 'by W Studio',
      position: 'AI 協作開發工作臺', title: '讓想法，長成可用的工具。',
      description: 'Mycelint 是正在研發的 AI 協作開發工作臺，目標是串起任務規劃、程式修改、測試、獨立審查與交付。讓每次開發都有可追蹤的結果，減少在人與模型之間反覆整理、複製與傳話。',
      tags: ['AI 協作', '開發流程', '可追蹤成果'], status: '研發中',
      note: '研發中／尚未開放使用', icon: 'code',
      details: {
        why: '使用不同 AI 協助開發時，人經常需要整理進度、搬運程式與錯誤訊息，再把審查意見帶回另一個工具。Mycelint 希望把這些步驟接成可追蹤的工作流程，讓人把時間留給目標、取捨與必要決策。',
        workflow: ['設定目標與範圍', '執行修改', '測試與驗收', '獨立審查', '交付成果'],
        feedback: '審查或測試發現問題時，回到修改階段；需要新的權限或人工決策時，再交由使用者處理。',
        naming: 'Mycelint 的名稱結合 Mycelium（菌絲體）與 Intelligence（智慧）。這是品牌命名構想，不是既有英文單字的正式字義。',
        growth: [
          ['菌絲體', '持續完善的開發核心'],
          ['分枝與連接', '代理之間的分工協作'],
          ['長出的子實體', '最後交付的軟體與工具']
        ],
        vision: '專案希望從一個可重複使用的核心開始，逐步建立更多實用作品。',
        progress: '目前為研發原型，持續整合受限執行、測試與獨立審查流程，尚未開放使用。'
      }
    }
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
  ]
};
