// ===== Google Apps Script 完整程式碼 =====
// 用於 DAY6 代購團管理系統

// 設定你的試算表 ID（從網址複製）
const SPREADSHEET_ID = '1oCu8IAKVaEyi6Ufh6MSfRVWgt6q8Hi-_Yvpk4vN0XW8';

// 處理 GET 請求（讀取訂單）
function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('訂單資料');
  
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  let result = {};
  
  if (action === 'getOrders') {
    // 讀取所有訂單
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      result = { orders: [] };
    } else {
      const data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      const orders = data.map(row => JSON.parse(row[0])).filter(order => order != null);
      result = { orders: orders };
    }
  }
  
  if (action === 'importFormResponses') {
    // 從 Google 表單匯入訂單
    const formSheetId = e.parameter.formSheetId;
    result = importFromGoogleForm(formSheetId);
  }
  
  // 支援 JSONP（解決 CORS 問題）
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(result) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// 處理 POST 請求（新增/更新訂單）
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    if (data.action === 'saveOrders') {
      // 儲存所有訂單（後台使用）
      saveOrders(ss, data.orders);
      return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === 'addOrder') {
      // 新增客人訂單（填單網頁使用）
      addCustomerOrder(ss, data.order);
      return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'Unknown action'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 從 Google 表單匯入訂單
function importFromGoogleForm(formSheetId) {
  try {
    const formSs = SpreadsheetApp.openById(formSheetId);
    const formSheet = formSs.getSheets()[0]; // 取得第一個工作表（表單回覆）
    
    const lastRow = formSheet.getLastRow();
    if (lastRow < 2) {
      return { status: 'success', count: 0, message: '表單中沒有資料' };
    }
    
    // 讀取表單資料（從第2列開始，第1列是標題）
    const data = formSheet.getRange(2, 1, lastRow - 1, formSheet.getLastColumn()).getValues();
    
    // 商品對照表（根據你的表單欄位）
    const products = [
      { id: 1, name: "編織吊飾娃", krw: 18000, price: 500, variants: ["🐻", "🦊", "🐰", "🐶"] },
      { id: 2, name: "披肩毯", krw: 49000, price: 1250, variants: ["🐻", "🦊", "🐰", "🐶"] },
      { id: 3, name: "雙面包", krw: 27000, price: 720, variants: ["🐻", "🦊", "🐰", "🐶"] },
      { id: 4, name: "聖誕跳舞娃", krw: 38000, price: 980, variants: ["🐻", "🦊", "🐰", "🐶"] },
      { id: 5, name: "毛絨徽章(隨機)", krw: 7900, price: 220, variants: [] },
      { id: 6, name: "行動電源", krw: 29000, price: 800, variants: ["🐻", "🦊", "🐰", "🐶"] },
      { id: 7, name: "隨機卡包", krw: 6000, price: 180, variants: [] },
      { id: 8, name: "照片組", krw: 18000, price: 480, variants: ["🐻", "🦊", "🐰", "🐶"] },
      { id: 9, name: "明信片＋紙膠帶組", krw: 20000, price: 520, variants: [] },
      { id: 10, name: "圍巾", krw: 29000, price: 760, variants: [] },
      { id: 11, name: "連帽外套", krw: 84000, price: 2200, variants: ["M", "XL"] },
      { id: 12, name: "針織衫", krw: 58000, price: 1500, variants: [] },
      { id: 13, name: "925銀手鍊", krw: 50000, price: 1250, variants: [] },
      { id: 14, name: "雪花球磁鐵", krw: 28000, price: 750, variants: [] }
    ];
    
    // 讀取現有訂單
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dataSheet = ss.getSheetByName('訂單資料');
    const existingLastRow = dataSheet.getLastRow();
    let existingOrders = [];
    
    if (existingLastRow >= 2) {
      const existingData = dataSheet.getRange(2, 1, existingLastRow - 1, 1).getValues();
      existingOrders = existingData.map(row => JSON.parse(row[0])).filter(order => order != null);
    }
    
    let newOrdersCount = 0;
    
    // 解析每一筆表單回覆
    data.forEach(row => {
      const timestamp = row[0]; // 時間戳記
      const fbName = row[1]; // FB 名稱
      const note = row[2]; // 備註
      
      // 檢查是否已經匯入過（根據時間戳記和 FB 名稱）
      const orderId = new Date(timestamp).getTime();
      const isDuplicate = existingOrders.some(order => 
        order.id === orderId || (order.customerName === fbName && order.createdAt === new Date(timestamp).toISOString())
      );
      
      if (isDuplicate) {
        return; // 跳過已存在的訂單
      }
      
      // 解析商品選擇（從第4欄開始）
      const items = [];
      
      // 根據你的表單欄位順序解析
      // 假設表單欄位順序與 products 陣列一致
      products.forEach((product, index) => {
        const columnIndex = 3 + index; // 從第4欄開始（index 3）
        
        if (columnIndex >= row.length) return;
        
        const value = row[columnIndex];
        if (!value) return;
        
        if (product.variants.length > 0) {
          // 有變體的商品（例如：「🐻 [1]」）
          const matches = value.toString().match(/(.+?)\s*\[(\d+)\]/g);
          if (matches) {
            matches.forEach(match => {
              const parts = match.match(/(.+?)\s*\[(\d+)\]/);
              if (parts) {
                const variant = parts[1].trim();
                const quantity = parseInt(parts[2]);
                
                for (let i = 0; i < quantity; i++) {
                  items.push({
                    productId: product.id,
                    productName: product.name,
                    variant: variant,
                    quantity: 1,
                    price: product.price,
                    krw: product.krw,
                    purchased: false,
                    priority: 0
                  });
                }
              }
            });
          }
        } else {
          // 無變體的商品（直接是數量）
          const quantity = parseInt(value);
          if (quantity > 0) {
            for (let i = 0; i < quantity; i++) {
              items.push({
                productId: product.id,
                productName: product.name,
                variant: null,
                quantity: 1,
                price: product.price,
                krw: product.krw,
                purchased: false,
                priority: 0
              });
            }
          }
        }
      });
      
      if (items.length === 0) return; // 沒有選擇商品，跳過
      
      // 計算優先順序
      items.forEach(item => {
        let maxPriority = 0;
        existingOrders.forEach(order => {
          order.items.forEach(existingItem => {
            if (existingItem.productId === item.productId && existingItem.variant === item.variant) {
              if (existingItem.priority > maxPriority) {
                maxPriority = existingItem.priority;
              }
            }
          });
        });
        item.priority = maxPriority + 1;
      });
      
      // 建立訂單
      const newOrder = {
        id: orderId,
        customerName: fbName,
        customerPhone: '',
        customerContact: note || '',
        items: items,
        createdAt: new Date(timestamp).toISOString()
      };
      
      existingOrders.push(newOrder);
      newOrdersCount++;
    });
    
    // 儲存所有訂單
    if (newOrdersCount > 0) {
      saveOrders(ss, existingOrders);
    }
    
    return { status: 'success', count: newOrdersCount };
    
  } catch (error) {
    return { status: 'error', message: error.toString() };
  }
}

// 儲存訂單（後台使用）
function saveOrders(ss, orders) {
  const dataSheet = ss.getSheetByName('訂單資料');
  const listSheet = ss.getSheetByName('訂單列表');
  
  // 清空現有資料
  dataSheet.clear();
  listSheet.clear();
  
  // 寫入 JSON 資料
  dataSheet.appendRow(['訂單 JSON']);
  orders.forEach(order => {
    dataSheet.appendRow([JSON.stringify(order)]);
  });
  
  // 建立可讀表格
  listSheet.appendRow(['訂單編號', '客人名稱', '聯絡方式', '商品編號', '商品名稱', '款式', '數量', '台幣', '韓元', '已購買', '順位', '建立時間']);
  
  orders.forEach(order => {
    order.items.forEach(item => {
      listSheet.appendRow([
        order.id,
        order.customerName,
        order.customerContact || '',
        item.productId,
        item.productName,
        item.variant || '',
        item.quantity,
        item.price,
        item.krw,
        item.purchased ? '是' : '否',
        item.priority,
        order.createdAt
      ]);
    });
  });
}

// 新增客人訂單（填單網頁使用）
function addCustomerOrder(ss, newOrder) {
  const dataSheet = ss.getSheetByName('訂單資料');
  const listSheet = ss.getSheetByName('訂單列表');
  
  // 讀取現有訂單
  const lastRow = dataSheet.getLastRow();
  let orders = [];
  
  if (lastRow >= 2) {
    const data = dataSheet.getRange(2, 1, lastRow - 1, 1).getValues();
    orders = data.map(row => JSON.parse(row[0])).filter(order => order != null);
  }
  
  // 計算新訂單每個品項的優先順序
  newOrder.items.forEach(item => {
    let maxPriority = 0;
    
    // 找出同商品同款式的最大順位
    orders.forEach(order => {
      order.items.forEach(existingItem => {
        if (existingItem.productId === item.productId && existingItem.variant === item.variant) {
          if (existingItem.priority > maxPriority) {
            maxPriority = existingItem.priority;
          }
        }
      });
    });
    
    item.priority = maxPriority + 1;
  });
  
  // 加入新訂單
  orders.push(newOrder);
  
  // 重新儲存
  saveOrders(ss, orders);
}
