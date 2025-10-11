<template>
  <div class="api-table">
    <n-data-table style="width: 100%" :columns="columns" :data="data" />
  </div>
</template>
<script setup>
defineOptions({
  name: 'BaseTable',
});

defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
});
</script>
<style lang="scss">
.api-table {
  width: 100%;
  margin: 10px 0;
  table {
    display: table;
    margin: 0;
    th {
      border: none;
    }
  }
  .special-column {
    background-color: #f4f4f8;
    border-radius: 3px;
    padding: 3px 6px;
  }
  .n-data-table-tr:not(.n-data-table-tr--summary):hover {
    background-color: transparent;
    > .n-data-table-td {
      background-color: transparent;
    }
  }
}
</style>
