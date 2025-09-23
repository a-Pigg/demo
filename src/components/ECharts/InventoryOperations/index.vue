<template>
  <div class="com_container">
    <div class="echarts" ref="inventoryOperations"></div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    title: { type: Array, default: () => [] },
    showData: { type: Array, default: () => [] },
  },
  data() {
    return {
      rightFontCon: 1,
      chartInstance: null,
    };
  },
  watch: {
    showData: function () {
      this.initECharts();
    },
  },
  methods: {
    initECharts() {
      this.chartInstance = this.$echarts.init(
        this.$refs["inventoryOperations"]
      );
      let source = [];
      let product = ["product"];
      this.title.forEach((item) => {
        product.push(item);
      });
      source.push(product);
      this.showData.forEach((item) => {
        let arr = [];
        arr.push(item.name);
        arr.push(item.in);
        arr.push(item.out);
        source.push(arr);
      });
      let option = {
        legend: {},
        tooltip: {},
        dataset: {
          source,
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: [{ type: "bar" }, { type: "bar" }],
      };
      this.chartInstance.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.com_container {
  height: 100%;
  .echarts {
    height: 100%;
  }
}
</style>
