<template>
  <div class="equity">
    <div class="equity-header">
      <div class="contain">
        <h2>固定资产管理系统</h2>
        <div class="btn">
          <el-button size="mini" type="primary" @click="goLogin"
            >登录</el-button
          >
        </div>
      </div>
    </div>
    <div class="equity-content">
      <div class="comparison">
        <div class="decorate"></div>
        <el-table
          :data="funcEquityTableData"
          :span-method="objectSpanMethod"
          :header-cell-style="handerMethod"
          header-cell-class-name="headerCell"
          border
          style="width: 100%"
        >
          <el-table-column label="版本功能权限对比" align="center">
            <el-table-column prop="funcPermission" width="80px">
            </el-table-column>
            <el-table-column prop="funcEquity" align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column prop="tryVersion" label="试用版" align="center">
          </el-table-column>
          <el-table-column
            prop="experienceVersion"
            label="体验版"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="baseVersion" label="基础版" align="center">
          </el-table-column>
        </el-table>
      </div>
      <div class="cost">
        <div class="decorate"></div>
        <el-table
          :data="costEquityTableData"
          :header-cell-style="handerMethod"
          header-cell-class-name="headerCell"
          border
          style="width: 100%"
        >
          <el-table-column prop="cost" label="版本收费标准" align="center">
          </el-table-column>
          <el-table-column prop="onLine" label="线上" align="center">
          </el-table-column>
          <el-table-column prop="local" label="线下" align="center">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      funcEquityTableData: [
        {
          funcPermission: "功能权限",
          funcEquity: "预警功能",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "资产设置",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "资产入库",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "资产列表",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "资产领用",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "资产退库",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "借用/归还",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "资产转移",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "资产维修",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "资产报废",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "资产盘点",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "分析报表",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "系统设置",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "审核管理",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "数据备份",
          tryVersion: "√",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "采购模块",
          tryVersion: "√",
          experienceVersion: "×",
          baseVersion: "×",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "耗材管理",
          tryVersion: "√",
          experienceVersion: "×",
          baseVersion: "×",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "设备管理",
          tryVersion: "√",
          experienceVersion: "×",
          baseVersion: "×",
        },
        {
          funcPermission: "功能权限",
          funcEquity: "安全门禁",
          tryVersion: "√",
          experienceVersion: "×",
          baseVersion: "×",
        },
        {
          funcPermission: "资源配置",
          funcEquity: "资产限制条数（条）",
          tryVersion: "50",
          experienceVersion: "5000",
          baseVersion: "30000",
        },
        {
          funcPermission: "资源配置",
          funcEquity: "图片大小限制（kb）",
          tryVersion: "256",
          experienceVersion: "256",
          baseVersion: "2048",
        },
        {
          funcPermission: "资源配置",
          funcEquity: "数据备份权限",
          tryVersion: "×",
          experienceVersion: "√",
          baseVersion: "√",
        },
        {
          funcPermission: "资源配置",
          funcEquity: "员工账号数量（个）",
          tryVersion: "5",
          experienceVersion: "200",
          baseVersion: "1000",
        },
        {
          funcPermission: "资源配置",
          funcEquity: "一次性打印（张）",
          tryVersion: "5",
          experienceVersion: "50",
          baseVersion: "100",
        },
        {
          funcPermission: "资源配置",
          funcEquity: "自定义标签模板（个）",
          tryVersion: "1",
          experienceVersion: "5",
          baseVersion: "10",
        },
        {
          funcPermission: "资源配置",
          funcEquity: "资产导入限制（条）",
          tryVersion: "10",
          experienceVersion: "1000",
          baseVersion: "1000",
        },
        {
          funcPermission: "资源配置",
          funcEquity: "注册账号数量（个）",
          tryVersion: "×",
          experienceVersion: "5",
          baseVersion: "5",
        },
        {
          funcPermission: "资源配置",
          funcEquity: "接口开放权限（默认）",
          tryVersion: "×",
          experienceVersion: "×",
          baseVersion: "×",
        },
      ],
      costEquityTableData: [
        {
          cost: "类型",
          onLine: "体验版",
          local: "基础版",
        },
        {
          cost: "年费",
          onLine: "0",
          local: "0",
        },
        {
          cost: "研发费",
          onLine: "-",
          local: "-",
        },
        {
          cost: "升级费",
          onLine: "0",
          local: "-",
        },
        {
          cost: "升级费",
          onLine: "自动",
          local: "不提供更新",
        },
        {
          cost: "系统维护费",
          onLine: "0",
          local: "-",
        },
        {
          cost: "部署费",
          onLine: "-",
          local: "0",
        },
        {
          cost: "注册方式",
          onLine: "注册码",
          local: "注册码+激活码",
        },
        {
          cost: "资源",
          onLine: "共享",
          local: "独占",
        },
        {
          cost: "运行维护",
          onLine: "提供商",
          local: "独占",
        },
        {
          cost: "说明",
          onLine:
            "用户可以抢先体验线上新功能无需部署，0费用。 功能更新，可能会引起用户功能的不兼容",
          local: "线下部署，本地数据安全系数高；稳定性强",
        },
      ],
    };
  },
  methods: {
    mergeCol(id, rowIndex) {
      // 合并单元格
      // id：属性名
      // rowIndex：行索引值
      var idName = this.funcEquityTableData[rowIndex][id]; // 获取当前单元格的值
      if (rowIndex > 0) {
        // 判断是不是第一行
        // eslint-disable-next-line eqeqeq
        if (
          this.funcEquityTableData[rowIndex][id] !=
          this.funcEquityTableData[rowIndex - 1][id]
        ) {
          // 先判断当前单元格的值是不是和上一行的值相等
          var i = rowIndex;
          var num = 0; // 定义一个变量i，用于记录行索引值并进行循环，num用于计数
          while (i < this.funcEquityTableData.length) {
            // 当索引值小于table的数组长度时，循环执行
            if (this.funcEquityTableData[i][id] === idName) {
              // 判断循环的单元格的值是不是和当前行的值相等
              i++; // 如果相等，则索引值加1
              num++; // 合并的num计数加1
            } else {
              i = this.funcEquityTableData.length; // 如果不相等，将索引值设置为table的数组长度，跳出循环
            }
          }
          return {
            rowspan: num, // 最终将合并的行数返回
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0, // 如果相等，则将rowspan设置为0
            colspan: 1,
          };
        }
      } else {
        // 如果是第一行，则直接返回
        let i = rowIndex;
        let num = 0;
        while (i < this.funcEquityTableData.length) {
          // 当索引值小于table的数组长度时，循环执行
          if (this.funcEquityTableData[i][id] === idName) {
            i++;
            num++;
          } else {
            i = this.funcEquityTableData.length;
          }
        }
        return {
          rowspan: num,
          colspan: 1,
        };
      }
    },
    // 这个方法是 element-ui提供的单元格合并方法
    // objectSpanMethod 传入了 { row, column, rowIndex, columnIndex }
    // row: 当前行
    // column: 当前列
    // rowIndex：当前行号
    // columnIndex ：当前列号
    // 1代表：独占一行
    // 更大的自然数：代表合并了若干行
    // 0：代表“消失”的哪那一个单元格，后面的单元格向前推一格
    objectSpanMethod({ rowIndex, columnIndex }) {
      // 合并单元格
      switch (
        columnIndex // 将列索引作为判断值
      ) {
        // 通过传递不同的列索引和需要合并的属性名，可以实现不同列的合并
        case 0:
          return this.mergeCol("funcPermission", rowIndex);
      }
    },
    handerMethod({ rowIndex }) {
      if (rowIndex === 1) {
        //这里为了是将第二列的表头隐藏，就形成了合并表头的效果
        return { display: "none" };
      }
    },
    goLogin() {
      this.$router.push({ path: "/Login" });
    },
  },
};
</script>
<style lang="scss" scoped>
.equity {
  margin: 0 auto;
  height: 100%;
  background: #f5f5f8;
}
.equity-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: #ffffff;
  box-shadow: 0px 3px 10px 0px rgba(22, 19, 46, 0.17);
  .contain {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1200px;
    height: 80px;
    h2 {
      font-size: 28px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #352d7d;
    }
  }
}
.equity-content {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 1200px;
  height: calc(100% - 120px);
  overflow: auto;
  .comparison {
    // height: 1353px;
    background: #ffffff;
    box-sizing: border-box;
  }
  .cost {
    margin-top: 25px;
    // height: 581px;
    background: #ffffff;
  }
  .decorate {
    height: 6px;
    background: #352d7d;
    border-radius: 3px 3px 0px 0px;
  }
}
::v-deep .headerCell {
  height: 62px !important;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #352d7d !important;
}
/**
改变边框颜色
 */
.el-table {
  border-bottom: 2px solid #eee;
  border-right: 2px solid #eee;
}
::v-deep.el-table th {
  border: 2px solid #eee !important;
  border-right: none !important;
  border-bottom: none !important;
}

::v-deep.el-table td {
  border: 2px solid #eee;
  border-right: none !important;
  border-bottom: none !important;
}
</style>
