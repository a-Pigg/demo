<template>
  <div class="table-common">
    <el-table
      ref="'publicTable'"
      border
      style="width: 100%"
      :data="tableData"
      :row-key="rowKey"
      @selection-change="handleSelectionChange"
      :height="tableHeight"
      :header-cell-style="headerCellStyle"
      :row-style="rowStyle"
    >
      <!-- 当数据为空时，如果想添加一个表达时空数据的图片，可以在这里设置，如果没有就不用管了 -->
      <template slot="empty">
        <span style="display: block; margin: 60px 0"
          ><img style="width: 60px" src="" />
          <!-- 也可以自定义 没有数据时 页面展示的文字 -->
          <p style="line-height: 25px; font-size: 13px">暂无数据（自定义哈）</p>
        </span>
      </template>
      <!-- 全选单选 -->
      <el-table-column
        v-if="configFlag.selection"
        align="center"
        width="55"
        type="selection"
      />
      <!-- 序号列 -->
      <el-table-column
        type="index"
        v-if="configFlag.index"
        :label="configFlag.indexName || '序号'"
        :width="configFlag.indexWidth || 50"
        align="center"
        :fixed="configFlag.indexFixed || 'left'"
      >
        <template slot-scope="scope">
          <!-- 每页都是从 1 开始 -->
          {{ scope.$index + 1 }}
          <!-- 第二页从 11 开始 -->
          <!-- {{ (pageValue.pageNum - 1) * 10 + (scope.$index + 1) }} -->
        </template>
      </el-table-column>
      <!-- 循环遍历表头展示数据 -->
      <el-table-column
        v-for="item in columns"
        :key="item.fieldIndex"
        :prop="item.fieldIndex"
        :label="item.label"
        :width="item.width || ''"
        :align="item.align || 'center'"
        :sortable="item.sortable"
        :fixed="item.fixed || false"
        header-align="center"
        :show-overflow-tooltip="item.showOverFlowTooltip"
      >
        <template slot="header" slot-scope="{ column }">
          {{ column.label }}
          <el-tooltip
            class="item"
            effect="dark"
            v-if="item.headertip"
            :content="item.headertip"
            placement="top-start"
          >
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <!-- 枚举值 -->
          <div v-if="item.type == 'statMap'">
            {{ statMaps(item.options)[scope.row[item.fieldIndex]] || "--" }}
          </div>
          <!-- 需提示过长信息 -->
          <div v-else-if="item.showOverFlowTooltip">
            <div class="show-tooltip">
              {{ scope.row[item.fieldIndex] || "--" }}
            </div>
          </div>
          <!-- 保留两位小数 -->
          <div v-else-if="item.type == 'tofix2'">
            {{
              scope.row[item.fieldIndex]
                ? Number(scope.row[item.fieldIndex]).toFixed(2)
                : "--"
            }}
          </div>
          <!-- 金额千分位展示，项目需求，所以暂时就加上了，主要是做个示例，大家可以参考怎么自定义列的一些方法 -->
          <div v-else-if="item.type == 'money'">
            <span>{{ getMoneyK(scope.row[item.fieldIndex]) || "--" }}</span>
          </div>
          <!-- 根据需求添加效果 返回的slot可以优化.自己来吧.可以实现操作列等 -->
          <slot
            v-else-if="item.type == undefined && item.slotname"
            :scope="scope"
            :name="item.slotname"
          />
          <!-- 最普通的情况 -->
          <div v-else>
            <span>{{ scope.row[item.fieldIndex] || "--" }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="configFlag.needPage"
      :total="pageValue.total"
      :page-count="pageValue.pageNum"
      :page-size="pageValue.pageSize"
      :page-sizes="pageSizes"
      :current-page.sync="pageValue.pageNum"
      layout="prev, pager, next, jumper,total, sizes"
      class="fr"
      style="margin-top: 12px"
      @size-change="sizeChange"
      @current-change="currentChange"
      @prev-click="prevClick"
      @next-click="nextClick"
    />
  </div>
</template>
<script>
export default {
  name: "Table",
  data() {
    return {};
  },
  props: {
    // 多选保存选中数据
    rowKey: {
      default: () => (row) => row.index,
    },
    // 为表头设计样式
    headerCellStyle: {
      default: () => {
        return { background: "#666", height: "70px", color: "pink" };
      },
    },
    // 为每一行设计样式，比如设置每行的高度等等
    rowStyle: {
      default: () => {
        return { height: "50px" };
      },
    },
    columns: {
      // 表头数据  文案和绑定值，以及需要特殊处理的slot
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array, // 后台数据
      default: () => [],
    },
    // 分页参数
    pageValue: {
      // 分页数据
      type: Object,
      default: () => {
        return {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          currentPage: 1, //当前页
        };
      },
    },
    // 每页多少条的选项
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 20, 50, 100];
      },
    },
    // 表格配置项
    configFlag: {
      // 配置  其他table配置依次添加
      type: Object,
      default: () => {
        return {
          needPage: false, // 是否需要分页
          selection: false, // 是否需要多选
          index: false, // 是否需要序号
          indexWidth: 70, //序号列宽
          btn: false, //序号添加自定义html
          // 这里不全面，可根据实际情况添加
        };
      },
    },
    tableHeight: {
      // 可以监听屏幕高度获取。
      // 高度
      type: Number,
      default: () => null,
    },
    maxHeight: {
      // 可以监听屏幕高度获取。
      // 高度
      type: Number,
      default: () => 900,
    },
  },
  computed: {},
  methods: {
    // 用于表格中字段是枚举值的列 比如性别 0 代表女 1代表男，就不需要对后台数据单独处理了
    /**
      ```
        tableconfig：
          {
            label:‘多选’,
            fieldIndex:'selections',
            type:'statMap',
            options:[{value:'1',label:'男'},{value:'0',label:'女'}]
          }
      ```
    */
    statMaps(list) {
      if (!list) return;
      let obj = {};
      list.forEach((item) => {
        obj[item.value || item.id] = item.label || item.value;
      });
      return obj;
    },
    // 金额千位展示：1,234,567,890
    getMoneyK(money) {
      if (typeof money === "number") {
        money = money.toString();
      }
      var pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(money)) {
        money = money.replace(pattern, "$1,$2");
      }
      return money;
    },
    // 清空选中
    clearSelected() {
      // 父组件通过ref调用clearSelected方法，例如 this.$refs.clearTable.clearSelected()
      this.$refs.publicTable.clearSelection();
    },
    /*
     默认选中
     需要默认选中的在组件中通过this.$refs.publicTable.selected(默认选中的数据:Array)
    */
    selected(data) {
      if (data.length > 0) {
        data.forEach((item) => {
          this.$refs.publicTable.toggleRowSelection(item, true);
        });
      }
    },
    // 设置条数
    sizeChange(size) {
      this.$emit("sizeChange", size);
    },
    // 翻页，直接跳转
    currentChange(page) {
      this.$emit("handleChange", page);
    },
    //上一页
    prevClick(val) {
      this.$emit("prevClick", val);
    },
    //下一页
    nextClick(val) {
      this.$emit("nextClick", val);
    },
    // 多选
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    // 多选
    handleSelection(val, row) {
      this.$emit("handleSelection", { val, row });
    },
    handleCellEnter(row, column, cell, event) {
      this.$emit("handleCellEnter", { row, column, cell, event });
    },
    //编辑
    handleEdit(index, row, colIndex, field) {
      this.$emit("handleEdit", { index, row, colIndex, field });
    },
    //下拉框事件
    onSelected(index, row, field) {
      this.$emit("onSelected", { index, row, field });
    },
    //按钮点击事件
    onClickBtn(index, row) {
      this.$emit("onClickBtn", { index, row });
    },
  },
};
</script>
<style lang="scss" scoped>
.show-tooltip {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
</style>
