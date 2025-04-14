<template>
  <div ref="spreadsheetRef"></div>
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
const spreadsheet = ref<WorksheetInstance[]>();

// 初始化表格
onMounted(() => {
  if (spreadsheetRef.value) {
    const defaultWorksheetOptions: WorksheetOptions = {
      search: true,
    };

    const mergedOptions = {
      ...defaultWorksheetOptions,
      ...props.options, // 外部傳入的 options 覆蓋預設設定
    };

    spreadsheet.value = jspreadsheet(spreadsheetRef.value, {
      worksheets: [mergedOptions]
    })
  }
});
</script>
