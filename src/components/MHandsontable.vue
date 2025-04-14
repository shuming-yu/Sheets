<template>
  <hot-table ref="hotTableComponent" :settings="mergedSettings"></hot-table>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { HotTable } from '@handsontable/vue3';
import Handsontable from 'handsontable';

type HotSettings = Handsontable.GridSettings;

// Props：允許父層傳入 settings
const props = defineProps<{
  settings?: Partial<HotSettings>
}>();

// 預設 settings（你可以根據需要調整這裡）
const defaultSettings: HotSettings = {
  // 資料與表頭設定
  data: [],
  colHeaders: true, // 顯示標題列
  rowHeaders: true, // 顯示標題行
  minRows: 10, // 預設顯示 xx 行空白欄位
  // fixedColumnsStart: 2, // 固定前 2 列
  // rowHeights: 30, // 指定行高
  // height: 400, // 設定表格高度
  // width: '100%', // 設定表格寬度

  // 欄位設定
  colWidths: 100, // 指定列寬
  columns: [],

  // 儲存格樣式設定
  cells: (_row: number, _col: number): Handsontable.CellProperties => ({} as Handsontable.CellProperties),

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

  mergeCells: true,
  // mergeCells: [
  // //   { row: 1, col: 1, rowspan: 2, colspan: 2 } // 合併單元格
  // ],
};

// 合併預設與外部傳入的 settings
const mergedSettings = computed(() => {
  return {
    ...defaultSettings,
    ...props.settings
  };
});

// HotTable 實例
const hotTableComponent = ref<InstanceType<typeof HotTable> | null>(null);

// expose 實例給父層使用（可選）
defineExpose({
  getHotInstance: () => hotTableComponent.value?.hotInstance
});
</script>
