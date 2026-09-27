# W AI Studio｜專案與工具入口

可放在 GitHub Pages 的繁體中文個人網站，整合 GitHub 介紹、公開專案、指定小工具下載與功能介紹動畫。

本站使用純 HTML、CSS、JavaScript，不需 npm、不需編譯。網站透過同站 JSON 載入可編輯文案，頁尾訪客數由外部計數服務提供。請使用 HTTP 本機伺服器預覽最新文案；直接開啟 `index.html` 只會顯示程式內的備援版本。

正式網站：[W AI Studio](https://tung-beauregard.github.io/w-studio/)

網站儲存庫：[Tung-Beauregard/w-studio](https://github.com/Tung-Beauregard/w-studio)。由 `main` 分支根目錄發布，後續更新提交後會自動部署。

## 檔案

```text
index.html
.nojekyll
.pages.yml              # Pages CMS 中文編輯表單
admin/
  index.html            # 文案管理入口（noindex）
  admin.css
content/
  home.json             # 首頁與區塊文案
  projects.json         # 既有專案與 Mycelint 詳情
  introductions.json    # 功能介紹彈窗文案
assets/
  styles.css
  app.js
  content.js
  site-data.js
  downloads.js
  visitors.js
  favicon.svg
```

## 部署到 GitHub Pages

1. 在 GitHub 建立儲存庫，例如 `w-studio`。GitHub Free 使用 Pages 時，儲存庫須設為 **Public**。
2. 將此資料夾的**內容**上傳到 `main` 分支根目錄，讓 `index.html` 直接位於根目錄；請一併保留空白的 `.nojekyll`。
3. 開啟儲存庫 **Settings → Pages → Build and deployment**。
4. Source 選 **Deploy from a branch**，Branch 選 **main**，資料夾選 **/(root)**，按 **Save**。
5. 部署完成後，在 **Settings → Pages → Visit site** 開啟網站。更新可能需要約 10 分鐘，可在 **Actions** 查看部署結果。

一般專案的預設網址是 `https://你的帳號.github.io/w-studio/`。若希望使用 `https://你的帳號.github.io/`，儲存庫需命名為 `你的帳號.github.io`，其餘步驟相同。若該儲存庫已存在，請先保留原有網站內容再整合。

設定 Pages 發布來源需要儲存庫的 admin 或 maintainer 權限。網站檔案使用相對路徑，部署在專案子目錄也能載入；新增本機資源時請沿用 `./assets/...`，避免以 `/assets/...` 指向網域根目錄。

官方說明：[建立 Pages 網站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)、[設定發布來源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[預設網址規則](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。

## 文案管理

開啟 [文案管理入口](https://tung-beauregard.github.io/w-studio/admin/)，按「登入 GitHub 編輯文案」前往 [Pages CMS](https://app.pagescms.org/)。網站訪客照常瀏覽首頁；編輯權限由 GitHub 和 Pages CMS 驗證。管理入口本身是公開說明頁，`noindex` 用於避免搜尋索引，並不是存取權限機制。

### 第一次登入

1. 使用具有 `Tung-Beauregard/w-studio` 寫入權限的 GitHub 帳號登入 Pages CMS。
2. 依 GitHub 畫面授權官方 Pages CMS GitHub App；安裝範圍選 **Only select repositories**，只選 **w-studio**。
3. 回到 Pages CMS，選擇 **Tung-Beauregard/w-studio** 儲存庫與 **main** 分支。根目錄的 `.pages.yml` 會提供中文編輯表單。

首次 GitHub 授權須由網站擁有者本人完成；此設定檔不代表帳號已完成授權。之後通常只需登入並選取網站。本站使用 Pages CMS 官方線上服務，不需自行架設後端，也不需要在網站檔案或表單中放入 GitHub Token。

### 日常編輯與發布

1. 在 Pages CMS 選擇「首頁文案」、「專案文案」或「功能介紹」。
2. 修改對應欄位，使用純文字；這些欄位不支援 HTML 或 Markdown。短標題、按鈕和標籤有長度限制；既有步驟的數量與順序請保留，以對應頁面與動畫。
   要調整首頁專案卡片順序，開啟「首頁文案」最上方的「專案卡片順序」，拖曳各列左側把手。請保留全部七個專案；專案選項固定，文案仍在「專案文案」編輯。
3. 確認內容後按 **Save／儲存**。在 **main** 儲存會建立 GitHub 提交，並透過現有 GitHub Pages 設定發布到正式網站；沒有另一個「發布」按鈕或審稿階段。
4. 等待部署完成再重新整理網站，通常需要幾分鐘。可到 [GitHub Actions](https://github.com/Tung-Beauregard/w-studio/actions) 查看執行狀態；若仍看到舊內容，可重新載入頁面。

| 表單 | 內容來源與編輯範圍 |
| --- | --- |
| 首頁文案 | `content/home.json`：專案卡片順序、導覽文字、首頁主標題與介紹、按鈕、特色標籤、專案／工具區塊說明與頁尾 |
| 專案文案 | `content/projects.json`：七個既有專案的名稱、標語、簡介、標籤、提示、入口按鈕文字，以及 Mycelint 詳情 |
| 功能介紹 | `content/introductions.json`：網站與專案介紹彈窗的標題、說明、入口按鈕文字與三個步驟 |

三份 JSON 是**線上可編輯文案的主要來源**。不要只改 `index.html`、`assets/site-data.js` 或 `assets/app.js` 內的同名舊文案：HTTP 網站成功載入 JSON 後，會以 JSON 文案覆蓋備援版本。根目錄 `.pages.yml` 的 `settings.content.merge: true` 保留表單未公開的資料；固定專案物件與清單長度用來維持現有結構。

入口網址、GitHub 網址、LINE 帳號識別與 QR Code、專案分類、圖示、圖片、工具下載設定和互動示意圖仍由原始碼維護。文字表單不新增或刪除專案，也不修改這些技術設定。

`content/home.json` 的 `projectOrder` 是含固定 `id` 的物件清單，僅控制卡片的展示順序；分類篩選也沿用此順序。專案文案仍按 `content/projects.json` 的固定 ID 對應，卡片上的 PROJECT 編號為原有識別編號，不因排序改變。缺少或無法讀取排序時沿用預設順序；重複、未知或格式錯誤的項目會略過，未列出的專案依預設順序補在後面，避免卡片遺失。排序清單顯示的名稱由 `.pages.yml` 提供，不影響卡片文案。

### 找回先前文案

每次儲存都有 GitHub 提交紀錄。到 [修改紀錄](https://github.com/Tung-Beauregard/w-studio/commits/main/) 找到正確版本，可將該版本的 JSON 文案複製回編輯器，再儲存發布。熟悉 Git 的維護者也可對要撤回的提交執行 `git revert <commit-sha>`，檢查差異後推送新的還原提交；無需覆寫或刪除既有提交歷史。

若 Pages CMS 暫時無法使用，仍可在 GitHub 或本機修改 `content/*.json` 並提交到 `main`，發布流程相同。各欄位的名稱、資料型態與固定清單長度須保留。

官方文件：[Pages CMS 快速開始](https://pagescms.org/docs/quick-start/)、[內容設定](https://pagescms.org/docs/configuration/content/)、[欄位設定](https://pagescms.org/docs/configuration/content/fields/)。

## 本機預覽與程式維護

在儲存庫根目錄啟動任一靜態 HTTP 伺服器。例如電腦已安裝 Python 時：

```sh
python -m http.server 8000
```

開啟 `http://localhost:8000/` 查看首頁，`http://localhost:8000/admin/` 查看管理入口。編輯 JSON 後重新整理即可預覽。直接以 `file://` 開啟 `index.html` 時，瀏覽器通常無法讀取這些 JSON，因此頁面保留 HTML／JavaScript 內的備援文案；JSON 載入失敗時同樣使用備援，備援內容可能比線上編輯版本舊。

| 程式來源 | 用途 |
| --- | --- |
| `index.html` | 頁面骨架、固定視覺標記與首頁備援文案 |
| `assets/site-data.js` | `window.SITE_DATA`：個人 GitHub 連結、專案識別與入口、專案備援文案，以及工具下載清單 |
| `assets/content.js` | JSON 文案載入、首頁文字套用與載入失敗處理 |
| `assets/app.js` | 互動功能、示意圖、專案及介紹文案合併、備援與渲染 |
| `assets/styles.css` | 視覺樣式與響應式排版 |

新增專案時，需同步更新 `assets/site-data.js` 的專案資料、`assets/app.js` 的示意圖及介紹、`content/projects.json` 與需要的 `content/introductions.json`，再將對應欄位加入 `.pages.yml`。分類按鈕在 `index.html` 設定。現有七個專案均具備介紹，全部專案數量由資料自動更新；沒有有效網址的專案不會顯示外部入口，未提供原始碼網址的專案不會顯示原始碼按鈕。

新增專案也需將固定 ID 加入 `content/home.json` 的 `projectOrder`，並更新 `.pages.yml` 排序欄的選項與 `min`／`max` 數量。

已提供使用入口的專案沿用三步驟介紹動畫；Mycelint 由專案的 `details` 提供站內詳情。新增圖片等資源可放進 `assets/`。網站不會自動從 GitHub 抓取新專案或版本。改版後也應維護程式內的備援文案，避免直接開檔或載入失敗時呈現過時資訊。

### 文案功能檢查

已安裝 Node.js 時，可執行以下測試，不需安裝 npm 套件：

```sh
node --test tests/content-loader.test.cjs tests/content-merge.test.cjs
```

測試涵蓋文案載入、網路失敗與逾時回退、純文字呈現、專案設定保護，以及固定三步介紹。首次 Pages CMS 授權後，仍需實際儲存一次文案並確認 GitHub Pages 更新，以驗證帳號權限及完整發布流程。

## Mycelint 專案展示

Mycelint（by W AI Studio）定位為 AI 協作開發工作臺，列於「AI 開發」分類。網站資料識別碼為 `agent-hub`，僅供網站元件識別。介紹以一般訪客可理解的需求、預期工作流程、名稱意象及研發原型狀態為主；尚未提供使用、下載或原始碼入口。

「了解專案」開啟原生 `<dialog>`，支援 Escape、關閉按鈕、鍵盤焦點限制與關閉後返回原按鈕。菌絲圖以內嵌 SVG 與 CSS 呈現核心、分枝、工具節點，標示「概念示意」；減少動態效果偏好與全站暫停動畫均支援。網站不連接任何工程環境。

## 系統 Demo

「系統 Demo」分類只使用獨立展示入口與中性名稱。實驗室管理 Demo 連到 [公開展示版](https://tung-beauregard.github.io/w-lab-demo/)，包含虛構庫存、預約、借閱與待辦資料，操作僅保存在訪客目前的瀏覽器。

點餐系統 Demo 位於 `demos/ordering/`，使用新建的中性介面與虛構菜單。提供分類、搜尋、購物車、內用／外帶、日期時段選擇、訂單確認與模擬送出；不接正式點餐服務，不需個人資料、不付款、不建立訂單。狀態僅保留在頁面記憶體，重新整理或「重新體驗」即可清除。CSP 使用 `connect-src 'none'` 與 `form-action 'none'`。

## 品牌識別

品牌 SVG、色碼與使用建議請見 `brand-guide.md`；`brand.html` 提供品牌示意板。

## 專案介紹

- **泰語 × 繁體中文學習**：[線上學習](https://tung-beauregard.github.io/Thai_TraditionalChinese_learing_W/)包含課程、手寫、打字、口說與測驗；[GitHub 專案](https://github.com/Tung-Beauregard/Thai_TraditionalChinese_learing_W)提供專案文件與原始碼。學習網站透過 CDN 載入部分程式，並非完全離線；口說需要麥克風與網路，專案 README 建議使用電腦版 Chrome／Edge。
- **Astral Notes 星語**：[官方網站](https://astral-notes.w-tw.chatgpt.site/)提供西洋占星、紫微斗數與生辰八字的本命盤探索、白話解讀與雙人合盤。命理解讀供自我探索參考。

- **中泰翻譯 LINE 機器人**：[@441rouxg](https://line.me/R/ti/p/%40441rouxg)，提供中文與泰文翻譯入口。
- **中英韓翻譯 LINE 機器人**：[@492xqnyt](https://line.me/R/ti/p/%40492xqnyt)，依使用者提供的語言對應加入介紹。

兩個 LINE 專案都有品牌頭像、概念介紹、直接加入好友連結與「掃碼加入」彈窗。QR Code 取自各自 LINE 官方加入好友頁的圖片，原樣保存在 assets；未疊加頭像或改寫 QR Code。公開加入好友頁可開啟，但未顯示可核對的帳號名稱。網站頭像為 W AI Studio 品牌設計，LINE 帳號本身的頭像需在其管理後台另外設定。

這些專案保留介紹與線上入口，不會自動加入工具下載區，也不會把專案原始碼 ZIP 當成小工具安裝包。

網站內的介紹動畫是**功能概念示意**，不是專案操作實錄。

## 指定小工具下載

工具清單預設為 `tools: []`，尚未指定檔案時不提供任何工具下載。只有你明確指定的檔案才應加入清單；網站不會掃描你的電腦或自動挑選檔案。

每個工具必須設定 `fileName`、有效的 `downloadUrl`，以及 `published: true`，才會啟用下載按鈕。未指定檔案、未提供有效連結，或尚未發布時，會顯示「尚未開放下載」。可先放入以下介紹草稿，確認並上傳實際檔案後再將 `published` 改成 `true`：

```js
tools: [
  {
    id: 'my-local-tool',
    icon: 'code',
    title: '我的本機小工具',
    description: '請填入這個工具的用途與主要功能。',
    type: 'Windows 小工具',
    requirements: 'Windows 10 / 11',
    fileName: 'my-local-tool-v1.0.zip',
    downloadUrl: './downloads/my-local-tool-v1.0.zip',
    published: false
  }
]
```

`downloadUrl` 可使用 HTTPS 的直接檔案連結，或 `./downloads/檔名` 這類網站內相對路徑。`fileName` 請填實際檔名，並與連結的檔案相符。

### 檔案可以放在哪裡

- **GitHub Releases（適合小工具）**：在工具的 GitHub 儲存庫建立版本，將你指定的 `.exe`、`.msi` 或 `.zip` 上傳為 Release 資產，再把該檔案的 HTTPS 下載連結填進 `downloadUrl`。可以維護版本說明、保留舊版，網站本身仍由 GitHub Pages 提供。[建立 Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)、[Release 連結說明](https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases)
- **隨網站一起放置（適合小檔案）**：在 `index.html` 旁建立 `downloads/`，放入你指定的檔案，並使用 `./downloads/檔名`。檔案會隨 GitHub Pages 部署並對外公開；改檔案後也需要重新部署。
- **自己的伺服器或 NAS**：若已有穩定對外提供 HTTPS 下載的服務，也可使用它的直接檔案連結。服務需持續連線，訪客才能下載。

已上線的網站不能用 `C:\...`、`file://...` 或只存在你電腦上的路徑，讓其他訪客直接取得檔案。檔案必須先放到訪客可連線的主機。若只在同一個區域網路分享，也能用區網檔案服務，但外部訪客無法使用。

下載按鈕是公開檔案的入口，`published` 只控制此網站是否顯示可用按鈕，不是權限保護。要撤回已公開的檔案，還需從實際託管位置移除該檔案。

## 累積到站人數

頁尾使用[不蒜子官方服務](https://ibruce.info/2015/04/04/busuanzi/)的 `site_uv`，顯示估算訪客數，而非 `site_pv` 瀏覽次數。計數由共用服務保存，不是瀏覽器中的假累加器，也不含啟用前的流量。

`assets/visitors.js` 只在正式網址 `https://tung-beauregard.github.io/w-studio/`（含 `index.html`）啟用；本機或其他預覽位置顯示「預覽」，不載入計數服務。正式頁面載入時會連線至 `busuanzi.ibruce.info`，不需要帳號或金鑰。停用 JavaScript 時顯示破折號；服務失敗或超過 10 秒時顯示「暫時無法載入」，不以 0 冒充真實統計。

此數字依服務的 UV 識別方式估算，不能視為精確、不重複的真人總數；跨裝置、瀏覽器與追蹤阻擋可能影響結果。不蒜子以站點彙總，若未來同網域的其他專案也接入這項服務，需重新評估是否應改用獨立統計。更換正式網址時，也需更新腳本的網址檢查與計數設定。
