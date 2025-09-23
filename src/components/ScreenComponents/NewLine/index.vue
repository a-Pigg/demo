<template>
  <div class="com-echarts" ref="newLineRef"></div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
    };
  },
  props: {
    allData: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    allData() {
      this.initChart();
      this.updateCharts();
      // window.addEventListener("resize", this.screenAdapter);
      // this.screenAdapter();
    },
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.newLineRef);
      const initOption = {
        grid: {
          top: "8%",
          left: "8%",
          right: "5%",
          bottom: "15%",
        },
        tooltip: {
          show: true,
          transitionDuration: 0,
        },
        xAxis: {
          type: "category",
          splitLine: false,
          axisTick: {
            show: false,
          },
          axisLine: false,
          axisLabel: {
            margin: 15,
            textStyle: {
              color: "#fff",
            },
          },
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          axisLine: false,
          axisLabel: {
            margin: 15,
            textStyle: {
              color: "#fff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#272D3B",
            },
          },
        },
        series: [
          {
            type: "line",
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              color: "#00EFC9",
              borderColor: "rgba(255,255,255,1)",
              borderWidth: 2,
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#00D8B1",
                },
                {
                  offset: 1,
                  color: "#111828",
                },
              ]),
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    updateCharts() {
      const xAxisData = this.allData.map((item) => {
        return item.id;
      });
      const yAxisData = this.allData.map((item) => {
        return item.count;
      });
      const dataOption = {
        xAxis: {
          data: xAxisData,
        },
        series: [
          {
            data: yAxisData,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.chartInstance.resize();
    },
  },
  mounted() {
    this.initChart();
    // this.updateCharts();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
};
</script>
<style lang="scss" scoped>
.com-echarts {
  width: 100%;
  height: 100%;
}
</style>
