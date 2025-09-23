<!-- yxt-search.vue -->
<template>
  <div class="yxt-search">
    <div
      v-for="(item, index) in searchConfig"
      :key="index"
      class="yxt-search-item"
    >
      <el-input
        v-if="item.type === 'input'"
        v-model="searchModel[item.key]"
        size="medium"
        :clearable="item.clearable || true"
        :placeholder="item.placeholder || '请输入'"
        :maxlength="item.maxlength"
      ></el-input>
      <el-select
        v-if="item.type === 'select'"
        v-model="searchModel[item.key]"
        size="medium"
        style="width: 100%"
        :clearable="item.clearable || true"
        :filterable="item.filterable || true"
        :disabled="item.disabled || false"
        :multiple="item.multiple || false"
        :allow-create="item.allowCreate"
        :placeholder="item.placeholder || '请选择'"
      >
        <el-option
          v-for="(selectItem, selectIndex) in item.selectList"
          :key="selectIndex"
          :label="selectItem[item.listLabel]"
          :value="selectItem[item.listValue]"
        ></el-option>
      </el-select>
    </div>
    <div v-if="searchConfig.length" class="yxt-search-button">
      <el-button size="medium" type="primary" @click="search">搜索</el-button>
      <el-button size="medium" type="primary" plain @click="reset"
        >重置</el-button
      >
      <!-- 其他的按钮需求通过插槽传入 -->
      <slot name="searchBtn" :searchData="searchModel"></slot>
    </div>
  </div>
</template>

<!-- yxt-search.vue -->
<script>
export default {
  name: "yxtSearch",
  props: {
    searchConfig: {
      // 搜索条件配置项
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    searchModel: {
      // 搜索条件绑定值
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
    searchReset: {
      // 搜索条件默认值重置值
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    search() {
      this.$emit("search", this.searchModel);
    },
    reset() {
      if (this.searchReset) {
        // 如果传入有默认值，则重置后为默认值
        Object.keys(this.searchModel).forEach((item) => {
          this.searchModel[item] = this.searchReset[item];
        });
      } else {
        Object.keys(this.searchModel).forEach((item) => {
          this.searchModel[item] = "";
        });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.yxt-search {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  .yxt-search-item {
    flex: 1;
    margin: 0 10px 10px 0;
    width: calc(
      (100% - 30px) / 4
    ); // 这里的30px = (分布个数4-1)*间隙1px, 可以根据实际的分布个数和间隙区调整
    min-width: calc((100% - 30px) / 4);
    max-width: calc((100% - 30px) / 4);
    &:nth-child(4n) {
      // 去除每行最后一个（第4n个）的margin-right
      margin-right: 0;
    }
  }
  .yxt-search-button {
    margin: 0 0 10px 0;
    width: 100%;
    text-align: right;
  }
}
</style>
