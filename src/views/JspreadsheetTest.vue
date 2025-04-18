<template>
  <q-btn color="primary" label="LoadDataToSheet" @click="loadDataToSheet" />
  <q-btn color="secondary" label="GetData" @click="getData" />

  <MJspreadsheet ref="spreadsheetRef" :options="Options" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { type WorksheetInstance, type WorksheetOptions, type BaseColumn } from 'jspreadsheet-ce';
import MJspreadsheet from "../components/MJspreadsheet.vue";
import ApplicationPermission from "./ApplicationPermission.json";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

type Permission = {
  ID: number;
  Application: string,
  Type: string,
  Name: string,
  Descr: string,
  TargetType: string,
  TargetSymbol: string,
  Privilege: string,
  ConstraintDef: string,
  PrivilegeDisplay: string,
  TargetDisplay: string,
  Cdt: Date | string,
  Udt: Date | string,
  EditorId: number;
  TranslatedType: string,
  TranslatedName: string,
  TranslatedDescr: string,
  TranslatedPrivilegeDisplay: string,
  ParentTargetSymbol: string
}

const spreadsheetRef = ref<{
  sheet: WorksheetInstance | null;
  getAllData: () => Record<string, any>[];
} | null>(null);

let tempAllData:Permission[] = ApplicationPermission;  //假資料
const sheetHeader:BaseColumn[] = reactive([
  { type: 'text', name: 'ID', title: t('ID'), width: "60px", mask: "#,###" },
  { type: 'text', name: 'Application', title: t('Application') },
  { type: 'text', name: 'Type', title: t('Type') },
  { type: 'text', name: 'Name', title: t('Name') },
  { type: 'text', name: 'Descr', title: t('Descr') },
  { type: 'text', name: 'TargetType', title: t('TargetType') },
  { type: 'text', name: 'TargetSymbol', title: t('TargetSymbol') },
  { type: 'text', name: 'Privilege', title: t('Privilege') },
  { type: 'text', name: 'ConstraintDef', title: t('ConstraintDef') },
  { type: 'text', name: 'PrivilegeDisplay', title: t('PrivilegeDisplay') },
  { type: 'text', name: 'TargetDisplay', title: t('TargetDisplay') },
  { type: 'text', name: 'Cdt', title: t('Cdt') },
  { type: 'text', name: 'Udt', title: t('Udt') },
  { type: 'text', name: 'EditorId', title: t('EditorId') },
  { type: 'text', name: 'TranslatedType', title: t('TranslatedType') },
  { type: 'text', name: 'TranslatedName', title: t('TranslatedName') },
  { type: 'text', name: 'TranslatedDescr', title: t('TranslatedDescr') },
  { type: 'text', name: 'TranslatedPrivilegeDisplay', title: t('TranslatedPrivilegeDisplay'), width: "120px" },
  { type: 'text', name: 'ParentTargetSymbol', title: t('ParentTargetSymbol') },
  { type: 'text', name: 'ErrorText', title: t('ErrorText'), readOnly: true ,width: "240px", wordWrap: true },
]);
const Options = reactive<WorksheetOptions>({
  // minSpareRows: 200,
  // data: [
  //   // {
  //   //   name:'Paulo',
  //   //   id:'3',
  //   //   age:'40',
  //   //   gender:'Male',
  //   //   make: 'Scotland'
  //   // },
  //   // {
  //   //   name:'Cosme Sergio',
  //   //   id:'4',
  //   //   age:'48',
  //   //   gender:'Male',
  //   //   make: ''
  //   // },
  //   // {
  //   //   name:'Jorgina Santos',
  //   //   id:'5',
  //   //   age:'32',
  //   //   gender:'Female',
  //   //   make: 'Wales'
  //   // },
  // ],
  // columns: [
  //   // {
  //   //   type:'text',
  //   //   width:'40',
  //   //   name:'id',
  //   //   title:'ID',
  //   // },
  //   // {
  //   //   type:'text',
  //   //   width:'200',
  //   //   name:'name',
  //   //   title:'Name',
  //   // },
  //   // {
  //   //   type:'text',
  //   //   width:'100',
  //   //   name:'age',
  //   //   title:'Age',
  //   // },
  //   // {
  //   //   type:'hidden',
  //   //   name:'gender'
  //   // },
  //   // {
  //   //   type:'dropdown',
  //   //   width:'120',
  //   //   name:'make',
  //   //   title:'Make',
  //   //   source:['England','Wales','Northern Ireland','Scotland']
  //   // },
  // ],

  data: [],
  columns: sheetHeader,
  freezeColumns:2,
  // tableOverflow: true,
  // tableWidth: '800px',
  // lazyLoading: true,
});

function loadDataToSheet() {
  spreadsheetRef.value?.sheet?.insertRow();
}

function getData() {
  const data = spreadsheetRef.value?.getAllData();
  console.log('formattedData:', data);
}

</script>