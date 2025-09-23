<template>
  <div class="ds-search">
    <el-input
      v-model.trim="value"
      size="small"
      :placeholder="$t('h.keyword')"
      prefix-icon="el-icon-search"
      @input="onInput"
    >
      <el-button type="text" slot="suffix" size="small" @click="search">{{
        $t("h.Search")
      }}</el-button>
    </el-input>
  </div>
</template>
<script>
export default {
  name: "DsSearchBtn",
  data() {
    return {
      // value: "",
    };
  },
  props: {
    searchValue: {
      type: String,
    },
  },
  computed: {
    value: {
      get() {
        return this.searchValue;
      },
      set(val) {
        this.$emit("update:searchValue", val);
      },
    },
  },
  methods: {
    search() {
      this.$emit("search");
    },
    onInput(val) {
      if (val == "") {
        this.search();
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
