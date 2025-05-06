<!-- <i18n src="@/pages/authorize/Resources/MaintainPermission.json"></i18n> -->

<template>
  <!-- <q-page class="window-height q-pa-sm"> -->
    <q-card>
      <q-card-section>
        <div class="row q-gutter-sm">
          <q-select
            dense
            filled
            emit-value
            clearable
            class="col-4"
            :label="t('Application')"
            v-model="queryParam.application"
            :options="queryParam.applicationList"
            @update:model-value="handleQuery"
          />

          <q-select
            dense
            filled
            emit-value
            clearable
            class="col-4"
            :label="t('Culture')"
            v-model="queryParam.culture"
            :options="queryParam.cultureList"
            @update:model-value="handleQuery"
          />

          <q-btn
            push
            style="height: 32px;"
            color="secondary"
            :label="t('Download')"
            @click="downloadPermissions"
          />
          <q-btn
            push
            style="height: 32px;"
            color="dark"
            :label="t('Refresh')"
            @click="refresh"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-table
          flat
          bordered
          dense
          row-key="ID"
          selection="multiple"
          :style="{ height: $q.screen.height > 900 ? '800px' : ($q.screen.height > 700 ? '500px' : '440px') }"
          virtual-scroll
          v-model:selected="table.selected"
          :rows="table.rows"
          :columns="table.columns"
          :filter="table.filter"
          :rows-per-page-options="[0]"
        >
          <template v-slot:no-data="{ icon, message }">
            <div class="full-width row flex-left q-gutter-sm">
              <q-icon size="2em" :name="table.filter ? 'filter_b_and_w' : icon" />
              <span>{{ message }}</span>
            </div>
          </template>

          <template v-slot:top-right>
            <template class="row q-gutter-xs">
              <q-btn
                push
                color="positive"
                style="height: 32px;"
                :label="t('Edit')"
                @click="handleOpenDialog"
              />
              <q-btn
                push
                color="negative"
                style="height: 32px;"
                :label="t('Delete')"
                @click="deletePermissions"
              />
            </template>

            <q-input
              v-model="table.filter"
              :label="t('Search')"
              class="q-pl-md"
              clearable
              dense
              debounce="300"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Add / Modify -->
    <q-dialog v-model="dialogVisible" persistent @show="showDialog">
      <q-card style="max-width: 90%;">
        <q-card-section class="q-pa-none">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>{{ t("Edit") }} - {{ queryParam.application }}</q-toolbar-title>
            <q-btn v-close-popup flat round dense icon="close" />
          </q-toolbar>
        </q-card-section>

        <q-card-section class="q-pa-none" style="height: 400px;" align="center">
          <MJspreadsheet ref="spreadsheetRef" :options="Options" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn :label="t('Confirm')" @click="mergePermissions" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  <!-- </q-page> -->
</template>

<script setup lang="ts">
import  { useQuasar, type QTableProps } from "quasar";
import { ref, reactive, onMounted } from 'vue';
// import type { PermissionProps, Application, Language } from "@/types/models";
// import {
//   httpGetRequest,
//   httpPostRequest,
//   httpDownloadExcel,
//   columnFormat,
//   confirm,
//   showWarnNotify,
//   showSuccessNotify
// } from "@/utils/webUtil";
// import { setting } from "@/pages/authorize/ui/assets";
import { type WorksheetInstance, type WorksheetOptions, type CellValue } from 'jspreadsheet-ce';
import MJspreadsheet from "@/components/MJspreadsheet.vue";
import { useI18n } from "vue-i18n";
const $q = useQuasar()
const { t } = useI18n();

type Permission = {
    /**
   * identity id
   */
  ID?: number;
  /**
   * Portal Application or Subsystem Application
   */
  Application: string;
  /**
   * 節點名稱組合而成的父子階層關係, 使用"|"分隔
   */
  Type: string;
  /**
   * 節點名稱
   */
  Name: string;
  /**
   * PCode
   */
  Descr?: string;
  /**
   * tree node level: 節點階層
   */
  TargetType: "0" | "1" | "2";
  /**
   * tree node chain: 呈現節點父子階層關係, 使用"."分隔
   */
  TargetSymbol: string;
  /**
   * URL
   */
  Privilege: string;
  /**
   * 可以判斷節點是否有子階層
   */
  ConstraintDef?: "Parent" | "Child";
  PrivilegeDisplay?: string;
  /**
   * icon, 若routes.js有明確指定會優先使用指定icon
   */
  TargetDisplay?: string;
  /**
   * 建立時間
   */
  Cdt?: string;
  /**
   * 最後修改時間
   */
  Udt?: string;
  /**
   * 編輯者
   */
  EditorId?: number;
  /**
   * 依語系翻譯後的Type
   */
  TranslatedType?: string;
  /**
   * 依語系翻譯後的節點名稱
   */
  TranslatedName?: string;
  TranslatedDescr?: string;
  TranslatedPrivilegeDisplay?: string;
  /**
   * 父階層的TargetSymbol
   */
  ParentTargetSymbol?: string;
}

let queryParam = reactive({
  application: "",
  applicationList: [] as string[],
  culture: "",
  cultureList: [] as any, //{ label: string; value: string }

  permissionTypeList: [] as string[],
});
const dialogVisible = ref(false); // 控制dialog顯示

import ApplicationPermissionJson from "./ApplicationPermission.json";
import OAJson from "./OA.json";
let webPortalData = ApplicationPermissionJson as Permission[];
let oaData = OAJson as Permission[];
const table = reactive<QTableProps>({
  filter: "",
  selected: [],
  rows: [],
  columns: [
    { name: "ID", label: "ID", field: "ID", align: "left", sortable: true },
    { name: "Application", label: "Application", field: "Application", align: "left" },
    { name: "Type", label: "Type", field: "Type", align: "left" },
    { name: "Name", label: "Name", field: "Name", align: "left", },
    { name: "Descr", label: "Descr", field: "Descr", align: "left" },
    { name: "TargetType", label: "Target Type", field: "TargetType", align: "left" },
    { name: "TargetSymbol", label: "Target Symbol", field: "TargetSymbol", align: "left" },
    { name: "Privilege", label: "Privilege", field: "Privilege", align: "left" },
    { name: "ConstraintDef", label: "Constraint Def", field: "ConstraintDef", align: "left", },
    { name: "PrivilegeDisplay", label: "Privilege Display", field: "PrivilegeDisplay", align: "left" },
    { name: "TargetDisplay", label: "Target Display", field: "TargetDisplay", align: "left" },
    // { name: "Cdt", label: "Cdt", field: "Cdt", align: "left", format: columnFormat.fullDateTime, sortable: true },
    // { name: "Udt", label: "Udt", field: "Udt", align: "left", format: columnFormat.fullDateTime, sortable: true },
    { name: "EditorId", label: "Editor Id", field: "EditorId", align: "left" },
    { name: "TranslatedType", label: "Translated Type", field: "TranslatedType", align: "left" },
    { name: "TranslatedName", label: "Translated Name", field: "TranslatedName", align: "left" },
    { name: "TranslatedDescr", label: "Translated Descr", field: "TranslatedDescr", align: "left" },
    { name: "TranslatedPrivilegeDisplay", label: "Translated Privilege Display", field: "TranslatedPrivilegeDisplay", align: "left" },
    { name: "ParentTargetSymbol", label: "Parent Target Symbol", field: "ParentTargetSymbol", align: "left" },
  ],
});

const spreadsheetRef = ref<{
  sheet: WorksheetInstance | null;
  getAllData: () => Record<string, any>[];
} | null>(null);

const Options = reactive<WorksheetOptions>({
  minSpareRows: 100,
  data: [],
  columns: [],
});

onMounted(async () => {
  // 同時等待所有請求完成
  // const [applications, langs, types] = await Promise.all([
  //   /** 根據登入者取得擁有的應用程式 */
  //   // GetOwnApplications / GetAllApplications
  //   httpGetRequest<Application[]>("/RBPC/GetOwnApplications", setting),
  //   /** 系統支援語系 */
  //   httpGetRequest<Language[]>("/RBPC/GetAllLanaguges", setting),
  //   /** get portal application permission types */
  //   httpGetRequest<string[]>("/RBPCUser/GetPortalPermissionTypes", setting),
  // ]);

  // 填入資料
  // queryParam.applicationList = applications.map(item => item.Name);
  queryParam.applicationList = ['Office_Seat', 'WebPortal'];
  // queryParam.cultureList = langs.map(item => ({
  //   label: `${item.Culture}(${item.Name})`,
  //   value: item.Culture
  // }));
  queryParam.cultureList = ['zh-TW', 'zh-CN', 'English'];
  // queryParam.permissionTypeList = types;
  queryParam.permissionTypeList = ['Authenticate', 'Permission', 'Identity'];
});

/**
 * 查詢未翻譯的菜單
 * @param application
 */
function getApplicationPermission() {
  let url = "/RBPCUser/GetApplicationPermission?application=" + queryParam.application;
  // httpGetRequest<PermissionProps[]>(url, setting).then((res) => {
  //   table.rows = res;
  // });

  if(queryParam.application == 'WebPortal') {
    table.rows = webPortalData;
  }
  else {
    table.rows = oaData;
  }
}

/**
 * 查詢已翻譯的菜單
 * @param application
 * @param culture
 */
function getApplicationTranslatedPermission() {
  let searches = new URLSearchParams({
    application: queryParam.application,
    culture: queryParam.culture,
  }).toString();
  let url = `/RBPCUser/GetApplicationTranslatedPermission?${searches}`;

  // httpGetRequest<PermissionProps[]>(url, setting).then((res) => {
  //   table.rows = res;
  // });
}

/**
 * 依照選取資料調用接口
 */
function handleQuery() {
  table.selected = [];

  // if(queryParam.application && queryParam.culture) {
  //   getApplicationTranslatedPermission();
  // }
  // else {
  //   getApplicationPermission();
  // }
  getApplicationPermission();
}

/**
 * 根據 application 決定 Type 欄位的設定
 */
function updateOptionsColumns() {
  const isWebPortal = queryParam.application === "WebPortal";

  Options.columns = [
    { type: 'hidden', name: 'ID', title: 'ID', width: "60px", readOnly: true },
    { type: 'hidden', name: 'Application', title: 'Application', readOnly: true },
    isWebPortal
      ? { type: 'dropdown', name: 'Type', title: 'Type', source: queryParam.permissionTypeList }
      : { type: 'text', name: 'Type', title: 'Type', width: "250px" },
    { type: 'text', name: 'Name', title: 'Name', width: "150px" },
    { type: 'text', name: 'Descr', title: 'Descr' },
    { type: 'text', name: 'TargetType', title: 'Target Type' },
    { type: 'text', name: 'TargetSymbol', title: 'Target Symbol', width: "120px" },
    { type: 'text', name: 'Privilege', title: 'Privilege', width: "240px" },
    { type: 'text', name: 'ConstraintDef', title: 'Constraint Def' },
    { type: 'text', name: 'PrivilegeDisplay', title: 'Privilege Display', width: "150px" },
    { type: 'text', name: 'TargetDisplay', title: 'Target Display', width: "240px" },
  ];
}

/**
 * 控制選擇Application + Query才可編輯
 */
function handleOpenDialog() {
  // if(!queryParam.application) {
  //   let message = t("MsgPleaseSelect", [t("Application")]);
  //   // showWarnNotify(message);
  //   return;
  // }

  updateOptionsColumns();
  dialogVisible.value = true;
}

/**
 * setData in sheet
 */
function showDialog() {
  const sheet = spreadsheetRef.value?.sheet;
  if (!sheet) return;

  if(table.rows.length) {
    sheet.setData(table.rows as Record<string, CellValue>[]);
  }
}

/**
 * 新增/更新 Permission
 * @param permissions
 */
function mergePermissions() {
  const data = spreadsheetRef.value?.getAllData() as Permission[];

  /** 手動塞入application */
  data.forEach(item => {
    if(!item.ID) delete item.ID; //新增資料不送ID
    item.Application = queryParam.application;
  });

  let url = "/RBPCUser/MergePermissions";
  // httpPostRequest(url, data, setting).then(res => {
  //   dialogVisible.value = false;
  //   showSuccessNotify(t("Success"));
  //   handleQuery();
  // })
}

/**
 * 刪除Permission,RolePermission table by PermissionId
 * @param ids
 */
function deletePermissions() {
  let idsArr = table.selected?.map(item => item.ID);
  if(!idsArr?.length) {
    let message = t("MsgPleaseSelectItemToDelete");
    // showWarnNotify(message);
    return;
  }

  let message = t("ID") + ":" + idsArr;
  // confirm(message, () => {
  //   let url = "/RBPCUser/DeletePermissions";
  //   httpPostRequest(url, idsArr, setting).then(res => {
  //     showSuccessNotify(t("Success"));
  //     handleQuery();
  //   })
  // });
}

/**
 * 下載Permission Excel資料
 * @param application
 * @param culture
 */
function downloadPermissions() {
  if(!queryParam.application) {
    let message = t("MsgPleaseSelect", [t("Application")]);
    // showWarnNotify(message);
    return;
  }

  let searches = new URLSearchParams({
    application: queryParam.application,
    culture: queryParam.culture,
  }).toString();
  let url = `/RBPCUser/DownloadPermissions?${searches}`;
  let fileName = `${queryParam.application}-Permission.xlsx`;

  // httpDownloadExcel(url, {}, fileName);
}

/**
 * 刷新
 */
function refresh() {
  Object.assign(queryParam, {
    application: "",
    culture: ""
  })

  table.selected = [];
  table.rows = [];
}
</script>
