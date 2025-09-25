<template>
  <div class="AnalysisReport">
    <el-card class="box-card">
      <!-- 头部 -->
      <div class="header">
        <el-button size="small" @click="exportFile">{{
          $t("h.exportBtn")
        }}</el-button>
      </div>
      <!-- 搜索 -->
      <div class="screen">
        <ds-query-form>
          <ds-query-form-left-panel>
            <ds-filter-tag
              :filterTagsData="highFilterTags"
              @handleCloseTag="handleCloseFilterTag"
            ></ds-filter-tag>
          </ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <span class="advancedSearch" @click="bodyFilteringVisible = true">{{
              $t("h.advancedBtn")
            }}</span>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="body">
        <div class="echarts-box">
          <div class="left">
            <div class="title">
              <ds-query-form>
                <ds-query-form-left-panel>
                  <div class="text_box">
                    <span>{{ $t("h.inboundAdbOutbound") }}</span>
                  </div>
                </ds-query-form-left-panel>
                <ds-query-form-right-panel>
                  <div class="title_right">
                    <span
                      class="right_font"
                      :class="{ con: leftFontCon == 1 }"
                      @click="leftFontCon = 1"
                      >{{ $t("h.number") }}</span
                    >
                    <span
                      class="right_font margin"
                      :class="{ con: leftFontCon == 2 }"
                      @click="leftFontCon = 2"
                      >{{ $t("h.columns47") }}</span
                    >
                  </div>
                </ds-query-form-right-panel>
              </ds-query-form>
            </div>
            <inventory-operations
              :title="leftEchartsTitle"
              :showData="showData"
            ></inventory-operations>
          </div>
        </div>
        <div class="table">
          <ds-table
            ref="tableDisplay"
            :tableData="tableDataDisplay"
            :columns="columns"
          >
            <!-- :rowKey="(row) => row.articleInventoryId"
            onlyKey="articleInventoryId" -->
          </ds-table>
        </div>
        <div class="dataStatistics">
          <div
            class="Statistics"
            v-for="(item, index) in statisticsData"
            :key="index"
          >
            <span class="title">{{ item.title }}</span>
            <span class="dataDisplay">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 高级筛选 -->
    <ds-filter-drawer
      :filterDrawerVisible.sync="bodyFilteringVisible"
      @resetFilterForm="resetBodyFilterForm"
      @submitFilterForm="submitBodyFilterForm"
    >
      <el-form :model="bodyFiltering" ref="bodyFiltering" label-width="80px">
        <el-form-item :label="$t('h.formTips54')" prop="houseIds">
          <el-cascader
            :options="warehouseData"
            :props="{ checkStrictly: true }"
            v-model="bodyFiltering.houseIds"
          ></el-cascader>
          <!-- <el-select
            v-model="bodyFiltering.houseIds"
            multiple
            placeholder="请选择仓库"
          >
            <el-option
              v-for="item in warehouseData"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item :label="$t('h.formTips55')" prop="sortIds">
          <el-cascader
            :options="subMenuTreeList"
            :props="{ checkStrictly: true }"
            v-model="bodyFiltering.sortIds"
          ></el-cascader>
          <!-- <el-select
            v-model="bodyFiltering.sortIds"
            multiple
            placeholder="请选择物品分类"
          >
            <el-option
              v-for="item in subMenuList"
              :key="item.sortingId"
              :label="item.name"
              :value="item.sortingId"
            >
            </el-option
          ></el-select> -->
        </el-form-item>
      </el-form>
    </ds-filter-drawer>
  </div>
</template>
<script>
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import DsFilterTag from "@/components/DsFilterTag";
import InventoryOperations from "@/components/ECharts/InventoryOperations";
import DsTable from "@/components/DsTable";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import { ClassificationStatistics } from "@/utils/systemData";
import { warehouseOperate } from "@/assets/api";
import { mapState } from "vuex";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs'; // 如果还没引入
export default {
  components: {
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
    DsFilterTag,
    InventoryOperations,
    DsTable,
    DsFilterDrawer,
  },
  data() {
    return {
      bodyFilteringVisible: false,
      leftFontCon: 1,
      leftEchartsTitle: [this.$t("h.title158"), this.$t("h.title159")],
      rightEchartsTitle: [this.$t("h.title160"), this.$t("h.title161")],
      columns: ClassificationStatistics,
      tableData: [],
      statisticsData: [
        { title: this.$t("h.title162"), value: "" },
        { title: this.$t("h.title163"), value: "" },
      ],
      highFilterTags: [],
      bodyFiltering: { houseIds: [], sortIds: [] },
      subMenuList: [],
      subMenuTreeList: [],
      warehouseData: [],
      houseNameData: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    tableDataDisplay() {
      return this.tableData;
    },
    showData() {
      let arr = [];
      if (this.leftFontCon == 1) {
        this.tableData.forEach((item) => {
          let obj = {};
          obj.name = item.sortingName;
          obj.in = item.inAmount;
          obj.out = item.outAmount;
          arr.push(obj);
        });
      } else {
        this.tableData.forEach((item) => {
          let obj = {};
          obj.name = item.sortingName;
          obj.in = item.inMoney;
          obj.out = item.outMoney;
          arr.push(obj);
        });
      }
      return arr;
    },
  },
  methods: {
    //导出
    async exportFile() {
      try {
        const res = await warehouseOperate({
          func: "STR0000",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {},
        });

        const { data } = res;
        if (data.code === "-1") return this.$message.error(data.data);

        const exportData = data.data;
        if (!exportData || exportData.length === 0) {
          return this.$message.warning(this.$t("h.noDataToExport"));
        }

        // 表头和字段
        const headers = [
          "物品分类",
          "初始数量",
          "初始金额",
          "入库数量",
          "入库金额",
          "出库数量",
          "出库金额",
        ];

        const fields = [
          "sortingName",
          "amount",
          "money",
          "inAmount",
          "inMoney",
          "outAmount",
          "outMoney",
        ];

        // 创建 workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("库存分类统计");

        // 设置列
        worksheet.columns = headers.map((header, index) => ({
          header: header,
          key: fields[index],
          width: 15,
        }));

        // 表头样式
        const headerRow = worksheet.getRow(1);
        headerRow.height = 22;
        headerRow.eachCell((cell) => {
          cell.font = { bold: true, name: "SimSun", size: 12 };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" }, // 浅灰色
          };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          // cell.border = {
          //   top: { style: "thin" },
          //   left: { style: "thin" },
          //   bottom: { style: "thin" },
          //   right: { style: "thin" },
          // };
        });

        // 填充数据
        exportData.forEach((row) => {
          const values = fields.map((field) => {
            const val = row[field];
            // 数字类型保留原值，字符串或 null 转为空字符串
            if (typeof val === "number") return val;
            return val == null ? "" : String(val);
          });

          const excelRow = worksheet.addRow(values);
          excelRow.eachCell((cell, colNumber) => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
            // cell.border = {
            //   top: { style: "thin" },
            //   left: { style: "thin" },
            //   bottom: { style: "thin" },
            //   right: { style: "thin" },
            // };
            // 如果是金额或数量列（第2~7列），设置为数字格式
            if (colNumber >= 2 && colNumber <= 7) {
              cell.numFmt = "#,##0.00"; // 或 '0.00'，根据需求调整
            }
          });
        });

        // 生成 buffer 并下载
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const fileName = `库存分类统计_${dayjs().format(
          "YYYYMMDD_HHmmss"
        )}.xlsx`;
        saveAs(blob, fileName);

        this.$message.success(this.$t("h.exportSuccessful"));
      } catch (error) {
        console.error("导出失败:", error);
        this.$message.error(this.$t("h.exportFailed"));
      }
    },
    getData() {
      warehouseOperate({
        func: "STR0000",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.tableData = data.data;
            let inTotal = 0;
            let outTotal = 0;
            this.tableData.forEach((item) => {
              inTotal += item.inMoney;
              outTotal += item.outMoney;
            });
            this.statisticsData[0].value = inTotal;
            this.statisticsData[1].value = outTotal;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //删除用户高级筛选填写数据
    handleCloseFilterTag(val) {
      switch (val.keyStr) {
        case "houseIds":
          this.bodyFiltering.houseIds = [];
          break;
        default:
          this.bodyFiltering.sortIds = [];
      }
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      let requstData = {
        houseIds: "",
        sortIds: "",
      };
      this.highFilterTags.forEach((item) => {
        for (let key in requstData) {
          if (item.keyStr == key) {
            requstData[key] = item.uploadValue;
          }
        }
      });
      for (let key in requstData) {
        if (requstData[key] == "") {
          delete requstData[key];
        }
      }
      warehouseOperate({
        func: "STR0000",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData,
      })
        .then(({ data }) => {
          this.highFilterTags = [];
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.tableData = data.data;
            let inTotal = 0;
            let outTotal = 0;
            this.tableData.forEach((item) => {
              inTotal += item.inMoney;
              outTotal += item.outMoney;
            });
            this.statisticsData[0].value = inTotal;
            this.statisticsData[1].value = outTotal;
          }
          for (let key in requstData) {
            if (key == "houseIds") {
              let nameData = requstData[key].split(",");
              let value = [];
              this.houseNameData.forEach((item) => {
                nameData.forEach((item2) => {
                  if (item.value == item2) {
                    value.push(item.name);
                  }
                });
              });
              this.highFilterTags.push({
                name: this.$t("h.formTips54"),
                value: value.join(),
                uploadValue: requstData[key],
                keyStr: key,
              });
            } else if (key == "sortIds") {
              let nameData = requstData[key].split(",");
              let value = [];
              this.subMenuList.forEach((item) => {
                nameData.forEach((item2) => {
                  if (item.sortingId == item2) {
                    value.push(item.name);
                  }
                });
              });
              this.highFilterTags.push({
                name: this.$t("h.formTips55"),
                value: value.join(),
                uploadValue: requstData[key],
                keyStr: key,
              });
            }
          }
          this.bodyFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //获取仓库数据
    getWarehouseData() {
      warehouseOperate({
        func: "ST0001",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            let arr = [];
            data.data.forEach((item) => {
              if (!item.disabled && item.state == "0") {
                arr.push({
                  name: item.name,
                  label: item.name,
                  value: item.houseId,
                  state: item.state,
                  subId: item.subId,
                });
              }
              this.houseNameData.push({
                name: item.name,
                value: item.houseId,
                state: item.state,
              });
            });
            this.warehouseData = this.tree(arr, "-", "value");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //树状图生成
    tree(list, subId, value) {
      const arr = [];
      // 1.遍历
      list.forEach((item) => {
        // 2.首次传入空字符串  判断list的pid是否为空 如果为空就是一级节点
        if (item.subId == subId) {
          // 找到之后就要去找item下面有没有子节点  以 item.id 作为 父 id, 接着往下找
          const children = this.tree(list, item[value], value);
          if (children.length > 0) {
            // 如果children的长度大于0,说明找到了子节点
            item.children = children;
          }
          // 将item项, 追加到arr数组中
          arr.push(item);
        }
      });
      return arr;
    },
    //获取分类数据
    getClassificationData() {
      warehouseOperate({
        func: "SO0001",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            data.data.forEach((item) => {
              item.label = item.name;
              item.value = item.sortingId;
            });
            this.subMenuTreeList = this.tree(
              JSON.parse(JSON.stringify(data.data)),
              "-",
              "sortingId"
            );
            this.subMenuList = data.data;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    resetBodyFilterForm() {
      this.$refs["bodyFiltering"].resetFields();
      this.highFilterTags = [];
      this.getData();
    },
    submitBodyFilterForm() {
      let requstData = {
        houseIds: this.bodyFiltering.houseIds
          ? this.bodyFiltering.houseIds.join()
          : this.bodyFiltering.houseIds,
        // this.bodyFiltering.houseIds.length > 1
        //   ? this.bodyFiltering.houseIds[
        //       this.bodyFiltering.houseIds.length - 1
        //     ]
        //   : this.bodyFiltering.houseIds.join(),
        sortIds: this.bodyFiltering.sortIds
          ? this.bodyFiltering.sortIds.join()
          : this.bodyFiltering.sortIds,
      };
      for (let key in requstData) {
        if (requstData[key] == "") {
          delete requstData[key];
        }
      }
      warehouseOperate({
        func: "STR0000",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData,
      })
        .then(({ data }) => {
          this.highFilterTags = [];
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.tableData = data.data;
            let inTotal = 0;
            let outTotal = 0;
            this.tableData.forEach((item) => {
              inTotal += item.inMoney;
              outTotal += item.outMoney;
            });
            this.statisticsData[0].value = inTotal;
            this.statisticsData[1].value = outTotal;
          }
          for (let key in requstData) {
            if (key == "houseIds") {
              let nameData = requstData[key].split(",");
              let value = [];
              this.houseNameData.forEach((item) => {
                nameData.forEach((item2) => {
                  if (item.value == item2) {
                    value.push(item.name);
                  }
                });
              });
              this.highFilterTags.push({
                name: this.$t("h.formTips54"),
                value: value.join(),
                uploadValue: requstData[key],
                keyStr: key,
              });
            } else if (key == "sortIds") {
              let nameData = requstData[key].split(",");
              let value = [];
              this.subMenuList.forEach((item) => {
                nameData.forEach((item2) => {
                  if (item.sortingId == item2) {
                    value.push(item.name);
                  }
                });
              });
              this.highFilterTags.push({
                name: this.$t("h.formTips55"),
                value: value.join(),
                uploadValue: requstData[key],
                keyStr: key,
              });
            }
          }
          this.bodyFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
  },
  created() {
    this.getData();
    this.getWarehouseData();
    this.getClassificationData();
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
::v-deep .el-card__body {
  height: 96.2%;
  padding: 20px;
  padding-top: 10px;
}
::v-deep .el-table__body-wrapper {
  height: 100% !important;
}
.AnalysisReport {
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  .box-card {
    height: 100%;
    box-sizing: border-box;
    .screen {
      height: 28px;
      margin-top: 5px;
      margin-bottom: 5px;
      .advancedSearch {
        display: inline-block;
        height: 100%;
        font-size: 12px;
        margin-left: 5px;
        cursor: pointer;
        color: #798cfb;
      }
    }
  }
}
.body {
  height: 93%;
  .echarts-box {
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
    height: 41%;
    .left {
      width: 100%;
      height: 100%;
    }
  }
  .title {
    margin-bottom: 10px;
    .text_box {
      font-size: 16px;
      color: #626262;
    }
    .title_right {
      display: flex;
      height: 100%;
      align-items: flex-end;
    }
    .right_font {
      font-size: 12px;
      color: #999999;
      &.con {
        font-size: 14px;
        color: #6a83fe;
      }
      &.margin {
        margin-left: 8px;
      }
    }
  }
  .table {
    margin-bottom: 10px;
    min-height: 287px;
  }
  .dataStatistics {
    display: flex;
    justify-content: space-around;
    .Statistics {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .title {
      font-size: 12px;
      color: #999;
    }
    .dataDisplay {
      font-size: 16px;
      color: #2c2c2c;
      font-weight: bold;
    }
  }
}
</style>
