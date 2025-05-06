<template>
  <div class="myPrefix" ref="spreadsheetRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import jspreadsheet, {type WorksheetInstance, type WorksheetOptions} from 'jspreadsheet-ce';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import 'jsuites/dist/jsuites.css';

// 接收 props
const props = defineProps<{ options: WorksheetOptions }>();

// DOM ref
const spreadsheetRef = ref<HTMLDivElement | null>(null);
const spreadsheet = ref<WorksheetInstance | null>(null);
let mergedOptions: WorksheetOptions; // 用於 getAllData 方法


/**
 * 自動補空資料列
 * @param columns 
 * @param rowCount - 預設空白列
 */
function generateEmptyRows(columns: any[] = [], rowCount: number = 10) {
  const colCount = columns.length;
  return Array.from({ length: rowCount }, () =>
    Array(colCount).fill('')
  );
}

// 初始化表格
onMounted(() => {
  if (spreadsheetRef.value) {
    const defaultWorksheetOptions: WorksheetOptions = {
      // ✅ 基本功能
      allowComments: true, // 允許儲存格備註
      allowDeleteColumn: true, // 允許刪除欄
      allowDeleteRow: true, // 允許刪除列
      allowDeletingAllRows: false, // 是否允許刪除所有列（預設至少保留一列）
      allowInsertColumn: true, // 允許插入新欄
      allowInsertRow: true, // 允許插入新列
      allowManualInsertColumn: true, // 最後一欄按 Tab 鍵插入新欄
      allowManualInsertRow: true, // 最後一列按 Space 鍵插入新列
      allowRenameColumn: true, // 允許重新命名欄位標題

      // ✅ 表格外觀
      columnDrag: true, // 允許拖曳欄位位置
      columnResize: true, // 允許調整欄寬
      columnSorting: true, // 允許點擊欄位標題排序
      rowDrag: true, // 允許拖曳列位置
      rowResize: true, // 允許調整列高

      // ✅ 表格行為
      editable: true, // 可編輯表格
      search: false, // 啟用搜尋列（搭配 pagination 顯示分頁控制）
      filters: false, // 啟用篩選功能

      // ✅ 預設尺寸
      defaultColAlign: 'center', // 欄位對齊方式（left, center, right）
      defaultColWidth: 100, // 預設欄寬
      defaultRowHeight: undefined, // 預設列高（可不設定）

      // ✅ 多欄合併與頁面結構
      mergeCells: {}, // 預設不合併儲存格
      nestedHeaders: undefined, // 多層標題結構
      minDimensions: [0, 0], // 最小欄列數
      minSpareCols: 0, // 預設保留空白欄
      minSpareRows: 0, // 預設保留空白列
      freezeColumns: undefined, // 凍結前幾欄

      // ✅ 資料匯入匯出
      csvDelimiter: ',', // CSV 分隔符號
      csvFileName: 'jspreadsheet', // 下載檔案名稱
      csvHeaders: false, // 是否從 CSV 讀取表頭
      parseTableAutoCellType: false, // 自動判斷欄位型別
      parseTableFirstRowAsHeader: false, // 第一列為標題

      // ✅ 表格呈現
      tableOverflow: true, // 表格是否限制最大尺寸
      tableHeight: '400px', // 表格高度
      tableWidth: '800px', // 表格寬度
      textOverflow: false, // 內容是否可超出儲存格
      wordWrap: false, // 啟用文字自動換行
      selectionCopy: true, // 顯示選取區右下角複製按鈕

      // ✅ 安全與功能設定
      secureFormulas: true, // 公式自動大寫
      lazyLoading: true, // 啟用懶加載
      pagination: undefined, // 啟用分頁（數字 = 每頁幾筆）
      paginationOptions: undefined, // 可選分頁大小

      // ✅ 其他功能欄位（預設空值）
      classes: {}, // 儲存格 class 設定
      comments: {}, // 儲存格註解
      style: {}, // 儲存格樣式
      footers: undefined, // 頁尾內容
      meta: undefined, // 儲存格 meta 資訊
      rows: undefined, // 自定 row 設定
      columns: [], // 自定欄位設定
      data: [], // 表格資料（初始值）
      url: undefined, // 外部 JSON 來源網址
      csv: undefined, // 外部 CSV 來源網址
      root: undefined, // 自定 root 綁定元素（WebComponent）
      persistence: false, // 是否啟用持久化
      plugins: undefined, // 外掛設定
    };

    mergedOptions = {
      ...defaultWorksheetOptions,
      ...props.options, // 外部傳入的 options 覆蓋預設設定
    };
    // console.log("mergedOptions:", mergedOptions);

    // 若 data 是空陣列，補上空列
    if (
      Array.isArray(mergedOptions.data) &&
      mergedOptions.data.length === 0 &&
      Array.isArray(mergedOptions.columns)
    ) {
      mergedOptions.data = generateEmptyRows(mergedOptions.columns);
    }

    const instance = jspreadsheet(spreadsheetRef.value, {
      worksheets: [mergedOptions], // 必須是 Workbook API 格式
    });

    spreadsheet.value = instance[0]; // 儲存第一個（也是唯一一個）sheet
  }
});

/**
 * 取得格式化資料
 */
function getAllData(): Record<string, any>[] {
  if (!spreadsheet.value || !Array.isArray(mergedOptions.columns)) return [];

  const rawData = spreadsheet.value.getData(); // 取得二維陣列資料
  const keys = mergedOptions.columns.map(col => col.name ?? ''); // 取出欄位 name

  return rawData.map(row =>
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
          Object.fromEntries(row.map((value, index) => [keys[index], value]))
        ).filter(row => {
          // 過濾條件：至少一欄不是空字串
          return Object.values(row).some(val => val !== '');
        });
}



// 對外暴露 spreadsheet 實例（第一個 sheet）
defineExpose({
  sheet: spreadsheet,
  getAllData
});
</script>
