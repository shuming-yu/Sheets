<template>
  <div v-if="customSettings.columns!.length > 0">
    <MHandsontable ref="tableRef" :settings="customSettings" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import Handsontable from 'handsontable';
import MHandsontable from '@/components/MHandsontable.vue'; // 根據你的文件結構調整路徑
type HotSettings = Handsontable.GridSettings;

import axios from "axios";
import AllData from "./AllData.json";
import DateCodeRule from './DateCodeRule.json';

const tableRef = ref<InstanceType<typeof MHandsontable> | null>(null);
type ColumnType = {
  data: string;
  title: string;
  type: string;
};
type Header = {
  IsForzenColumn: boolean;
  IsNumberType: boolean;
  MergeCellValue: boolean;
  dataType: number;
  hidden: boolean;
  mergeName: string;
  name: string;
  sTitle: string;
}
type AllData = {
  GridDatas: any[];
  Header: Header[];
  ReportDate: string;
  ReportId: string;
};

const customSettings: HotSettings = reactive({
  readOnly: true,
  columns: [],
  mergeCells: [],
});


let url = "https://iec1-mes-ap.iec.inventec/SupplierWeb/Report/API/MaterialControlReport/QueryReport?processType=FA&plantCode=CP60&classCodes=&vendorCodes=&buyerCodes=&demandTypes=NOTEBOOK1&selectShortageDaysList=3%2C5&altTypes=A";
onMounted(() => {

  // axios.get(url)
  //   .then(res => {
  //     console.log(res.data);
  //     let tempAllData:AllData = res.data;
  //     //轉換 columns
  //     const gridColumns = tempAllData.Header.map((item: Header) => {
  //       return {
  //         ...item,
  //         data: item.sTitle,
  //         title: item.sTitle,
  //         type: 'text',
  //       };
  //     });
  //     customSettings.columns = gridColumns;

  //     //轉換 data
  //     const headers = tempAllData.Header.map(h => h.sTitle);
  //     const gridData = tempAllData.GridDatas.map(row => {
  //       const obj: Record<string, any> = {};
  //       row.forEach((cell: any, idx: string | number | any) => {
  //         const key = headers[idx] || `col${idx}`;
  //         obj[key] = cell;
  //       });
  //       return obj;
  //     });

  //     // //建立 mergeCells 設定
  //     const demandTypeColIndex = tempAllData.Header.findIndex(h => h.sTitle === 'DemandType');
  //     const mergeCells: { row: number; col: number; rowspan: number; colspan: number }[] = [];

  //     if (demandTypeColIndex !== -1) {
  //       let startRow = 0;
  //       while (startRow < gridData.length) {
  //         let rowspan = 1;
  //         const currentVal = gridData[startRow]['DemandType'];
  //         let i = startRow + 1;

  //         while (i < gridData.length && gridData[i]['DemandType'] === currentVal) {
  //           rowspan++;
  //           i++;
  //         }

  //         if (rowspan > 1) {
  //           mergeCells.push({
  //             row: startRow,
  //             col: demandTypeColIndex,
  //             rowspan,
  //             colspan: 1,
  //           });
  //         }

  //         startRow = i;
  //       }
  //       console.log("mergeCells:", mergeCells);
        

  //       // 確保觸發 reactivity
  //       customSettings.mergeCells = [...mergeCells];
  //     }

  //     setTimeout(() => {
  //       const hotInstance = tableRef.value?.getHotInstance();
  //       if (hotInstance) {
  //         hotInstance.loadData(gridData);
  //       }
  //     }, 1000);

  //   })

  let tempAllData:AllData = AllData;  //假資料
  //轉換 columns
  const gridColumns = tempAllData.Header.map((item: Header) => {
    return {
      ...item,
      data: item.sTitle,
      title: item.sTitle,
      type: 'text',
    };
  });
  customSettings.columns = gridColumns;

  //轉換 data
  const headers = tempAllData.Header.map(h => h.sTitle);
  const gridData = tempAllData.GridDatas.map(row => {
    const obj: Record<string, any> = {};
    row.forEach((cell: any, idx: string | number | any) => {
      const key = headers[idx] || `col${idx}`;
      obj[key] = cell;
    });
    return obj;
  });
  console.log("gridData:", gridData);

  //建立 mergeCells 設定
  const demandTypeColIndex = tempAllData.Header.findIndex(h => h.sTitle === 'DemandType');
  const mergeCells: { row: number; col: number; rowspan: number; colspan: number }[] = [];

  if (demandTypeColIndex !== -1) {
    let startRow = 0;
    while (startRow < gridData.length) {
      let rowspan = 1;
      const currentVal = gridData[startRow]['DemandType'];
      let i = startRow + 1;

      while (i < gridData.length && gridData[i]['DemandType'] === currentVal) {
        rowspan++;
        i++;
      }


      if (rowspan > 1) {
        mergeCells.push({
          row: startRow,
          col: demandTypeColIndex,
          rowspan,
          colspan: 1,
        });
      }

      startRow = i;
    }
    console.log("mergeCells:", mergeCells);

    // 確保觸發 reactivity
    customSettings.mergeCells = [...mergeCells];
  }

  nextTick(() => {
    const hotInstance = tableRef.value?.getHotInstance();
    if (hotInstance) {
      hotInstance.loadData(gridData);
    }
  });

})
</script>