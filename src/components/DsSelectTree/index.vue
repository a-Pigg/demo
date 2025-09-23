<template>
  <el-select
    ref="selectRef"
    style="width: 100%"
    v-model="selectValue"
    clearable
    filterable
    :filter-method="selectFilter"
    :placeholder="placeholder"
    :disabled="disabled"
    :value-key="defaultProps['value']"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    @clear="clearSelectValue"
    @remove-tag="removeSelectTag"
    @focus="FocusSelect"
  >
    <!-- 设置一个空option 不然selectData为空下拉不显示，这样处理无需用js去处理显示和隐藏了 -->
    <el-option hidden value="x" label="x" key="x"></el-option>
    <el-option
      hidden
      v-for="(item, index) in valueData"
      :value="item[defaultProps['value']]"
      :label="item[defaultProps['label']]"
      :key="index"
    >
    </el-option>
    <el-checkbox
      v-if="multiple"
      text-color="#409EFF"
      style="margin: 0 0 0 26px"
      v-model="checkedValue"
      @change="checkboxChange"
      >{{$t("h.title52")}}</el-checkbox
    >
    <div class="line" v-if="multiple"></div>
    <el-tree
      ref="treeRef"
      highlight-current
      :node-key="defaultProps['value']"
      :data="treeData"
      :props="defaultProps"
      :show-checkbox="multiple"
      :check-strictly="checkStrictly"
      :expand-on-click-node="isLastNode"
      :filter-node-method="treeFilterNode"
      @check="clickCheckBox"
      @node-click="clickNode"
    >
      <span slot-scope="{ node, data }" class="tree-text">
        {{ data.code + "-" + node.label }}
      </span>
    </el-tree>
  </el-select>
</template>
<script>
export default {
  data() {
    return {
      selectValue: null,
      valueData: [],
      checkedValue: false,
    };
  },
  props: {
    placeholder: {
      type: String,
      default: "请选择",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    treeData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          value: "_id",
          label: "name",
          children: "children",
        };
      },
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    // 是否将tag缩起来
    collapseTags: {
      type: Boolean,
      default: false,
    },
    // 父子是否关联
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    // 是否只能选择末级节点
    isLastNode: {
      type: Boolean,
      default: false,
    },
    initData: {
      type: [Array, Number, String],
    },
    value: {
      type: [Array, Number, String],
    },
  },
  watch: {
    value: {
      handler(val) {
        if (this.multiple) {
          // 多选情况下
          this.selectValue = val;
          this.valueData = [];
          this.$nextTick(() => {
            if (val instanceof Array == false)
              this.$refs.treeRef.setCheckedKeys([]);
            else this.$refs.treeRef.setCheckedKeys(val);
            let data = this.$refs.treeRef.getCheckedNodes();
            this.valueData = data;
          });
        } else {
          // 单选情况下
          this.selectValue = val;
          this.valueData = [];
          this.$nextTick(() => {
            this.$refs.treeRef.setCurrentKey(val);
            let data = this.$refs.treeRef.getCurrentNode();
            if (data) this.valueData.push(data);
          });
        }
      },
      immediate: true,
      deep: true, //深度监听
    },
  },
  methods: {
    clearSelectValue() {
      if (this.multiple) this.selectValue = [];
      else this.selectValue = null;
      this.valueData = [];
      if (this.multiple) this.$refs.treeRef.setCheckedKeys([]);
      else this.$refs.treeRef.setCurrentKey(null);
      this.$emit("input", this.selectValue);
      this.$emit("selectTree", this.selectValue);
    },
    removeSelectTag(_id) {
      // console.log("_id",_id);
      if (!this.multiple) return false;
      if (this.checkStrictly) {
        // 关联型
        this.valueData.splice(
          this.valueData.findIndex(
            (item) => item[this.defaultProps.value] == _id
          ),
          1
        );
        this.$nextTick(() => {
          this.$refs.treeRef.setCheckedKeys(this.selectValue);
        });
      } else {
        // 不关联型
        this.valueData.splice(
          this.valueData.findIndex(
            (item) => item[this.defaultProps.value] == _id
          ),
          1
        );
        let checNodes = this.$refs.treeRef.getCheckedNodes(true, false);
        // 删除节点
        for (let i = 0; i < checNodes.length; i++) {
          if (checNodes[i][this.defaultProps.value] == _id) {
            checNodes.splice(i, 1);
            break;
          }
        }
        this.$nextTick(() => {
          this.$refs.treeRef.setCheckedNodes(checNodes);
        });
      }
      this.$emit("input", this.selectValue);
      this.$emit("selectTree", this.selectValue);
    },
    FocusSelect() {
      this.$refs.treeRef.filter("");
    },
    // 多选
    clickCheckBox(data, nodeAttr) {
      if (this.checkStrictly) {
        // console.log("父子不关联");
        // console.log("复选框被点击",data);
        // console.log("复选框被点击",nodeAttr);
        if (data.children && data.children.length != 0) {
          // console.log('有子元素>>>', data)
          const _id = data[this.defaultProps.value];
          // console.log('_id>>>----', _id)
          if (this.selectValue.indexOf(_id) != -1) {
            // console.log('包含有证明已勾选，需要去除掉')
            // console.log(_id);
            // console.log(this.selectValue);
            // console.log(nodeAttr.checkedKeys);
            this.selectValue.splice(
              this.selectValue.findIndex((item) => item == _id),
              1
            );
            this.valueData.splice(
              this.valueData.findIndex(
                (item) => item[this.defaultProps.value] == _id
              ),
              1
            );
            // console.log("改变》》》》",this.selectValue);
            // console.log("改变》》》》",this.valueData);
            this.$refs.treeRef.setCheckedKeys(this.selectValue);
          } else {
            // console.log('第一次选择')
            // console.log(this.selectValue);
            // console.log(nodeAttr.checkedKeys);
            let ids = this.lookForAllId(data.children);
            let items = this.lookForAll(data.children);
            // console.log('ids>>>>>>>>>>>>>', ids)
            // console.log(
            //   'nodeAttr.checkedNodes>>>>>>>>>>>>>',
            //   nodeAttr.checkedNodes
            // )
            this.valueData = this.dsNewSet(
              [...nodeAttr.checkedNodes, ...items],
              true
            );
            this.selectValue = this.dsNewSet(
              [...nodeAttr.checkedKeys, ...ids],
              false
            );
            // console.log(' this. this.valueData>>>>', this.valueData)
            this.$refs.treeRef.setCheckedKeys(this.selectValue);
          }
        } else {
          // console.log('没有子元素>>>', data)
          // console.log(this.selectValue);
          // console.log(nodeAttr.checkedKeys);
          this.valueData = nodeAttr.checkedNodes;
          this.selectValue = nodeAttr.checkedKeys;
          this.$refs.treeRef.setCheckedKeys(this.selectValue);
        }
      } else {
        // console.log(data,nodeAttr);
        if (nodeAttr.halfCheckedKeys.length == 0) {
          this.valueData = nodeAttr.checkedNodes;
          this.selectValue = nodeAttr.checkedKeys;
        } else {
          this.valueData = [
            ...nodeAttr.checkedNodes,
            ...nodeAttr.halfCheckedNodes,
          ];
          this.selectValue = [
            ...nodeAttr.checkedKeys,
            ...nodeAttr.halfCheckedKeys,
          ];
        }
      }
      this.$emit("input", this.selectValue);
      this.$emit("selectTree", this.selectValue);
    },
    // 单选
    clickNode(data, node, el) {
      if (this.multiple) return false;
      if (this.isLastNode) {
        if (data.children != null) return false;
        this.selectValue = data[this.defaultProps.value];
        this.valueData = [data];
        this.$refs.treeRef.setCurrentKey(data[this.defaultProps.value]);
      } else {
        this.selectValue = data[this.defaultProps.value];
        this.valueData = [data];
        this.$refs.treeRef.setCurrentKey(data[this.defaultProps.value]);
      }
      this.$emit("input", this.selectValue);
      this.$emit("selectTree", this.selectValue, data);
      this.$refs.selectRef.blur();
    },
    // 是否去除自身选中节点
    removeNode(data) {
      this.$refs.treeRef.remove(data);
    },
    lookForAllId(data = [], arr = []) {
      for (let item of data) {
        arr.push(item[this.defaultProps.value]);
        if (item.children && item.children.length)
          this.lookForAllId(item.children, arr);
      }
      return arr;
    },
    lookForAll(data = [], arr = []) {
      for (let item of data) {
        arr.push(item);
        if (item.children && item.children.length)
          this.lookForAll(item.children, arr);
      }
      return arr;
    },
    dsNewSet(arr, isJSON) {
      if (isJSON) {
        const res = new Map();
        return arr.filter(
          (arr) =>
            !res.has(arr[this.defaultProps.value]) &&
            res.set(arr[this.defaultProps.value], 1)
        );
      } else {
        // console.log('arr>>>>', arr)
        for (var i = 0; i < arr.length; i++) {
          for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) {
              arr.splice(j, 1);
            }
          }
        }
        return arr;
      }
    },
    // 搜索功能
    selectFilter(val) {
      this.$refs.treeRef.filter(val);
    },
    treeFilterNode(value, data) {
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    checkboxChange(val) {
      if (val) {
        this.valueData = this.lookForAll(this.treeData);
        this.selectValue = this.lookForAllId(this.treeData);
        this.$refs.treeRef.setCheckedKeys(this.lookForAllId(this.treeData));
      } else {
        this.$refs.treeRef.setCheckedKeys([]);
        this.selectValue = null;
        this.valueData = [];
      }
      this.$emit("input", this.selectValue);
      this.$emit("selectTree", this.selectValue);
    },
  },
};
</script>
<style lang="scss" scoped>
.line {
  position: relative;
  margin: 3px 0 3px 0;
  width: 100%;
  height: 2px;
  background-color: #ccc;
  z-index: 10;
}
.tree-text {
  font-size: 14px;
}
</style>
