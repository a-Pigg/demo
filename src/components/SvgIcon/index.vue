<template>
  <i v-if="iconFileName.indexOf('el-icon-') === 0" :class="iconFileName" />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="`#icon-${iconFileName}`" />
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    iconFileName: {
      type: String,
      required: true,
    },
    className: {
      type: String,
    },
  },
  computed: {
    svgClass() {
      if (this.className) return "svg-icon" + " " + this.className;
      return "svg-icon";
    },
  },
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: middle;
  fill: currentColor;
}
</style>
