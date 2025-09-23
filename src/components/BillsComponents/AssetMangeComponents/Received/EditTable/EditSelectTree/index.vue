<template>
  <el-select
    v-model="treeValue"
    size="mini"
    :placeholder="$t('h.tips4')"
    clearable
    filterable
    :filter-method="selectFilter"
    @clear="clearSelectValue"
    @focus="focusSelect"
  >
    <el-option hidden value="x" label="x" key="x"></el-option>
    <el-option
      hidden
      v-for="item in options"
      :key="item[defaultProps['value']]"
      :label="item[defaultProps['label']]"
      :value="item[defaultProps['value']]"
    >
    </el-option>
    <el-tree
      ref="treeRef"
      highlight-current
      :data="data"
      :props="defaultProps"
      :node-key="nodeKey"
      :filter-node-method="treeFilterNode"
      @node-click="handleNodeClick"
    >
      <template slot-scope="{ node, data }">
        <span class="tree-text">{{ data.code + "-" + node.label }}</span>
      </template>
    </el-tree>
  </el-select>
</template>
<script>
export default {
  data() {
    return {
      options: [],
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    data: {
      type: Array,
      default: () => [],
    },
    defaultProps: {
      type: Object,
      default: () => {},
    },
    nodeKey: {
      type: String,
      default: "_id",
    },
  },
  computed: {
    treeValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      },
    },
  },
  methods: {
    handleNodeClick(data) {
      this.options = [data];
      this.treeValue = data[this.defaultProps.value];
      this.$emit("input", data[this.defaultProps.value]);
      this.$refs.treeRef.setCurrentKey(data[this.defaultProps.value]);
    },
    treeFilterNode(val, data) {
      if (!val) return true;
      return data[this.defaultProps.label].indexOf(val) !== -1;
    },
    selectFilter(val) {
      this.$refs.treeRef.filter(val);
    },
    clearSelectValue() {
      this.treeValue = "";
      this.options = [];
      this.$refs.treeRef.setCurrentKey(null);
      this.$emit("input", "");
    },
    focusSelect() {
      this.$refs.treeRef.filter("");
    },
  },
};
</script>
<style lang="scss" scoped>
.tree-text {
  font-size: 14px;
}
</style>
