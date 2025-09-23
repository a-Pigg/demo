<template>
  <!-- 资产柱状图 -->
  <div class="com_container">
    <div class="title">
      <img src="@/assets/images/icon-echarts-bar.png" alt="" />
      <!-- <span>资产分类统计(数量)</span> -->
      <span>{{ $t("h.assetCategoryStatistics") }} </span>
    </div>
    <div
      class="com_charts"
      @mouseenter="echartsMouseenter"
      @mouseleave="startInterval"
      v-resize="screenAdapter"
      ref="assetsBarRef"
    ></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      currentPage: 1, // 当前显示的页数
      totalPage: 0, // 一共有多少页
      timerId: null, // 定时器的标识
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
        // 每5个元素显示一页
        this.totalPage =
          this.allData.length % 10 === 0
            ? this.allData.length / 10
            : this.allData.length / 10 + 1;
        this.updateCharts();
        this.startInterval();
      },
    },
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs["assetsBarRef"]);
      const initOption = {
        grid: {
          top: "0px",
          left: "98px",
          right: "24px",
          bottom: "48px",
        },
        xAxis: {
          type: "value",
          splitLine: false,
          axisLine: {
            lineStyle: {
              color: "#D8D7D7",
            },
          },
          axisLabel: {
            color: "#6B6B6B",
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: "category",
          splitLine: false, //去掉网格线
          axisLine: {
            lineStyle: {
              color: "#D8D7D7",
            },
          },
          axisLabel: {
            color: "#6B6B6B",
            formatter: function (value) {
              if (value.length > 4) {
                return `${value.slice(0, 4)}...`;
              }
              return value;
            },
          },
          axisTick: {
            show: false,
          },
        },
        tooltip: {
          trigger: "axis",
          transitionDuration: 0,
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              color: "#63D5FE",
              opacity: ".5",
            },
          },
        },
        series: [
          {
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
            itemStyle: {
              color: "#1D3F92",
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    updateCharts() {
      const start = (this.currentPage - 1) * 10;
      const end = this.currentPage * 10;
      const showData = this.allData.slice(start, end);
      const yAxisData = showData.map((item) => {
        return item.id;
      });
      const xAxisData = showData.map((item) => {
        return item.count;
      });
      const dataOption = {
        yAxis: {
          data: yAxisData,
        },
        series: [
          {
            data: xAxisData,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    startInterval() {
      if (this.timerId) clearInterval(this.timerId);
      this.timerId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateCharts();
      }, 3000);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.assetsBarRef.offsetWidth / 100) * 5;
      // 和分辨率大小相关的配置项
      const adapterOption = {
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize();
    },
    echartsMouseenter() {
      clearInterval(this.timerId);
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
  destroyed() {
    clearInterval(this.timerId);
    // 在组件销毁的时候, 需要将监听器取消掉
    window.removeEventListener("resize", this.screenAdapter);
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
