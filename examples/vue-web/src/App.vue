<template>
  <div style="padding: 10px; height: 300px">
    <SeamlessTable
      :columns="columns"
      :data="data"
      :speed="80"
      @row-click="(row, index) => console.log('点击了行：', row, index)"
    >
      <template #name="{ row }">
        <span style="color: #ffeb3b; font-style: italic">{{ row.name }}</span>
      </template>
    </SeamlessTable>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
const columns = ref([
  { key: "name", title: "姓名", align: "center", width: "150px" },
  { key: "age", title: "年龄", align: "center" },
  { key: "address", title: "地址", align: "center" },
]);

const data = ref([]);

onMounted(() => {
  setTimeout(() => {
    data.value = Array.from({ length: 30 }).map((_, index) => ({
      name: `张三-${index + 1}`,
      age: 20 + (index % 10),
      address: `北京市朝阳区幸福大街${index + 1}号`,
    }));
  }, 3 * 1000);
});
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
