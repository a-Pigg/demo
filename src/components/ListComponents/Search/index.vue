<template>
  <div>
    <el-input
      :placeholder="$t('h.tips187')"
      v-model="input"
      size="small"
      prefix-icon="el-icon-search"
    >
      <div slot="prepend" class="select-box">
        <div class="text">
          <span>{{ $t("h.title53") }}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <el-select
          class="select"
          v-model="select"
          multiple
          collapse-tags
          :placeholder="$t('h.tips4')"
        >
          <el-option :label="$t('h.title54')" value="1"></el-option>
          <el-option :label="$t('h.title55')" value="2"></el-option>
          <el-option :label="$t('h.title56')" value="3"></el-option>
        </el-select>
      </div>

      <el-button type="text" slot="suffix" size="small" @click="onSearch">{{
        $t("h.Search")
      }}</el-button>
    </el-input>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      select: "",
      input: "",
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  computed: {
    // input: {
    //   get() {
    //     return this.value;
    //   },
    //   set(val) {
    //     this.$emit("update:value", val);
    //   },
    // },
  },
  methods: {
    onSearch() {
      this.$emit("search");
    },
  },
};
</script>
<style lang="scss" scoped>
.select-box {
  position: relative;
  &:hover {
    span {
      color: #588ab9;
    }
  }
  .el-icon-arrow-down {
    margin-left: 5px;
  }
}
.select {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
::v-deep .el-input-group__prepend {
  background-color: #fff;
}
</style>
