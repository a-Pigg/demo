<!-- yxt-table.vue -->
<template>
  <div>
    <el-table :data="tableData">
      <el-table-column
        v-for="column in tableColumn"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :formatter="column.formatter"
        :show-overflow-tooltip="column.showOverflowTooltip"
      >
        <template slot-scope="scope">
          {{
            column.formatter
              ? column.formatter(scope.row, scope.column)
              : scope.row[column.prop]
          }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<!-- yxt-table.vue -->
<script>
export default {
  name: "yxtTable",
  props: {
    // apiUrl: {
    //   // 列表接口（必填）
    //   type: Function,
    //   required: true,
    // },
    tableData: {
      type: Array,
      required: true,
    },
    tableColumn: {
      // 自定义列配置
      type: Array,
      default: () => [],
    },
    otherConfig: {
      //
      type: Object,
      default: () => {
        return {
          list: "list",
        };
      },
    },
  },
  data() {
    return {
      // tableData: [],
    };
  },
  created() {
    // this.getData();
  },
  methods: {
    getData() {
      // const fun = this.apiUrl;
      // fun().then((res) => {
      //   this.tableData = res[this.otherConfig.list] || [];
      //   this.tableTotal = res.pageInfo?.total || 0;
      // });
    },
  },
};
</script>
