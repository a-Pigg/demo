<template>
  <div
    class="com-echarts"
    ref="deptPieRef"
    @mouseenter="echartsMouseenter"
    @mouseleave="startInterval"
  ></div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      currentPage: 1, // 当前显示的页数
      timerId: null, // 定时器的标识
      // allData: [
      //   {
      //     id: "技术部xxxxxxxxxxxxx",
      //     count: 20,
      //     data: null,
      //   },
      //   {
      //     id: "技术部0000111111部",
      //     count: 12,
      //     data: null,
      //   },
      //   {
      //     id: "技术部0000111112部",
      //     count: 6,
      //     data: null,
      //   },
      //   {
      //     id: "技术部0000111113部",
      //     count: 3,
      //     data: null,
      //   },
      //   {
      //     id: "人事部xxxxxxxxxxxxxxxx",
      //     count: 7,
      //     data: null,
      //   },
      //   {
      //     id: "人事部0000111113部",
      //     count: 3,
      //     data: null,
      //   },
      //   {
      //     id: "人事部00002部",
      //     count: 18,
      //     data: null,
      //   },
      //   {
      //     id: "人事部00003部",
      //     count: 20,
      //     data: null,
      //   },
      //   {
      //     id: "人事部00004部",
      //     count: 8,
      //     data: null,
      //   },
      // ],
    };
  },
  props: {
    allData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    totalPage() {
      return this.allData.length % 5 === 0
        ? this.allData.length / 5
        : this.allData.length / 5 + 1;
    }, // 一共有多少页
  },
  watch: {
    allData() {
      // this.initChart();
      this.updateCharts();
      this.startInterval();
      // window.addEventListener("resize", this.screenAdapter);
      // this.screenAdapter();
    },
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.deptPieRef);
      const initOption = {
        tooltip: {
          trigger: "item",
          transitionDuration: 0,
        },
        series: [
          {
            type: "pie",
            radius: ["74.5%", "55%"],
            center: ["50%", "40%"],
            selectedMode: "single",
            selectedOffset: 10,
            label: {
              position: "outside",
              formatter: "{d}%",
              color: "#fff",
              fontSize: 14,
            },
            labelLine: {
              show: true,
              minTurnAngle: 180,
              length: 30,
              length2: 25,
            },
          },
        ],
        legend: {
          itemGap: 20,
          width: "80%",
          padding: [0, 30],
          textStyle: {
            width: 90,
            color: "#fff",
            overflow: "truncate",
            ellipsis: "...",
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
      const start = (this.currentPage - 1) * 6;
      const end = this.currentPage * 6;
      const showData = this.allData.slice(start, end);
      const pieData = showData.map((item) => {
        return {
          name: item.id,
          value: item.count,
        };
      });
      const colorArr = [
        "#FBCB59",
        "#FB764E",
        "#649AF9",
        "#55F9B3",
        "#51E9FB",
        "#1553F4",
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
      const titleFontSize = (this.$refs.deptPieRef.offsetWidth / 100) * 4.5;
      // 和分辨率大小相关的配置项
      const adapterOption = {
        series: [
          {
            selectedOffset: titleFontSize,
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize();
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateCharts();
      }, 3000);
    },
    echartsMouseenter() {
      clearInterval(this.timerId);
    },
  },
  mounted() {
    this.initChart();
    // this.updateCharts();
    // this.startInterval();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timerId);
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
