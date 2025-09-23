<!-- yxt-table.vue -->
<template>
  <div class="yxt-table">
    <yxt-search
      :searchConfig="searchConfig"
      :searchModel="searchModel"
      :searchReset="searchReset"
      @search="getData(1)"
    >
      <template v-slot:searchBtn="{ searchData }">
        <!-- 其他的按钮需求通过插槽传入 -->
        <slot name="searchBtn" :searchData="searchData"></slot>
      </template>
    </yxt-search>
    <!-- 批量操作按钮，因为每个需求不同，批量操作的功能也不同，所以这里只放一个插槽，不设置默认内容，所有按钮均在父级设置 -->
    <div class="multiple-operation">
      <slot name="multiple-operation" :selectionData="selectionData"></slot>
    </div>
    <!-- 页面主表格 -->
    <el-table
      :data="tableData"
      :row-key="rowKey"
      v-loading="loading"
      @selection-change="selectionChange"
    >
      <!-- 可选框（多选） -->
      <el-table-column
        v-if="selection === 'multiple'"
        type="selection"
        align="center"
        width="55"
        :reserve-selection="rowKey ? true : false"
        :selectable="selectable"
      />
      <!-- 可选框（单选） -->
      <el-table-column
        v-else-if="selection === 'single'"
        align="center"
        width="30"
      >
        <template v-slot:default="scope">
          <el-radio
            v-model="selectionRadio"
            :label="scope.$index"
            :disabled="selectable ? !selectable(scope.row) : false"
            @change="selectionChangeSingle(scope.row)"
          >
            {{ "" }}
          </el-radio>
        </template>
      </el-table-column>
      <!-- 展开行 -->
      <el-table-column v-if="expand" type="expand">
        <template v-slot:default="scope">
          <slot name="expand" :row="scope.row" :index="scope.$index"></slot>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      >
        <template v-if="item.slot" v-slot:default="scope">
          <slot :name="item.prop" :row="scope.row" :index="scope.$index"></slot>
        </template>
        <template v-else v-slot:default="scope">
          <div v-if="item.dictCode">
            {{ scope.row[item.prop] | filterStatus(dict[item.dictCode]) }}
          </div>
          <div v-else-if="item.format">
            {{ item.format(scope.row) }}
          </div>
          <div v-else>
            {{ scope.row[item.prop] }}
          </div>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        v-if="setupConfig.width !== 0"
        :fixed="setupConfig.fixed"
        :width="setupConfig.width"
        label="操作"
      >
        <template v-slot:default="scope">
          <slot name="setup" :row="scope.row" :index="scope.$index"></slot>
          <!-- 查看 -->
          <el-button
            v-if="setupConfig.view"
            type="text"
            @click="setupEvents('view', scope.row)"
            >查看</el-button
          >
          <!-- 编辑 -->
          <el-button
            v-if="setupConfig.edit"
            type="text"
            @click="setupEvents('edit', scope.row)"
            >编辑</el-button
          >
          <!-- 删除 -->
          <el-button
            v-if="setupConfig.del"
            type="text"
            @click="setupEvents('del', scope.row)"
            >删除</el-button
          >
          <!-- 操作日志 -->
          <el-button
            v-if="setupConfig.log"
            type="text"
            @click="setupEvents('log', scope.row)"
            >操作日志</el-button
          >
        </template>
      </el-table-column>
      <!-- 空状态 -->
      <template slot="empty">
        <p>{{ emptyText }}</p>
      </template>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="pagination"
      class="pagination tablePage"
      :pager-count="5"
      :page-sizes="pageSizes || [10, 20, 50, 100]"
      :total="tableTotal || 0"
      :page-size="pageInfo.pageSize || 10"
      :current-page="pageInfo.startPage || 1"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChange"
      @current-change="pageChange"
    ></el-pagination>
  </div>
</template>

<!-- yxt-table.vue -->
<script>
import yxtSearch from "./yxt-search";
export default {
  name: "yxtTable",
  components: {
    yxtSearch,
  },
  props: {
    apiUrl: {
      // 列表接口（必填）
      type: Function,
      required: true,
    },
    tableColumn: {
      // 自定义列配置
      type: Array,
      default: () => [],
    },
    otherConfig: {
      // 其他配置
      type: Object,
      default: () => {
        return {
          list: "list", // 接口返回数据的列表字段的字段名（因为在组件里面调接口，可能不同业务不同项目组不同一个开发者返回给前端的参数名不一致，这里进行兼容）
        };
      },
    },
    dict: {
      // 全部字典
      type: [Array, Object],
      default: () => [],
    },
    selection: {
      // 是否显示可选框（多选-multiple 、单选-single ）
      type: String,
    },
    selectable: {
      // 当前行是否可选择
      type: Function,
    },
    rowKey: {
      // 表格唯一key（适用于分页多选表格，保留之前的选择，不传则为单页选择）
      type: [Number, String, Function],
      default: "",
    },
    setupConfig: {
      type: Object,
      default: () => {
        return {
          width: "auto",
        };
      },
    },
    pagination: {
      // 是否需要分页，默认需要
      type: Boolean,
      default: true,
    },
    pageSizes: {
      // 分页的下拉框选项
      type: Array,
    },
    expand: {
      // 是否展开行
      type: Boolean,
      default: false,
    },
    searchConfig: {
      // 搜索条件配置项
      type: Array,
      default() {
        return [];
      },
    },
    searchReset: {
      // 搜索条件默认值重置值
      type: Object,
    },
    emptyText: {
      type: String,
    },
  },
  filters: {
    filterStatus(value, array, code = "code", name = "name") {
      if (!value && value !== 0) {
        // 要把0摘出来，一般0都是正常的数据，所以不能只用  !value
        return "";
      }
      const find = array.find(
        (e) => e[code] === value.toString() || e[code] === +value
      ); // 字符型数值型都得匹配
      if (find) {
        return find[name];
      } else {
        // 没有匹配的就原样返回
        return value;
      }
    },
  },
  data() {
    return {
      loading: true,
      tableData: [],
      tableTotal: 0,
      pageInfo: {
        pageSize: 10,
        startPage: 1,
      },
      selectionRadio: "",
      selectionData: [],
      searchModel: this.searchReset
        ? JSON.parse(JSON.stringify(this.searchReset))
        : {},
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData(startPage) {
      if (startPage) {
        // 如果传入值，则从改值的页码数开始
        this.pageInfo.startPage = startPage;
      }
      this.loading = true;
      const fun = this.apiUrl;
      const pageInfo = {
        // 分页信息
        pageSize: this.pageInfo.pageSize,
        startPage: this.pageInfo.startPage,
      };
      let param = {
        // 其他的搜素条件
        ...this.searchModel,
      };
      if (this.pagination) {
        // 如果需要分页，则传分页信息
        param = { ...param, ...pageInfo };
      }
      fun(param).then((res) => {
        setTimeout(() => {
          this.tableData = res[this.otherConfig.list] || [];
          this.tableTotal = res.pageInfo?.total || 0;
          this.loading = false;
        }, 2000);
      });
    },

    // 多选，选择行数据change
    selectionChange(selection) {
      this.selectionData = selection;
    },

    // 单选，选择行数据change
    selectionChangeSingle(selection) {
      this.selectionData = [selection];
    },

    // 操作列方法 查看/编辑/删除/操作日志
    setupEvents(setupType, row) {
      this.$emit(setupType, row);
    },

    // 条数变化
    sizeChange(size) {
      this.pageInfo.startPage = 1;
      this.pageInfo.pageSize = size;
      this.getData();
    },

    // 页码变化
    pageChange(page) {
      this.pageInfo.startPage = page;
      this.getData();
    },
  },
};
</script>
<style scoped lang="scss">
.yxt-table {
  margin: 30px;
  .multiple-operation {
    margin-bottom: 10px;
  }
}
</style>
