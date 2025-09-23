<template>
  <!-- 资产新增折线图 -->
  <div class="com_container">
    <div class="title">
      <img src="@/assets/images/icon-echarts-line.png" alt="" />
      <!-- <span>资产新增情况(数量)</span> -->
      <span>{{ $t("h.AdditionsToAssets") }} </span>
    </div>
    <!-- v-resize="screenAdapter" -->
    <div class="com_charts" ref="assetsBarRef" v-resize="screenAdapter"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
    };
  },
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    allData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  watch: {
    allData: {
      handler() {
        this.updateCharts();
      },
    },
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs["assetsBarRef"]);
      const initOption = {
        grid: {
          top: "10px",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true, // 距离是包含坐标轴上的文字
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
          axisLine: {
            lineStyle: {
              color: "#D8D7D7",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#6B6B6B",
            },
          },
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#6B6B6B",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#eee",
            },
          },
        },
        series: [
          {
            type: "line",
            symbol: "circle",
            symbolSize: 10,
            itemStyle: {
              color: "#3979F9",
              borderColor: "rgba(255,255,255,1)",
              borderWidth: 2,
            },
            lineStyle: {
              // 阴影部分
              shadowOffsetX: 0, // 折线的X偏移
              shadowOffsetY: 10, // 折线的Y偏移
              shadowBlur: 3, // 折线模糊
              shadowColor: "rgba(145, 132, 132, 1)", //折线颜色
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
      // const titleFontSize = (this.$refs.assetsBarRef.offsetWidth / 100) * 2
      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize();
    },
  },
  // 自定义指令
  directives: {
    resize: {
      // 指令的名称
      bind(el, binding) {
        window.addEventListener("resize", binding.value);
      },
      unbind(el, binding) {
        window.removeEventListener("resize", binding.value);
      },
    },
  },
  mounted() {
    this.initChart();
    this.screenAdapter();
  },
};
</script>
<style lang="scss" scoped>
.com_container {
  width: 100%;
  height: 100%;
  .title {
    display: flex;
    align-items: center;
    height: 57px;
    img {
      margin-right: 13px;
    }
    span {
      font-size: 15px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #333333;
    }
  }
  .com_charts {
    width: 100%;
    height: calc(100% - 57px);
  }
}
</style>
