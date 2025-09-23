<template>
  <div class="ds-search">
    <el-input
      v-model.trim="searchValue"
      :size="size"
      :placeholder="$t('h.keyword')"
      prefix-icon="el-icon-search"
    >
    </el-input>
  </div>
</template>
<script>
export default {
  name: "DsSearch",
  props: {
    value: {
      type: String,
    },
    size: {
      type: String,
      default: "mini",
    },
  },
  computed: {
    searchValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      },
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.ds-search {
  margin-left: 10px;
}
</style>
