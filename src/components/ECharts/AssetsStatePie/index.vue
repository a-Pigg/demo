<template>
  <!-- 资产状态饼图 -->
  <div class="com_container">
    <div class="title">
      <img src="@/assets/images/icon-echarts-statepie.png" alt="" />
      <!-- <span>资产状态占比(数量)</span> -->
      <span>{{ $t("h.proportionOfAssetStatus") }}</span>
    </div>
    <div class="com_charts" v-resize="screenAdapter" ref="assetsBarRef"></div>
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
        tooltip: {
          trigger: "item",
          transitionDuration: 0,
        },
        series: [
          {
            type: "pie",
            radius: "80%",
            selectedMode: "single",
            selectedOffset: 10,
            center: ["40%", "52%"],
            label: {
              show: false,
            },
          },
        ],
        legend: {
          orient: "vertical",
          top: "middle",
          right: "10px",
          icon: "rect",
          itemWidth: 14,
          itemHeigth: 14,
        },
      };
      this.chartInstance.setOption(initOption);
    },
    updateCharts() {
      const pieData = this.allData.map((item) => {
        return {
          name: item.id,
          value: item.count,
        };
      });
      const colorArr = [
        "#61917d",
        "#e6cd85",
        "#99a8c6",
        "#7cc1c1",
        "#de9e82",
        "#82c9de",
      ];
      const dataOption = {
        series: {
          data: pieData,
          color: colorArr,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.assetsBarRef.offsetWidth / 100) * 3.6;
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
      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize();
    },
    // 点击跳转
  },
  mounted() {
    this.initChart();
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
};
</script>
<style lang="scss" scoped>
.com_container {
  width: 100%;
  height: 100%;
  .title {
    display: flex;
    align-items: center;
    height: 32px;
    img {
      margin-left: 24px;
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
