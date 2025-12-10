// ===== DAY6 代購團 Apps Script =====
// 試算表 ID（已綁定）
const SPREADSHEET_ID = '1oCu8IAKVaEyi6Ufh6MSfRVWgt6q8Hi-_Yvpk4vN0XW8';

// 處理 GET 請求
function doGet(e) {
  try {
    const action = e.parameter.action;
    const callback = e.parameter.callback;
    
    Logger.log('收到請求：' + action);
    
    let result = {};
    
    if (action === 'getOrders') {
      result = getOrders();
    } else if (action === 'importFormResponses') {
      const formSheetId = e.parameter.formSheetId;
      Logger.log('匯入表單：' + formSheetId);
      result = importFromGoogleForm(formSheetId);
    } else {
      result = { status: 'error', message: '未知的 action: ' + action };
    }
    
    // 支援 JSONP
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(result) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('錯誤：' + error.toString());
    const errorResult = { status: 'error', message: error.toString() };
    
    if (e.parameter.callback) {
      return ContentService
        .createTextOutput(e.parameter.callback + '(' + JSON.stringify(errorResult) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 處理 POST 請求
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    if (data.action === 'saveOrders') {
      saveOrders(ss, data.orders);
      return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === 'addOrder') {
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

// 讀取訂單
function getOrders() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('訂單資料');
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return { orders: [] };
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    const orders = data.map(row => {
      try {
        return JSON.parse(row[0]);
      } catch (e) {
        return null;
      }
    }).filter(order => order != null);
    
    return { orders: orders };
  } catch (error) {
    return { orders: [], error: error.toString() };
  }
}

// 從 Google 表單匯入（簡化版 - 直接從「表單回覆1」工作表讀取）
function importFromGoogleForm(formSheetId) {
  try {
    Logger.log('開始匯入，試算表 ID：' + formSheetId);
    
    // 打開表單回覆試算表
    const formSs = SpreadsheetApp.openById(formSheetId);
    const formSheet = formSs.getSheets()[0]; // 第一個工作表
    
    Logger.log('工作表名稱：' + formSheet.getName());
    
    const lastRow = formSheet.getLastRow();
    Logger.log('總列數：' + lastRow);
    
    if (lastRow < 2) {
      return { status: 'success', count: 0, message: '表單中沒有資料' };
    }
    
    // 讀取表頭
    const headers = formSheet.getRange(1, 1, 1, formSheet.getLastColumn()).getValues()[0];
    Logger.log('表頭：' + JSON.stringify(headers));
    
    // 讀取所有資料
    const data = formSheet.getRange(2, 1, lastRow - 1, formSheet.getLastColumn()).getValues();
    Logger.log('讀取到 ' + data.length + ' 筆資料');
    
    // 商品清單
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
      existingOrders = existingData.map(row => {
        try {
          return JSON.parse(row[0]);
        } catch (e) {
          return null;
        }
      }).filter(order => order != null);
    }
    
    Logger.log('現有訂單數：' + existingOrders.length);
    
    let newOrdersCount = 0;
    
    // 處理每一筆表單回覆
    data.forEach((row, index) => {
      try {
        const timestamp = row[0];
        const fbName = row[1] || '';
        const note = row[2] || '';
        
        if (!fbName) {
          Logger.log('第 ' + (index + 2) + ' 列：沒有 FB 名稱，跳過');
          return;
        }
        
        Logger.log('處理第 ' + (index + 2) + ' 列：' + fbName);
        
        // 檢查是否重複
        const orderId = new Date(timestamp).getTime();
        const isDuplicate = existingOrders.some(order => 
          order.id === orderId || 
          (order.customerName === fbName && order.createdAt === new Date(timestamp).toISOString())
        );
        
        if (isDuplicate) {
          Logger.log('重複訂單，跳過');
          return;
        }
        
        // 解析商品（從第4欄開始，index = 3）
        const items = [];
        
        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          const colIndex = 3 + i;
          
          if (colIndex >= row.length) continue;
          
          const value = row[colIndex];
          if (!value) continue;
          
          Logger.log('商品 ' + product.name + '：' + value);
          
          // 處理有變體的商品
          if (product.variants.length > 0) {
            // 可能的格式：
            // "🐻 [2], 🦊 [1]"
            // "🐻, 🦊"
            const valueStr = value.toString();
            
            product.variants.forEach(variant => {
              // 尋找 "🐻 [2]" 這種格式
              const regex = new RegExp(variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\[(\\d+)\\]');
              const match = valueStr.match(regex);
              
              let quantity = 0;
              if (match) {
                quantity = parseInt(match[1]);
              } else if (valueStr.includes(variant)) {
                quantity = 1; // 如果只有款式沒有數量，預設1
              }
              
              if (quantity > 0) {
                Logger.log('  - ' + variant + ' x ' + quantity);
                for (let q = 0; q < quantity; q++) {
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
          } else {
            // 沒有變體的商品，直接取數量
            let quantity = 0;
            
            if (typeof value === 'number') {
              quantity = value;
            } else {
              const numMatch = value.toString().match(/\d+/);
              if (numMatch) {
                quantity = parseInt(numMatch[0]);
              }
            }
            
            if (quantity > 0) {
              Logger.log('  - 數量: ' + quantity);
              for (let q = 0; q < quantity; q++) {
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
        }
        
        if (items.length === 0) {
          Logger.log('沒有選擇商品，跳過');
          return;
        }
        
        Logger.log('共 ' + items.length + ' 個品項');
        
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
        
        // 建立新訂單
        const newOrder = {
          id: orderId,
          customerName: fbName,
          customerPhone: '',
          customerContact: note,
          items: items,
          createdAt: new Date(timestamp).toISOString()
        };
        
        existingOrders.push(newOrder);
        newOrdersCount++;
        Logger.log('新增訂單成功');
        
      } catch (rowError) {
        Logger.log('處理第 ' + (index + 2) + ' 列時發生錯誤：' + rowError.toString());
      }
    });
    
    // 儲存
    if (newOrdersCount > 0) {
      Logger.log('儲存 ' + newOrdersCount + ' 筆新訂單');
      saveOrders(ss, existingOrders);
    }
    
    return { status: 'success', count: newOrdersCount };
    
  } catch (error) {
    Logger.log('匯入失敗：' + error.toString());
    return { status: 'error', message: error.toString() };
  }
}

// 儲存訂單
function saveOrders(ss, orders) {
  const dataSheet = ss.getSheetByName('訂單資料');
  const listSheet = ss.getSheetByName('訂單列表');
  
  // 清空
  dataSheet.clear();
  listSheet.clear();
  
  // 寫入 JSON
  dataSheet.appendRow(['訂單 JSON']);
  orders.forEach(order => {
    dataSheet.appendRow([JSON.stringify(order)]);
  });
  
  // 寫入可讀表格
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

// 新增客人訂單
function addCustomerOrder(ss, newOrder) {
  const dataSheet = ss.getSheetByName('訂單資料');
  
  // 讀取現有訂單
  const lastRow = dataSheet.getLastRow();
  let orders = [];
  
  if (lastRow >= 2) {
    const data = dataSheet.getRange(2, 1, lastRow - 1, 1).getValues();
    orders = data.map(row => {
      try {
        return JSON.parse(row[0]);
      } catch (e) {
        return null;
      }
    }).filter(order => order != null);
  }
  
  // 計算優先順序
  newOrder.items.forEach(item => {
    let maxPriority = 0;
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
  
  // 儲存
  saveOrders(ss, orders);
}
