<template>
  <MJspreadsheet ref="tableRef" :options="Options" />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { type WorksheetOptions } from 'jspreadsheet-ce';
import MJspreadsheet from "../components/MJspreadsheet.vue";

const Options = reactive<WorksheetOptions>({
  search: false,
  data: [
    {
      name:'Paulo',
      id:'3',
      age:'40',
      gender:'Male',
      make: 'Scotland'
    },
    {
      name:'Cosme Sergio',
      id:'4',
      age:'48',
      gender:'Male',
      make: ''
    },
    {
      name:'Jorgina Santos',
      id:'5',
      age:'32',
      gender:'Female',
      make: 'Wales'
    },
  ],
  columns: [
    {
      type:'text',
      width:'40',
      name:'id',
      title:'ID',
    },
    {
      type:'text',
      width:'200',
      name:'name',
      title:'Name',
    },
    {
      type:'text',
      width:'100',
      name:'age',
      title:'Age',
    },
    {
      type:'hidden',
      name:'gender'
    },
    {
      type:'dropdown',
      width:'120',
      name:'make',
      title:'Make',
      source:['England','Wales','Northern Ireland','Scotland']
    },
  ],
});
</script>

<!-- search: false,
data: [
  {
    name:'Paulo',
    id:'3',
    age:'40',
    gender:'Male',
    make: 'Scotland'
  },
  {
    name:'Cosme Sergio',
    id:'4',
    age:'48',
    gender:'Male',
    make: ''
  },
  {
    name:'Jorgina Santos',
    id:'5',
    age:'32',
    gender:'Female',
    make: 'Wales'
  },
],
columns: [
  {
    type:'text',
    width:'40',
    name:'id',
    title:'ID',
  },
  {
    type:'text',
    width:'200',
    name:'name',
    title:'Name',
  },
  {
    type:'text',
    width:'100',
    name:'age',
    title:'Age',
  },
  {
    type:'hidden',
    name:'gender'
  },
  {
    type:'dropdown',
    width:'120',
    name:'make',
    title:'Make',
    source:['England','Wales','Northern Ireland','Scotland']
  },
], -->