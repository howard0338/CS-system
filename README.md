# don't gamble system - Equipment Scroll Simulator

一個基於網頁的裝備卷軸模擬器，讓您體驗衝捲的刺激感而不需要真正的風險！

## 🎮 功能特色

### 裝備系統
- **多種裝備**：Blackfist Cloak、VL Shoes、BWG、ROA、Spectrum Goggles、Stormcaster Gloves、Von Leon's Belt
- **自定義屬性**：可設定初始HP、Weapon Attack、Weapon Defence、Magic Defence、STR、DEX、INT、LUK、Speed
- **動態背景顏色**：根據Weapon Attack數值顯示不同顏色（藍色、紫色、金色）
- **隱藏零值屬性**：自動隱藏數值為0的屬性

### 卷軸系統
- **Chaos Scroll (CS)**：60%成功率，數值變化+5到-5
- **VL Chaos Scroll (VL CS)**：100%成功率，數值變化+2到-2
- **White Scroll (WS)**：保護升級次數，可與CS配合使用

### 視覺效果
- **成功/失敗閃爍**：螢幕中央顯示SUCCESS或FAIL
- **裝備閃光**：成功時裝備會快速閃光0.1秒
- **動態背景**：不同裝備根據Weapon Attack顯示專屬顏色

### 統計功能
- **使用統計**：追蹤CS、VL CS、WS的使用次數
- **即時更新**：每次使用卷軸後自動更新統計
- **重置功能**：可重置所有統計數據

## 🚀 使用方法

1. **選擇裝備**：從下拉選單選擇要升級的裝備
2. **設定屬性**：在左側輸入框設定初始屬性值
3. **使用卷軸**：拖拽卷軸到裝備上進行升級
4. **查看結果**：觀察屬性變化和統計數據

## 🎯 裝備顏色規則

### Blackfist Cloak
- 金色：Weapon Attack ≥ 22
- 紫色：Weapon Attack 15-21
- 藍色：Weapon Attack 8-14

### VL Shoes
- 金色：Weapon Attack ≥ 20
- 紫色：Weapon Attack 13-19
- 藍色：Weapon Attack 6-12

### Stormcaster Gloves
- 金色：Weapon Attack ≥ 23
- 紫色：Weapon Attack 16-22
- 藍色：Weapon Attack 10-15

### Von Leon's Belt
- 金色：Weapon Attack ≥ 8
- 紫色：Weapon Attack 5-7
- 藍色：Weapon Attack 3-4

## 📁 文件結構

```
CS-system/
├── index.html          # 主頁面
├── style.css           # 樣式文件
├── script.js           # 主要邏輯
├── equipment-config.js # 裝備配置
├── *.JPG              # 裝備和卷軸圖片
└── README.md          # 說明文件
```

## 🛠️ 技術特色

- **純前端實現**：使用HTML、CSS、JavaScript
- **拖拽操作**：直觀的拖拽使用卷軸
- **響應式設計**：支援不同螢幕尺寸
- **動畫效果**：流暢的視覺反饋
- **狀態管理**：完整的遊戲狀態追蹤

## 🎨 自定義功能

- **初始屬性設定**：可自由設定裝備的初始屬性
- **升級次數調整**：可設定可用的升級次數
- **裝備切換**：支援多種裝備類型
- **統計重置**：可重置使用統計

## 📝 更新日誌

- ✅ 支援多種裝備類型
- ✅ 實現自定義屬性設定
- ✅ 添加動態背景顏色系統
- ✅ 實現卷軸使用統計
- ✅ 添加成功/失敗視覺反饋
- ✅ 支援VL CS 100%成功率
- ✅ 實現裝備屬性隱藏功能

## 🌟 特色亮點

- **無風險體驗**：享受衝捲樂趣而不需要真正的風險
- **完整功能**：包含所有常見的卷軸和裝備類型
- **視覺豐富**：多種動畫效果和顏色系統
- **易於使用**：直觀的拖拽操作界面
- **統計追蹤**：詳細的使用統計和記錄

---

**享受衝捲的樂趣，但記住：這只是模擬器！** 🎮✨