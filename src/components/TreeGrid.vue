<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import { useTreeGrid } from "@/composables/useTreeGrid";

const { columns, rowData, getDataPath } = useTreeGrid();
</script>

<template>
  <div class="ag-theme-quartz table-wrapper">
    <AgGridVue
      class="table-grid"
      dom-layout="autoHeight"
      :column-defs="columns"
      :row-data="rowData"
      :tree-data="true"
      group-display-type="custom"
      :group-default-expanded="-1"
      :get-data-path="getDataPath"
      animate-rows
    />
  </div>
</template>
