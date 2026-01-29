## 專案簡介

本專案為 **股票投資分析與交易輔助前端平台**，使用 **React + TypeScript + Vite** 技術棧打造，主要目標是提供投資人一個：

- **視覺化技術分析介面**：整合 K 線、成交量、KD、MACD 等常用技術指標。
- **個股深度分析工具**：搭配後端演算法與模型計算，協助判斷多空趨勢與風險。
- **專業級操作體驗**：以專業投資人與量化交易者的使用情境為設計核心，介面、互動、資訊呈現皆以實戰為導向。

本專案主要負責 **前端展示層 (Frontend)**，透過 API 與後端服務（如資料抓取、回測、預測模型等）整合，形成一套完整的金融投資輔助系統。

---

## 主要功能說明

### 1. 首頁與股票搜尋 (`src/page/Homepage`)

- **首頁儀表板**
  - 顯示關注股票之整體概況與關鍵指標。
  - 透過多個圖表與卡片組件呈現即時或最新分析結果。

- **股票搜尋與切換 (`SearchPage.tsx`)**
  - 可以輸入股票代號或名稱查詢個股。
  - 支援選擇不同股票後，圖表與分析區塊會自動更新。

### 2. 股票技術分析區 (`StockAnalysis.tsx`)

`StockAnalysis.tsx` 是本專案的核心分析頁面，負責整合多種技術指標與視覺化圖表：

- **K 線圖 (`KLineChart.tsx`)**
  - 顯示開高低收 (OHLC) 資料。
  - 支援時間範圍切換（例如日線、週線等，實作依實際程式而定）。

- **成交量圖 (`VolumeChart.tsx`)**
  - 顯示每日或每根 K 棒對應的成交量。
  - 搭配 K 線圖共同觀察量價關係。

- **KD 指標圖 (`KDChart.tsx`)**
  - 計算與繪製 K、D 線。
  - 幫助判斷超買超賣區域與反轉訊號。

- **MACD 指標圖 (`MACDChart.tsx`)**
  - 計算 DIF、MACD、OSC 等指標。
  - 用於辨識多空力道與趨勢轉折。

- **技術指標計算工具 (`src/utils/stockIndicators.ts`)**
  - 封裝多種技術指標運算邏輯，例如：
    - 移動平均線 (MA)
    - KD 指標計算
    - MACD 相關計算
  - 透過 hooks 或圖表組件共用，確保計算邏輯集中管理、易於維護。

### 3. 自訂 Hook 與狀態管理

- **`useStockIndicators` (`src/hooks/useStockIndicators.ts`)**
  - 將技術指標計算與資料管理抽象為 Hook。
  - 接收原始股價資料，回傳各種指標結果，供圖表或分析元件使用。

- **`AuthContext` (`src/contexts/AuthContext.tsx`)**
  - 若專案有登入/權限相關功能，`AuthContext` 負責：
    - 管理使用者登入狀態。
    - 儲存 Token / 使用者資訊。
    - 提供登入、登出相關操作給全域使用。

### 4. API 呼叫層 (`src/api/stockApi.ts`)

- 負責封裝與後端股票相關 API 的呼叫，例如：
  - 取得個股歷史價格資料。
  - 取得後端計算後的指標或預測結果。
- 統一管理：
  - API Base URL。
  - 錯誤處理與例外情況。
  - 之後若要切換後端服務或 API 網域，只需修改此層即可。

---

## 專案架構概觀

專案 (前端) 目錄結構重點如下：

- **`src/main.tsx`**
  - React 應用程式進入點。
  - 綁定到 `index.html` 中的 root DOM。
  - 掛載 Router、Context Provider 等全域設定。

- **`src/App.tsx`**
  - 應用程式主元件。
  - 負責載入頁面路由與全域 Layout。

- **`src/Router/index.tsx`**
  - 定義 SPA 路由，例如：
    - `/` → 首頁 / 股票分析首頁。
    - 其他頁面 (若有) 例如設定頁、登入頁等。

- **`src/page/Homepage`**
  - **`index.tsx`**：首頁容器元件，整合 Frontpage / StockAnalysis 等組件。
  - **`components/Frontpage`**：
    - `FrontPage.tsx`：前台首頁版面。
    - `SearchPage.tsx`：股票搜尋與選擇功能。
    - `StockAnalysis.tsx`：核心分析頁面與圖表整合。
    - `charts/*.tsx`：各種技術分析圖表元件。
    - 對應的 CSS (`FrontPage.css`, `SearchPage.css`, `StockAnalysis.css`) 負責視覺風格。

- **`src/utils/stockIndicators.ts`**
  - 技術指標運算工具函式集合。

- **`src/hooks/useStockIndicators.ts`**
  - 封裝技術指標計算邏輯的自訂 Hook。

- **`src/contexts/AuthContext.tsx`**
  - 授權 / 使用者狀態管理。

---

## 技術棧與工具

- **框架與語言**
  - React 18+
  - TypeScript
  - Vite (開發與建置工具)

- **樣式**
  - 原生 CSS / 自訂 CSS 檔 (`App.css`, `index.css`, `StockAnalysis.css` 等)

- **程式品質**
  - `eslint.config.js`：ESLint 設定檔，用於程式碼品質檢查。
  - TypeScript 型別檢查 (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`)。

- **建置與開發工具**
  - Node.js 與 npm (或使用 pnpm/yarn，視實際環境而定)。
  - Vite Dev Server：提供快速 Hot Module Replacement (HMR)。

---

## 環境需求

在開始前請先確認開發環境符合以下條件：

- **Node.js**：建議版本 `>= 18`（可使用 `node -v` 檢查）。
- **npm**：建議版本 `>= 9`（可使用 `npm -v` 檢查）。
- 作業系統：macOS / Linux / Windows 皆可（目前作者開發環境為 macOS）。

若你使用的是 macOS 並且尚未安裝 Node.js，建議可透過：

- 安裝 `nvm` 管理多版本 Node.js。
- 或直接從 Node.js 官方網站下載安裝包。

---

## 安裝與初始化步驟

clone 並進入該目錄：

```bash
git clone https://github.com/huangbigice/FMFA.git
cd /FMFA
```

### 1. 安裝前端相依套件

執行：

```bash
npm install

or

npm i
```

此步驟會依照 `package.json` 與 `package-lock.json` 安裝所有前端依賴（React、Vite、各種工具函式庫等）。

> **注意**：如果你使用的是 `pnpm` 或 `yarn`，請自行改成對應的指令，例如 `pnpm install` 或 `yarn install`，但建議與專案原始使用的套件管理工具保持一致，以避免鎖定檔不一致問題。

### 2. 建立與設定環境變數

專案根目錄下已存在：

- `.env`
- `.env.development`
- `.env.production`

通常會在這些檔案中設定：

- API 伺服器位址，例如：
  - `VITE_API_BASE_URL=http://localhost:8000`
- 其他與環境相關的變數（例如是否啟用 Mock、Feature Flag 等）。

請根據實際後端服務位置與需求，檢查並調整：

1. 開啟 `.env.development`，確認開發環境下的 API URL。
2. 若有正式機 / 測試機，對應設定在 `.env.production` 或其他自訂 `.env.*` 檔案。

> **建議**：不要在 `.env` 檔中放入敏感金鑰（如第三方支付金鑰、密碼等），並確保 `.gitignore` 已忽略私密設定（本專案已有 `.gitignore`）。

---

## 啟動開發環境

安裝完成並確認環境變數之後，即可啟動前端開發伺服器。

### 1. 開發伺服器啟動

在專案根目錄執行：

```bash
npm run dev
```

Vite 會啟動開發伺服器（預設為 `http://localhost:4666/` 或終端機顯示之 Port）。

啟動後你可以：

- 在瀏覽器開啟顯示的網址（例如 `http://localhost:4666`）。
- 即時查看前端頁面變化，支援 Hot Reload / HMR。

### 2. 與後端服務整合（如有）

若你同時使用對應的後端服務（例如使用 FastAPI 啟動的 API 伺服器），請確保：

- 後端已啟動（例如 `fastapi dev main.py` 或 `uvicorn main:app --reload` 等，依後端專案為準）。
- 前端 `.env` 中的 `VITE_API_BASE_URL` 指向正確的後端 URL（例如 `http://localhost:8000`）。

前端在呼叫 `src/api/stockApi.ts` 中的 API 時，會自動使用該 Base URL 與路由拼接。

---

## 主要 npm 指令說明

可在 `package.json` 中找到定義的 scripts，這裡整理常用幾項（以下為典型 Vite + React 專案可能存在的指令，實際內容請以你的 `package.json` 為準）：

- **啟動開發伺服器**

  ```bash
  npm run dev
  ```

- **建置專案（Production Bundle）**

  ```bash
  npm run build
  ```

  會在專案根目錄產生 `dist/` 資料夾，內含壓縮後的靜態檔案，可部署至任何支援靜態檔案的伺服器或 CDN。

- **本機預覽 Production 版本**

  ```bash
  npm run preview
  ```

  使用 Vite 內建的 preview server 提供 Production Build 的預覽。

- **程式碼檢查（若有設定）**

  ```bash
  npm run lint
  ```

  透過 ESLint 檢查程式碼風格與潛在錯誤。

---

## 開發流程建議

### 1. 新增技術指標或圖表

若你想擴充新的技術指標或圖表類型，建議流程：

1. 在 `src/utils/stockIndicators.ts` 中新增對應的計算函式。
2. 在 `src/hooks/useStockIndicators.ts` 中整合新指標，使元件可以直接透過 Hook 取得資料。
3. 在 `src/page/Homepage/components/Frontpage/charts` 中新增對應圖表元件（例如 `RSIChart.tsx`）。
4. 在 `StockAnalysis.tsx` 中引入並佈局新圖表。

透過上述方式，可保持：

- 計算邏輯集中在 `utils` / `hooks`。
- 視覺呈現集中在 `charts`。
- 頁面整合則在 `StockAnalysis.tsx`。

### 2. 新增頁面或路由

1. 在 `src/page` 下新增對應目錄與元件檔案。
2. 在 `src/Router/index.tsx` 中新增路由設定。
3. 視需求將頁面掛載到 `App.tsx` 或 Layout 中。

### 3. 程式風格與命名規則

- 使用 **TypeScript** 型別註記，避免使用 `any`。
- 元件檔案以 **PascalCase** 命名，例如：`StockAnalysis.tsx`、`KDChart.tsx`。
- 工具函式與 Hook 以語意清楚的名稱命名，例如：`calculateMACD`、`useStockIndicators`。
- CSS 檔案盡量依元件或頁面區分，例如：`StockAnalysis.css` 只負責該頁面的樣式。

---

## 部署說明（前端）

### 1. 建置

在根目錄執行：

```bash
npm run build
```

成功後會產生 `dist/` 目錄，包含：

- 壓縮後的 JavaScript 檔案
- CSS 檔案
- `index.html`
- 其他靜態資源

### 2. 部署到靜態主機 / CDN

你可以將 `dist/` 目錄內容部署到：

- Nginx / Apache 等 Web Server。
- 靜態網站平台（如 Netlify、Vercel、Cloudflare Pages 等）。
- 自建 S3 + CloudFront 架構等。

> 若部署路徑不是根目錄 `/`，需在 `vite.config.ts` 中調整 `base` 設定，以確保資源路徑正確。

---

## 與後端／模型服務整合建議

雖然本專案為前端倉庫，但整體系統通常會搭配：

- **資料抓取與儲存服務**
- **回測引擎**
- **預測模型／量化策略服務**

整合時建議：

- 在 `src/api` 層統一封裝所有對後端的呼叫。
- 前端只關心：
  - 請求參數
  - 回傳結構
  - 錯誤處理（例如網路錯誤、API 回傳錯誤碼）
- API 回傳結構若有變更，集中修改在 `stockApi.ts` 或對應的 service 層，而非分散在各元件中。

---

## 貢獻指南（若多人協作）

若本專案未來有多人協作或開源的可能，建議遵守以下流程：

- **分支策略**
  - `main` 或 `master`：穩定可發佈版本。
  - 功能開發分支：`feature/xxx`。
  - 修 bug 分支：`fix/xxx`。

- **開發流程**
  1. 從主分支切出個人開發分支。
  2. 完成功能後執行：`npm run lint`（若有）、`npm run build` 確認無錯誤。
  3. 發送 Pull Request，並在描述中：
     - 說明修改目的與內容。
     - 附上截圖（特別是 UI／圖表相關修改）。

- **程式碼風格**
  - 優先使用函式型元件與 React Hooks。
  - 避免在元件內寫過於複雜的邏輯，應拆分到 Hook 或 utils。

---

## 常見問題 (FAQ)

### Q1. `npm run dev` 無法啟動，出現 Port 已被占用？

- 解法：
  - 修改啟動指令中的 Port，或
  - 終止目前占用該 Port 的程式。
- 也可以在 `vite.config.ts` 中調整開發伺服器的 Port 設定。

### Q2. 前端畫面載入失敗，Console 顯示 CORS 錯誤？

- 原因：
  - 後端 API 未正確設定 CORS。
- 解法：
  - 在後端（例如 FastAPI）加入 CORS 中介層設定。
  - 開發階段可允許 `http://localhost:5173` 來源。

### Q3. 圖表沒有資料或指標顯示為 NaN？

- 檢查事項：
  - 確認 API 是否正確回傳股價資料（時間序列完整且欄位正確）。
  - 確認 `stockIndicators.ts` 中計算函式輸入資料格式正確。
  - 檢查是否有資料長度不足（例如計算長期均線需要足夠資料點）。

---

## 聯絡方式與後續規劃

- 若你是專案維護者或合作開發者，可在此補充：
  - 聯絡信箱
  - 需求討論方式（Issue / 專案管理工具等）
- 後續規劃方向（建議可逐步補充）：
  - 整合更完整的基本面分析（財報、產業指標等）。
  - 加入自訂策略回測介面。
  - 加入 AI/LLM 輔助解讀技術指標與新聞事件。

---

## 總結

本專案是一個以 **專業股票投資分析** 為核心的前端平台，以 **React + TypeScript + Vite** 打造高效、模組化、易維護的程式架構，並透過多種技術指標與圖表視覺化，協助使用者更有效率地進行投資決策。  
若你準備開始開發或擴充功能，建議先從閱讀 `StockAnalysis.tsx`、`stockIndicators.ts` 與 `stockApi.ts` 入手，將能快速掌握系統的主要運作流程。
