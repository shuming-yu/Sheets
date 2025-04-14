<template>
  <div id="example2">
    <hot-table ref="hotTableComponent" :settings="settings"></hot-table>

    <button @click="inputData">input data</button>
    <button @click="getData">get data</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { HotTable, HotColumn } from '@handsontable/vue3';
import Handsontable from 'handsontable';
// import { textRenderer } from 'handsontable/renderers/textRenderer';
import DateCodeRule from './DateCodeRule.json'

import dayjs from "dayjs";
const DATE = 'YYYY-MM-DD';

const settings = ref({
  // 資料與表頭設定
  data: [],
  colHeaders: true, // 顯示標題列
  rowHeaders: true, // 顯示標題行
  minRows: 10, // 預設顯示 xx 行空白欄位
  fixedColumnsStart: 2, // 固定前 2 列
  // rowHeights: 30, // 指定行高
  // height: 400, // 設定表格高度
  // width: '100%', // 設定表格寬度

  // 欄位設定
  colWidths: 100, // 指定列寬
  columns: [
    { data: 'ID', title: 'ID', type: 'text',indicator: true }, //type: 'numeric'
    { data: 'RuleName', title: 'RuleName', type: 'text' },
    { 
      data: 'Color',
      title: 'Color',
      type: 'dropdown',
      source: ['yellow', 'red', 'orange', 'green', 'blue', 'gray', 'black', 'white']
    },
    {
      data: 'YearRule',
      title: 'YearRule',
      renderer(instance, td, row, col, prop, value, cellProperties) {
        // if (typeof value === 'string' && value.startsWith('https')) {
        //   const link = document.createElement('a');
        //   link.href = value;
        //   link.innerText = value;
        //   link.target = '_blank'; // 在新標籤開啟連結
        //   link.style.color = 'blue'; // 設定超連結顏色
        //   link.style.textDecoration = 'underline';

        //   td.innerHTML = ''; // 清空儲存格內容
        //   td.appendChild(link);
        // }

        if(value) {
          const linkValue = `<a href="${value}" target="_BLANK">${value}</a>`;
          Handsontable.renderers.HtmlRenderer.apply(this, [instance, td, row, col, prop, linkValue, cellProperties]);
        }
      }
    },
    {
      data: 'YearLength',
      title: 'YearLength',
      type: 'numeric',
      // 四捨五入小數點後幾碼
      numericFormat: {
        pattern: {
          mantissa: 2,
        },
      }
    },
    {
      data: 'Action',
      title: 'Action',
      readOnly: true,
      renderer(instance, td, row, col, prop, value, cellProperties) {
        if(value) {
          Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
          // 清空儲存格內容
          td.innerHTML = '';
  
          // 創建按鈕
          const button = document.createElement('button');
          button.textContent = row;
          // button.className = 'myBt';
          // button.dataset.row = row;
  
          // 移除舊的點擊事件，避免重複綁定
          button.removeEventListener('click', doAction);
          button.addEventListener('click', doAction);
  
          // 添加按鈕到儲存格
          td.appendChild(button);
        }
      }
    },
    { data: 'RuleDescr', title: 'RuleDescr', type: 'text' },
    { data: 'Editor', title: 'Editor', type: 'text' },
    { data: 'Cdt', title: 'Cdt', type: 'text' },
    { data: 'ErrorText', title: 'ErrorText', type: 'text', readOnly: true, width: 250 },
    // { data: 'date', title: 'RuleName', type: 'date', dateFormat: 'YYYY-MM-DD', correctFormat: true, },
  ],

  // 儲存格樣式設定
  cells: (row, col) => {
    const cellProperties = {};
    if (col === 7 || col === 6) { // RuleDescr 欄位索引 (第 6 欄)
      cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer(instance, td, row, col, prop, value, cellProperties);
        td.style.backgroundColor = 'rgb(254, 255, 196)'; // 設定背景顏色
        // td.style.color = 'white'; // 設定文字顏色，提高可讀性
      };
    }
    return cellProperties;
  },

  // 互動功能設定
  readOnly: false, // 允許編輯
  allowInsertRow: true, // 允許新增行
  allowRemoveRow: true, // 允許刪除行
  allowInsertColumn: false, // 禁止新增列
  allowRemoveColumn: false, // 禁止刪除列
  className: 'htCenter htMiddle',
  // multiColumnSorting: true, // 啟用多列排序
  // filters: true, // 啟用篩選
  // dropdownMenu: true, // 啟用下拉選單
  // contextMenu: true, // 啟用右鍵選單

  // 表格外觀與行為
  autoWrapRow: false, // 禁止自動換行
  autoWrapCol: false, // 禁止自動換列
  // autoColumnSize: false,  // 避免自動調整欄位導致 colHeaders 消失
  stretchH: 'all', // 列寬自動填滿 none/last/all
  search: true, // 啟用搜尋功能
  persistentState: true, // 啟用本地儲存

  // 手動操作
  manualColumnMove: true, // 允許手動移動列
  manualRowMove: true, // 允許手動移動行
  manualColumnResize: true, // 允許手動調整列寬
  manualRowResize: true, // 允許手動調整行高

  // 編輯與撤銷
  undo: true, // 啟用撤銷與重做
  copyPaste: true, // 啟用複製貼上
  comments: true, // 啟用註解

  // 滾動優化
  renderAllRows: false, // 不一次渲染所有行
  viewportColumnRenderingOffset: 5, // 預載 5 列
  viewportRowRenderingOffset: 10, // 預載 10 行

  // 其他設定
  licenseKey: 'non-commercial-and-evaluation', // 非商業使用
  fillHandle: {
    autoInsertRow: true, // 允許自動填充
    direction: 'vertical' // 允許上下拖動填充
  },

  // hiddenColumns: {
  //   columns: [3], // 隱藏第四列（索引從 0 開始）
  //   indicators: true // 顯示隱藏標記
  // },
  // hiddenRows: {
  //   rows: [2], // 隱藏第三行
  //   indicators: true
  // },

  // nestedHeaders: [
  //   ['Product Info', { label: 'Payment Details', colspan: 2 }]
  // ], // 巢狀標題
  
  // customBorders: [
  //   { row: 0, col: 0, left: { width: 2, color: 'red' } }
  // ], // 自訂邊框

  // mergeCells: [
  //   { row: 1, col: 1, rowspan: 2, colspan: 2 } // 合併單元格
  // ],
});

function doAction() {
  alert(`Action Success!!!!`);
}

const hotTableComponent = ref(null);
function inputData() {
  // 直接使用 Handsontable API 加載新數據
  const hotInstance = hotTableComponent.value.hotInstance;
  if (hotInstance) {
    hotInstance.loadData(DateCodeRule);
  }
}

// 轉換為陣列物件格式
function convertTableDataToObjects(tableData) {
  // 定義對應的欄位名稱
  const headers = [
    "ID",
    "RuleName",
    "Color",
    "YearRule",
    "YearLength",
    "Action",
    "RuleDescr",
    "Editor",
    "Cdt"
  ];

  // 將每一行轉換為物件
  return tableData.map(row => {
    let obj = {};
    headers.forEach((key, index) => {
      obj[key] = row[index]; // 將欄位名稱與值對應起來
    });

    return obj;
  })
  .filter(obj => obj.ID !== null); // 過濾 ID 為 null 的物件
}

function getData() {
  const hotInstance = hotTableComponent.value.hotInstance;

  if (hotInstance) {
    const data = hotInstance.getData(); // 取得表格數據
    const formattedData = convertTableDataToObjects(data);
    console.log(formattedData);
    return formattedData;
  } else {
    console.error("Handsontable instance not found.");
    return [];
  }
}
</script>
