# DAY6 聖誕控線下周邊代購系統 🎄

完整的代購訂單管理系統，包含客人填單網頁和後台管理系統。

---

## 📦 系統功能

### 客人填單網頁（公開）
- ✅ 清楚的代購規則說明
- ✅ 必須同意規則才能送出
- ✅ 勾選式商品選擇
- ✅ 即時計算總金額和滿額卡數量
- ✅ 自動儲存到 Google Sheets

### 後台管理系統（密碼保護）
- ✅ 密碼登入保護
- ✅ **一鍵同步 Google 表單訂單**（自動綁定）
- ✅ 查看所有訂單
- ✅ 編輯訂單
- ✅ 勾選已購買狀態
- ✅ 自動計算優先順序
- ✅ 自動計算滿額卡數量
- ✅ 總覽統計（訂單數、總金額、小卡數）

---

## 🚀 快速部署（10 分鐘）

### Step 1: 準備 Google Sheets（2 分鐘）

#### 1-1. 建立訂單資料試算表

1. 到 [Google Sheets](https://sheets.google.com)
2. 新增空白試算表
3. 命名為：**DAY6代購訂單資料**
4. 建立兩個工作表：
   - `訂單資料`（儲存 JSON 格式）
   - `訂單列表`（可讀表格格式）

#### 1-2. 建立 Google 表單（選填）

如果你想用 Google 表單收單：

1. 到 [Google 表單](https://forms.google.com)
2. 新增空白表單
3. 設定問題（參考下方「Google 表單設定」）
4. 連結到試算表：**回覆** → **建立試算表**

> 📝 注意：你的試算表 ID 是 `1oCu8IAKVaEyi6Ufh6MSfRVWgt6q8Hi-_Yvpk4vN0XW8`，已經自動綁定在系統中！

---

### Step 2: 設定 Apps Script（3 分鐘）

#### 2-1. 開啟 Apps Script

1. 在「DAY6代購訂單資料」試算表中
2. 點選：**擴充功能** → **Apps Script**

#### 2-2. 貼上程式碼

1. 刪除預設的 `function myFunction() {}`
2. 複製 `apps-script-complete.js` 的完整內容
3. 貼到編輯器中
4. **試算表 ID 已經自動設定好了，不用修改！**

#### 2-3. 部署 Apps Script

1. 點「部署」→「新增部署」
2. 類型：選「**網頁應用程式**」
3. 說明：`DAY6代購API`
4. 執行身分：**我**
5. 具有存取權的使用者：**所有人**
6. 點「部署」
7. 授權存取：
   - 點自己的 Google 帳號
   - 出現警告時點「進階」
   - 點「前往專案（不安全）」
   - 點「允許」
8. **複製網頁應用程式網址**

```
https://script.google.com/macros/s/AKfycby.../exec
```

> ⚠️ 這個網址超重要！等下要用！

---

### Step 3: 修改 HTML 檔案（2 分鐘）

#### 3-1. 客人填單網頁（index.html）

下載 `客人填單網頁.html`，改名為 `index.html`

找到第 26 行左右：
```javascript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
```

改成你的 Apps Script 網址：
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

#### 3-2. 後台管理系統（admin.html）

下載 `代購團管理系統_最終版.html`，改名為 `admin.html`

找到第 917 行左右：
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvca0IWa-gN1BX1LWGmu-CqdgfqlXKpHtG1or3Fn8VJf1a4GPDOjTPOKRzvaZIl9uptA/exec';
```

改成你的 Apps Script 網址：
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/你的Apps Script網址/exec';
```

**同時修改登入密碼**（第 1745 行）：
```javascript
const CORRECT_PASSWORD = 'daigou2024'; // 改成你要的密碼
```

> 📝 注意：試算表 ID 已經自動綁定好了（第 918 行），不用修改！

---

### Step 4: 部署到 GitHub Pages（3 分鐘）

#### 4-1. 建立 Repository

1. 到 [GitHub](https://github.com)
2. 點右上角「+」→「New repository」
3. Repository name：`day6-daigou`（或任何名字）
4. 選「Public」（公開）
5. 點「Create repository」

#### 4-2. 上傳檔案

**方法 1：網頁上傳（推薦）**

1. 在 Repository 頁面點「uploading an existing file」
2. 把 `index.html` 和 `admin.html` 拖進去
3. Commit message 寫：`初始上傳`
4. 點「Commit changes」

**方法 2：Git 指令**

```bash
git clone https://github.com/你的帳號/day6-daigou.git
cd day6-daigou
# 把 index.html 和 admin.html 複製到這裡
git add .
git commit -m "初始上傳"
git push
```

#### 4-3. 啟用 GitHub Pages

1. 在 Repository 頁面點「Settings」
2. 左側選單點「Pages」
3. Source 選「Deploy from a branch」
4. Branch 選「main」，資料夾選「/ (root)」
5. 點「Save」
6. 等 1-2 分鐘，頁面會顯示網址

---

## 🎉 完成！你的網址

### 客人填單網頁（公開分享）
```
https://你的GitHub帳號.github.io/day6-daigou/
```

### 後台管理系統（自己使用）
```
https://你的GitHub帳號.github.io/day6-daigou/admin.html
```

---

## 📱 使用方式

### 給客人的分享文字

```
👋 DAY6 聖誕控線下周邊代購開團囉！

📝 填單連結：
https://你的帳號.github.io/day6-daigou/

⏰ 截止時間：12月XX日 23:59
💰 滿 ₩50,000 送 1 張滿額卡

填完請立刻私訊我的 FB 取得匯款帳號
匯款後訂單才算成立，會依順序配貨唷～

有問題歡迎私訊！
```

### 你的後台操作流程

1. **打開後台**：`https://你的帳號.github.io/day6-daigou/admin.html`
2. **輸入密碼**登入
3. 客人填單後會自動出現在後台（或點「📋 匯入表單訂單」同步）
4. 私訊客人提供匯款帳號
5. 確認匯款後開始採購
6. 採購完勾選「✓ 已購買」
7. 完成！

---

## 🔄 一鍵同步功能

### 如何使用

1. 開啟後台管理系統
2. 點選「**📋 匯入表單訂單**」按鈕
3. 確認同步
4. 完成！

### 同步機制

- ✅ 自動從綁定的 Google Sheets 讀取資料
- ✅ 自動過濾重複訂單（根據時間戳記和 FB 名稱）
- ✅ 自動計算商品優先順序
- ✅ 自動更新訂單列表

### 支援的表單格式

系統會自動解析：
- 時間戳記
- FB 名稱
- 備註
- 各商品的數量和款式

---

## 📊 Google 表單設定（選填）

如果你想用 Google 表單收單，建議的問題設定：

### Q1: FB 名稱 ⭐必填
```
類型：簡答
必填：是
```

### Q2: 備註
```
類型：段落
必填：否
說明：滿額卡順序、特殊需求等
```

### Q3-16: 商品選擇

**有變體的商品（例如編織吊飾娃）：**
```
類型：核取方塊格子
列：🐻 | 🦊 | 🐰 | 🐶
欄：1 | 2 | 3 | 4 | 5
```

**無變體的商品（例如圍巾）：**
```
類型：下拉式選單
選項：不要 | 1 | 2 | 3 | 4 | 5
```

---

## 🔧 進階設定

### 修改商品清單

在 `index.html` 和 `admin.html` 中找到：

```javascript
const products = [
    { id: 1, name: "編織吊飾娃", krw: 18000, price: 500, variants: ["🐻", "🦊", "🐰", "🐶"] },
    // ... 其他商品
];
```

修改後重新上傳到 GitHub。

### 修改密碼

在 `admin.html` 中找到：

```javascript
const CORRECT_PASSWORD = 'daigou2024';
```

改成新密碼後重新上傳。

### 修改滿額卡門檻

在兩個檔案中找到：

```javascript
const giftCards = Math.floor(totalKrw / 50000);
```

把 `50000` 改成你要的金額（韓元）。

---

## 🎯 資料結構

### Google Sheets 結構

**訂單資料工作表：**
```
| 訂單 JSON                                    |
|---------------------------------------------|
| {"id":123,"customerName":"王小明",...}       |
| {"id":456,"customerName":"李小華",...}       |
```

**訂單列表工作表：**
```
| 訂單編號 | 客人名稱 | 商品名稱 | 款式 | 數量 | 台幣 | 韓元 | 已購買 | 順位 |
|---------|---------|---------|------|------|------|------|--------|------|
| 123     | 王小明   | 編織吊飾 | 🐻   | 1    | 500  | 18000| 否     | 1    |
```

### 訂單 JSON 格式

```json
{
  "id": 1234567890,
  "customerName": "王小明",
  "customerPhone": "",
  "customerContact": "滿額卡優先順序：🐻 > 🦊",
  "items": [
    {
      "productId": 1,
      "productName": "編織吊飾娃",
      "variant": "🐻",
      "quantity": 1,
      "price": 500,
      "krw": 18000,
      "purchased": false,
      "priority": 1
    }
  ],
  "createdAt": "2024-12-10T10:30:00.000Z"
}
```

---

## ❓ 常見問題

### Q: 客人填單後我看不到？

**A: 檢查以下項目**
1. Apps Script 網址是否正確填入兩個 HTML 檔案
2. Apps Script 部署時是否選「所有人」
3. 重新整理後台頁面
4. 清除瀏覽器快取（Ctrl+Shift+R）
5. 點「📋 匯入表單訂單」手動同步

### Q: 一鍵同步失敗？

**A: 可能原因**
1. 試算表 ID 不正確（已自動綁定為 `1oCu8IAKVaEyi6Ufh6MSfRVWgt6q8Hi-_Yvpk4vN0XW8`）
2. Apps Script 沒有權限存取試算表
3. 網路連線問題
4. 試算表格式不符（檢查欄位順序）

### Q: 客人說無法送出？

**A: 檢查項目**
1. 確認客人有勾選「同意規則」
2. 確認填寫了 FB 名稱
3. 確認至少選擇一個商品
4. 檢查瀏覽器 Console 錯誤訊息（F12）

### Q: 如何修改商品？

**A: 步驟**
1. 用編輯器打開 `index.html` 和 `admin.html`
2. 找到 `const products = [...]`
3. 修改商品資訊
4. **同時更新 `apps-script-complete.js` 中的商品清單**
5. 重新部署 Apps Script
6. 重新上傳 HTML 檔案到 GitHub

### Q: 如何備份資料？

**A: 三種方式**
1. 定期下載 Google Sheets（檔案 → 下載 → Excel）
2. Google Sheets 自動有版本歷史記錄
3. 在後台可以查看所有訂單資料

### Q: 可以同時用表單和填單網頁嗎？

**A: 可以！**
- 客人可以用填單網頁直接填
- 或用 Google 表單填（你再點「匯入表單訂單」同步）
- 兩種方式的資料都會整合在一起

---

## 🔒 安全性

### 密碼保護
- 後台有密碼保護（24 小時有效期）
- 不要把後台網址和密碼分享給別人

### 資料隱私
- Google Sheets 設定為「限制」存取
- 只有你可以看到完整訂單資料
- 客人只能填單，看不到別人的訂單

### 建議
- 定期更改密碼
- 不要在公共電腦上登入後台
- 不要截圖含有客人資料的畫面

---

## 📞 技術支援

### 檔案清單
- `index.html` - 客人填單網頁
- `admin.html` - 後台管理系統
- `apps-script-complete.js` - Google Apps Script 程式碼
- `README.md` - 本說明文件

### 相關連結
- Google Sheets: https://docs.google.com/spreadsheets/d/1oCu8IAKVaEyi6Ufh6MSfRVWgt6q8Hi-_Yvpk4vN0XW8
- GitHub Repository: https://github.com/你的帳號/day6-daigou

### 技術架構
```
客人填單 (index.html)
        ↓
Apps Script API
        ↓
Google Sheets (訂單資料)
        ↓
後台管理 (admin.html)
```

---

## ✨ 功能特色

### 🎯 客人端
- 清楚的規則說明
- 必須同意才能送出
- 即時計算總金額
- 自動顯示滿額卡數量
- 手機友善設計

### 💼 管理端
- 密碼保護
- **一鍵同步（自動綁定試算表）**
- 查看所有訂單
- 編輯訂單內容
- 標記已購買
- 自動計算優先順序
- 總覽統計

### 🔄 自動化
- 自動儲存到 Google Sheets
- 自動計算優先順序
- 自動計算滿額卡
- 自動過濾重複訂單
- 支援 Google 表單匯入

---

## 📝 更新日誌

### v2.0 (2024-12-10)
- ✅ 新增一鍵同步功能
- ✅ 自動綁定試算表 ID
- ✅ 優化 Google 表單匯入
- ✅ 自動過濾重複訂單
- ✅ 改進錯誤提示

### v1.0 (2024-12-09)
- ✅ 初始版本
- ✅ 客人填單網頁
- ✅ 後台管理系統
- ✅ Google Sheets 整合

---

## 🎉 祝你代購順利！

有任何問題都可以參考本文件或檢查各檔案的註解說明。

預祝 DAY6 聖誕控代購大成功！🎄✨
