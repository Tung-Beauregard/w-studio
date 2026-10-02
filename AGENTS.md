# W AI Studio 維護規則

適用於本儲存庫。當次使用者明確要求優先；完整架構、內容管理及發布方式見 README.md。

- 延續純 HTML、CSS、JavaScript，不新增無必要的建置步驟。
- 維持 `brand-guide.md` 的 W 標誌比例、近黑與薄荷綠品牌色、繁體中文文案。
- JSON 為公開文案主要來源；不要只改 HTML／JavaScript 備援。尊重使用者透過 CMS 修改的既有內容。
- `content/home.json` 的 `projectOrder` 控制顯示與順序；新增專案保留既有項目的相對順序，未列出項目維持隱藏。
- 新增專案必須同步 `assets/site-data.js`、`assets/app.js` 的插圖與三步功能介紹、`content/projects.json`、`content/introductions.json`、`content/home.json` 與 `.pages.yml`。排序選單及數量上限要一致。
- 專案技術 ID 保持穩定；網址、分類、圖片與連結由程式維護。保持 JSON 純文字與安全 URL 驗證。
- 原始碼、正式使用入口與下載是不同連結。沒有指定的公開檔案，不得自動新增下載。
- `instrument-principles` 屬於 `science`（科學教學），指向 `https://tung-beauregard.github.io/instrument-principles/`。目前開放離子阱質譜、GC-MS、UV-Vis；新增教材時同步更新卡片、介紹與教材數量。
- 改動專案、文案載入或排序後，執行 `node --test tests/content-loader.test.cjs tests/content-merge.test.cjs`。新增項目需擴充既有目錄測試，不移除原有斷言。
- 實際確認桌面／手機版面、分類、功能介紹彈窗、對外入口。新增跨專案入口時，也要測試返回 W AI Studio 的動線。
- 保留使用者未提交變更，不強制推送、不改寫歷史。發布符合使用者本次授權；交付時區分本機預覽、部署中與正式上線。
