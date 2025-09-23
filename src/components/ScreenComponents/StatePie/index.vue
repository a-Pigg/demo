<template>
  <div class="com-echarts" ref="statePieRef"></div>
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
      this.updateCharts();
    },
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.statePieRef);
      const initOption = {
        tooltip: {
          trigger: "item",
          transitionDuration: 0,
        },
        series: [
          {
            type: "pie",
            radius: "74.5%",
            selectedMode: "single",
            selectedOffset: 10,
            center: ["50%", "40%"],
            label: {
              formatter: "{d}%",
              color: "#fff",
              fontSize: 14,
            },
            labelLine: {
              minTurnAngle: 180,
              length: 10,
              length2: 10, //
            },
          },
        ],
        legend: {
          itemGap: 20,
          width: "60%",
          padding: [0, 30],
          textStyle: {
            color: "#fff",
          },
          bottom: "0px",
          icon: "rect",
          itemWidth: 14,
          itemHeigth: 14,
        },
      };
      this.chartInstance.setOption(initOption);
    },
    updateCharts() {
      const pieData = this.allData.map((e) => {
        return {
          name: e.id,
          value: e.count,
        };
      });
      const colorArr = ["#03C07E", "#FEA04F", "#00C3E2", "#1553F4", "#F8D71D"];
      const dataOption = {
        series: {
          data: pieData,
          color: colorArr,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.statePieRef.offsetWidth / 100) * 3.6;
      // 和分辨率大小相关的配置项
      const adapterOption = {
        series: [
          {
            selectedOffset: titleFontSize,
          },
        ],
        legend: {
          formatter: "{a| {name}}",
          textStyle: {
            rich: {
              a: {
                width: 60,
              },
            },
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
  mounted() {
    this.initChart();
    // this.updateCharts();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
    this.chartInstance.on("dblclick", (param) => {
      let index = param.dataIndex;
      if (index !== undefined) {
        // 调整路由
        this.$router.push({
          path: "/AssetMange/List",
          query: { state: index },
        });
      }
    });
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
