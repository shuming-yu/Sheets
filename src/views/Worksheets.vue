<template>
  <div>
    <div>
      <input type="button" value="Add new row" @click="addRow" />
    </div>
    <div ref="spreadsheetRef" id="app"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import jspreadsheet, {
  type WorksheetInstance,
  type WorksheetOptions
} from 'jspreadsheet-ce'
import 'jspreadsheet-ce/dist/jspreadsheet.css'

const spreadsheetRef = ref<HTMLDivElement | null>(null)
const spreadsheet = ref<WorksheetInstance[]>()

const worksheet: WorksheetOptions = {
  // allowToolbar: true,
  data: [
    ['Jazz', 'Honda', '2019-02-12', '', true, '$ 2.000,00', '#777700'],
    ['Civic', 'Honda', '2018-07-11', '', true, '$ 4.000,01', '#007777']
  ],
  columns: [
    { type: 'text', title: 'Car', width: 120 },
    { type: 'dropdown', title: 'Make', width: 250, source: ['Alfa Romeo', 'Audi', 'Bmw'] },
    { type: 'calendar', title: 'Available', width: 250 },
    { type: 'image', title: 'Photo', width: 120 },
    { type: 'checkbox', title: 'Stock', width: 80 },
    { type: 'numeric', title: 'Price', width: 100, mask: '$ #.##,00', decimal: ',' },
    { type: 'color', width: 100, render: 'square' }
  ]
}

onMounted(() => {
  if (spreadsheetRef.value) {
    spreadsheet.value = jspreadsheet(spreadsheetRef.value, {
      worksheets: [worksheet]
    })
  }
})

function addRow() {
  spreadsheet.value?.[0].insertRow()
}
</script>
