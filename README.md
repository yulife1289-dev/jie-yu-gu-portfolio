# 古捷宇作品集

GitHub Pages 相容的純靜態作品集。網站由 `index.html`、`styles.css`、`app.js`、`projects.json` 與 `assets/` 組成，沒有外部套件或字型依賴。Projects 採文字索引與影像預覽，案例頁為全寬編輯式長頁，Resume 為編號式設計師資料檔案。

## 本機預覽

```bash
python3 -m http.server 8000
```

開啟 `http://localhost:8000/#projects`。支援 `#projects`、`#resume` 與 `#project/<slug>` 深連結。因瀏覽器限制，請勿直接雙擊 `index.html`，否則 `projects.json` 無法載入。

## GitHub Pages

將此資料夾內容放到 repository 根目錄，在 Settings → Pages 選擇從 branch 發布。所有資產使用相對路徑，可部署在帳號首頁或 repository 子路徑。

## 圖片保護限制

網站已停用圖片右鍵選單、拖曳與 iOS 長按選單。這只能降低一般使用者直接另存圖片的便利性；公開網頁中的圖片仍可能透過瀏覽器快取、開發者工具或截圖取得。

## 發布前必改

在 `app.js` 搜尋「請替換」，填入 Email、電話與社群連結。若有正式網址，亦請在 `index.html` 補上 canonical URL 與 `og:url`。

## 更新圖片

本機 `tools/prepare_assets.py` 會從原始案場資料的人工選片索引重新輸出最佳化 JPEG。完工案只讀取 `done`，提案案只讀取效果圖／設計資料；處理只調整保守色調、尺寸與壓縮，不裁切、不改變構圖，也不修改來源資料夾。技術圖面由原始 PDF 或平面圖轉成網頁預覽，並在案例頁明確標示。

首張案例圖採高優先載入，其餘圖片 lazy-load 並保留明確寬高。圖片的右鍵、拖曳與長按防護僅是下載阻嚇，不構成完整的數位版權保護。
