<template>
  <div class="ds-filter-tag">
    <el-tag
      v-for="tag in tagsData"
      :key="tag.keyStr"
      :size="tagSize"
      effect="dark"
      closable
      @close="handleClose(tag)"
    >
      {{ tag.name }}:{{
        tag.value.length > 8 ? tag.value.substring(0, 7) + "..." : tag.value
      }}
    </el-tag>
  </div>
</template>
<script>
export default {
  name: "DsFilterTag",
  data() {
    return {
      tags: [
        { name: this.$t("h.label1"), type: "" },
        { name: this.$t("h.label2"), type: "success" },
        { name: this.$t("h.label3"), type: "info" },
        { name: this.$t("h.label4"), type: "warning" },
        { name: this.$t("h.label5"), type: "danger" },
      ],
    };
  },
  props: {
    filterTagsData: {
      type: Array,
      default: () => [],
    },
    tagSize: {
      type: String,
      default: "medium",
    },
  },
  computed: {
    tagsData: {
      get() {
        return this.filterTagsData;
      },
      set(val) {
        this.$emit("update:filterTagsData", val);
      },
    },
  },
  methods: {
    handleClose(val) {
      this.$emit("handleCloseTag", val);
    },
  },
};
</script>
<style lang="scss" scoped>
.ds-filter-tag {
  display: flex;
  align-items: center;
  flex: 1;
  .el-tag {
    margin-right: 5px;
  }
}
</style>
