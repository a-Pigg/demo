<!-- index.vue -->
<template>
  <div>
    <yxt-table
      :apiUrl="yxtTableList"
      :tableColumn="tableColumn"
      :otherConfig="otherConfig"
      :dict="dict"
      selection="multiple"
      :selectable="isSelectable"
      :setupConfig="setupConfig"
      :searchConfig="searchConfig"
      :searchReset="searchReset"
      @view="view"
      @log="log"
    >
      <!-- 图标插槽 -->
      <template v-slot:icon="{ row, index }">
        <i
          :class="row.status ? 'el-icon-circle-check' : 'el-icon-circle-close'"
        ></i>
      </template>
      <!-- 批量操作按钮插槽 -->
      <template v-slot:multiple-operation="{ selectionData }">
        <el-button
          type="primary"
          size="small"
          @click="handleClick1(selectionData)"
          >批量操作1</el-button
        >
        <el-button
          type="success"
          size="small"
          @click="handleClick2(selectionData)"
          >批量操作2</el-button
        >
      </template>
      <template v-slot:searchBtn="{ searchData }">
        <el-button
          size="medium"
          type="success"
          @click="handleClickExport(searchData)"
          >导出</el-button
        >
      </template>
    </yxt-table>
    <yxt-table
      :apiUrl="yxtTableList"
      :tableColumn="tableColumn"
      :otherConfig="otherConfig"
      :dict="dict"
      selection="single"
      :selectable="isSelectable"
      :setupConfig="setupConfig2"
      :pagination="false"
      :expand="true"
      :emptyText="'没有数据的展示文字'"
    >
      <!-- 图标插槽 -->
      <template v-slot:icon="{ row, index }">
        <i
          :class="row.status ? 'el-icon-circle-check' : 'el-icon-circle-close'"
        ></i>
      </template>
      <!-- 批量操作按钮插槽 -->
      <template v-slot:multiple-operation="{ selectionData }">
        <el-button
          type="primary"
          size="small"
          @click="handleClick1(selectionData)"
          >单选操作</el-button
        >
      </template>
      <template v-slot:expand="{ row, index }">
        <div>
          <p>序号：{{ index }}</p>
          <p>内容：{{ row }}</p>
        </div>
      </template>
    </yxt-table>
  </div>
</template>

<!-- index.vue -->
<script>
import yxtTable from "./yxt-table.vue";
import { yxtTableList } from "https/yxtDemo.js";
export default {
  name: "yxtDemoTable",
  components: {
    yxtTable,
  },
  data() {
    return {
      yxtTableList,
      tableColumn: [
        { prop: "name", label: "名称" },
        { prop: "code", label: "编码" },
        { prop: "status", label: "状态", dictCode: "status" },
        { prop: "icon", label: "图标", slot: true },
        {
          prop: "phone",
          label: "电话号码",
          format: (row) => {
            return `${row.name}-${row.code}（${row.phone}）`;
          },
        },
      ],
      tableConfig: {
        stripe: "stripe",
        border: "border",
        height: "200",
        maxHeight: "200",
        showHeader: true,
      },
      otherConfig: {
        list: "tasks",
      },
      setupConfig: {
        width: 100,
        view: true,
        log: true,
      },
      setupConfig2: {
        edit: true,
        del: true,
        log: true,
      },
      dict: {
        status: [
          { code: 0, name: "打卡失败" },
          { code: 1, name: "打卡成功" },
        ],
      },
      searchConfig: [
        { type: "input", key: "name" },
        { type: "input", key: "code" },
        {
          type: "select",
          key: "status",
          selectList: [
            { code: 0, name: "打卡失败" },
            { code: 1, name: "打卡成功" },
          ],
          listLabel: "name",
          listValue: "code",
        },
      ],
      searchReset: {
        name: "张三",
        code: "",
        status: 1,
      },
    };
  },
  methods: {
    handleClick1(selectionData) {
      console.log("1", selectionData);
    },
    handleClick2(selectionData) {
      console.log("2", selectionData);
    },
    handleClickExport(data) {
      console.log(data);
    },
    isSelectable(row) {
      return row.selectable !== 0;
    },
    view(row) {
      console.log("view", row);
    },
    log(row) {
      console.log("log", row);
    },
  },
};
</script>
<style scoped lang="scss">
.el-icon-circle-check {
  font-size: 28px;
  color: #67c23a;
}
.el-icon-circle-close {
  font-size: 28px;
  color: #f00;
}
</style>
