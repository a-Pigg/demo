<template>
  <div class="com-echarts" ref="typeBarRef"></div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      // allData: [
      //   {
      //     id: "电子产品1",
      //     count: 80,
      //     data: null,
      //   },
      //   {
      //     id: "其他信息安全设备",
      //     count: 100,
      //     data: null,
      //   },
      //   {
      //     id: "其他机械设备",
      //     count: 60,
      //     data: null,
      //   },
      //   {
      //     id: "其他输入输出设备",
      //     count: 66,
      //     data: null,
      //   },
      //   {
      //     id: "其他柜类",
      //     count: 80,
      //     data: null,
      //   },
      //   {
      //     id: "其他播出设备",
      //     count: 5,
      //     data: null,
      //   },
      //   {
      //     id: "家具、用具、装具及动植物",
      //     count: 8,
      //     data: null,
      //   },
      //   {
      //     id: "其他乘用车",
      //     count: 110,
      //     data: null,
      //   },
      //   {
      //     id: "录像机",
      //     count: 9,
      //     data: null,
      //   },
      //   {
      //     id: "其他医疗设备",
      //     count: 10,
      //     data: null,
      //   },
      //   {
      //     id: "投影仪",
      //     count: 80,
      //     data: null,
      //   },
      //   {
      //     id: "其他电影设备",
      //     count: 88,
      //     data: null,
      //   },
      //   {
      //     id: "录放音机",
      //     count: 99,
      //     data: null,
      //   },
      //   {
      //     id: "音频功率放大器设备(功放设备)",
      //     count: 120,
      //     data: null,
      //   },
      //   {
      //     id: "其他架类",
      //     count: 75,
      //     data: null,
      //   },
      //   {
      //     id: "其他家具",
      //     count: 96,
      //     data: null,
      //   },
      //   {
      //     id: "其他广播、电视、电影设备",
      //     count: 22,
      //     data: null,
      //   },
      //   {
      //     id: "安全、检查、监视、报警设备",
      //     count: 54,
      //     data: null,
      //   },
      //   {
      //     id: "图书、档案",
      //     count: 48,
      //     data: null,
      //   },
      //   {
      //     id: "通用设备",
      //     count: 77,
      //     data: null,
      //   },
      //   {
      //     id: "自行车运动设备",
      //     count: 55,
      //     data: null,
      //   },
      //   {
      //     id: "触控一体机",
      //     count: 99,
      //     data: null,
      //   },
      //   {
      //     id: "普通电视设备(电视机)",
      //     count: 12,
      //     data: null,
      //   },
      //   {
      //     id: "其他计算机",
      //     count: 38,
      //     data: null,
      //   },
      //   {
      //     id: "通用无线电通信设备",
      //     count: 37,
      //     data: null,
      //   },
      //   {
      //     id: "洗衣机",
      //     count: 36,
      //     data: null,
      //   },
      //   {
      //     id: "食品蒸煮机械",
      //     count: 56,
      //     data: null,
      //   },
      // ],
      startValue: 0, // 区域缩放的起点值
      endValue: 19, // 区域缩放的终点值
      timerId: null,
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
      this.updateChart();
      this.startInterval();
    },
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.typeBarRef);
      const initOption = {
        grid: {
          top: "8%",
          left: "8%",
          right: "5%",
          bottom: "25%",
        },
        tooltip: {
          // show: true,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            margin: 15,
            color: "#fff",
            // width: 10,
            // height: 50,
            // overflow: "truncate",
            // ellipsis: "...",
            interval: 0, // 强制显示所有轴标签
            formatter: function (value) {
              var str = value.split("");
              if (str.length > 5) {
                let str2 = [];
                for (let i = 0; i < 5; i++) {
                  str2.push(str[i]);
                }
                str2.push("...");
                return str2.join("\n");
              }
              return str.join("\n");
            },
          },
          axisLine: {
            lineStyle: {
              color: "#D8D7D7",
            },
          },
          axisTick: false,
        },
        yAxis: {
          type: "value",
          splitLine: false, //去掉网格线
          axisLine: {
            show: true,
            lineStyle: {
              color: "#D8D7D7",
            },
          },
          axisLabel: {
            color: "#fff",
          },
        },
        series: [
          {
            type: "bar",
            barWidth: "58%",
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    updateChart() {
      const colorArr = ["#00BCF6", "#006AFF"];
      const typeArr = this.allData.map((item) => {
        return item.id;
      });
      const valueArr = this.allData.map((item) => {
        return item.count;
      });
      const dataOption = {
        xAxis: {
          data: typeArr,
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: () => {
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colorArr[0],
                  },
                  {
                    offset: 1,
                    color: colorArr[1],
                  },
                ]);
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.typeBarRef.offsetWidth / 100) * 3.6;
      const adapterOption = {
        // title: {
        //   textStyle: {
        //     fontSize: titleFontSize,
        //   },
        // },
        // series: [
        //   {
        //     itemStyle: {
        //       barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
        //     },
        //   },
        // ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 19;
        }
        this.updateChart();
      }, 2000);
    },
  },
  mounted() {
    this.initChart();
    // this.updateChart();
    // this.startInterval();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timerId);
  },
};
</script>
<style lang="scss" scoped>
.com-echarts {
  width: 100%;
  height: 100%;
}
</style>
