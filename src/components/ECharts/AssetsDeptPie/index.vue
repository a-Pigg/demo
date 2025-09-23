<template>
  <!-- 资产部门饼图 -->
  <div class="com_container">
    <div class="title">
      <img src="@/assets/images/icon-echarts-deptpie.png" alt="" />
      <!-- <span>资产部门占比(数量)</span> -->
      <span>{{ $t("h.proportionOfAssetDepartment") }} </span>
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
        // // 每5个元素显示一页
        this.totalPage =
          this.allData.length % 5 === 0
            ? this.allData.length / 5
            : this.allData.length / 5 + 1;
        this.updateCharts();
        this.startInterval();
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
            radius: ["80%", "55%"],
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
          formatter: function (params) {
            if (params) {
              let newParamsName = ""; // 最终拼接成的字符串\
              let paramsNameNumber = params.length; // 实际标签的个数
              let provideNumber = 5; // 每行能显示的字的个数
              let rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (let p = 0; p < rowNumber; p++) {
                  let tempStr = ""; // 表示每一次截取的字符串
                  let start = p * provideNumber; // 开始截取的位置
                  let end = start + provideNumber; // 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p === rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr; // 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params;
              }
              // 将最终的字符串返回
              return newParamsName;
            } else {
              return params;
            }
          },
        },
      };
      this.chartInstance.setOption(initOption);
    },
    updateCharts() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);
      const pieData = showData.map((item) => {
        return {
          name: item.id,
          value: item.count,
        };
      });
      const colorArr = ["#FAE4B0", "#CC775D", "#AFBFDB", "#6AA58C", "#A3C5B5"];
      const dataOption = {
        series: {
          data: pieData,
          color: colorArr,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.assetsBarRef.offsetWidth / 100) * 4.5;
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
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timerId);
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
