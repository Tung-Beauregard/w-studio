# W Studio｜專案與工具入口

可放在 GitHub Pages 的繁體中文個人網站，整合 GitHub 介紹、公開專案、指定小工具下載、功能介紹動畫與常用網站。

本站使用純 HTML、CSS、JavaScript，不需 npm、不需編譯，也不依賴 API。直接開啟 `index.html` 即可預覽。

正式網站：[W Studio](https://tung-beauregard.github.io/w-studio/)

網站儲存庫：[Tung-Beauregard/w-studio](https://github.com/Tung-Beauregard/w-studio)。由 `main` 分支根目錄發布，後續更新提交後會自動部署。

## 檔案

```text
index.html
.nojekyll
assets/
  styles.css
  app.js
  site-data.js
  downloads.js
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

## 修改公開內容

主要內容集中在 `assets/site-data.js` 的 `window.SITE_DATA`：

| 區塊 | 用途 |
| --- | --- |
| `profile` | 首頁介紹動畫的 GitHub 入口 |
| `projects` | 專案名稱、介紹與連結 |
| `tools` | 由你指定的工具介紹、檔名與下載連結；預設為空 |
| `shortcuts` | 網站預設提供的常用連結 |

照現有資料格式修改文字與網址，儲存後重新整理即可預覽。更新完成後提交到 GitHub 的 `main`，Pages 會自動重新發布。網站不會自動從 GitHub 抓取新專案或版本，相關文案和連結需在這個檔案更新。

品牌、姓名、首頁標語與頁尾文字在 `index.html`；視覺樣式在 `assets/styles.css`，互動功能在 `assets/app.js`。新增圖片等資源可放進 `assets/`。

新增專案時，請同步在 `assets/app.js` 的 `demos` 增加相同 `id` 的三步驟介紹，並依需要調整專案示意圖。工具也可依實際功能補上相同 `id` 的介紹動畫。現有三個專案已具備介紹內容；未提供原始碼網址的專案不會顯示原始碼按鈕。

## 品牌識別

品牌 SVG、色碼與使用建議請見 `brand-guide.md`；`brand.html` 提供品牌示意板。

## 常用網站

頁面內新增或刪除的常用網站，只會保存在當前瀏覽器的 `localStorage`，不會寫回 GitHub，也不會同步給其他人或其他裝置。清除網站資料後，個人修改可能消失；本機預覽與上線網址也會各自保存資料。

若要調整所有訪客初次看到的預設連結，請編輯 `assets/site-data.js` 的 `shortcuts` 並重新發布。

本次加入 Astral Notes 星語時，舊版已儲存的清單會一次補入新捷徑，保留自訂網站、原有順序及先前移除的其他預設網站。清單已有相同網址時不會重複加入；之後移除星語也不會在重新整理後補回。此更新依賴瀏覽器允許儲存網站資料；無法儲存時，變更只能保留於目前頁面。

## 專案介紹

- **LabManagement SFP**：[線上系統](https://tung-beauregard.github.io/LabManagement_SFP/)需要實驗室帳號登入；[GitHub 專案](https://github.com/Tung-Beauregard/LabManagement_SFP)提供公開原始碼。
- **泰語 × 繁體中文學習**：[線上學習](https://tung-beauregard.github.io/Thai_TraditionalChinese_learing_W/)包含課程、手寫、打字、口說與測驗；[GitHub 專案](https://github.com/Tung-Beauregard/Thai_TraditionalChinese_learing_W)提供專案文件與原始碼。學習網站透過 CDN 載入部分程式，並非完全離線；口說需要麥克風與網路，專案 README 建議使用電腦版 Chrome／Edge。
- **Astral Notes 星語**：[官方網站](https://astral-notes.w-tw.chatgpt.site/)提供西洋占星、紫微斗數與生辰八字的本命盤探索、白話解讀與雙人合盤。命理解讀供自我探索參考。

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
