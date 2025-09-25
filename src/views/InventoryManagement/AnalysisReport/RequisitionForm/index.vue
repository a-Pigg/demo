<template>
  <div class="AnalysisReport">
    <el-card class="box-card">
      <div class="head">
        <ds-query-form>
          <ds-query-form-left-panel>
            <div class="warehouse">
              <span>{{ $t("h.title164") }}</span>
              <el-date-picker
                v-model="year"
                type="year"
                :placeholder="$t('h.title164')"
                :clearable="false"
                @change="getUseData"
              >
              </el-date-picker>
            </div>
            <el-button size="small" @click="exportFile">{{
              $t("h.title165")
            }}</el-button>
          </ds-query-form-left-panel>
          <ds-query-form-right-panel> </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="body">
        <div class="table">
          <el-table
            :data="tableDataDisplay"
            header-cell-class-name="table-header"
            cell-class-name="table-content"
            style="width: 100%; height: 100%"
            border
            align="center"
            v-loading="loading"
          >
            <el-table-column
              prop="code"
              :label="$t('h.title166')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="name"
              :label="$t('h.formTips38')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="specification"
              :label="$t('h.columns27')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="measureUnit"
              :label="$t('h.columns28')"
              align="center"
            ></el-table-column>
            <el-table-column :label="$t('h.number')" align="center">
              <el-table-column
                prop="January"
                :label="'1' + $t('h.month')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="February"
                :label="'2' + $t('h.month')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="March"
                :label="'3' + $t('h.month')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="April"
                :label="'4' + $t('h.month')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="May"
                :label="'5' + $t('h.month')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="June"
                :label="'6' + $t('h.month')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="July"
                :label="'7' + $t('h.month')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="August"
                :label="'8' + $t('h.month')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="September"
                :label="'9' + $t('h.month')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="October"
                :label="'10' + $t('h.month')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="November"
                :label="'11' + $t('h.month')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="December"
                :label="'12' + $t('h.month')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="total"
                :label="$t('h.columns8')"
                align="right"
              >
              </el-table-column>
            </el-table-column>
            <!-- 空table数据 -->
            <template slot="empty">
              <ds-default-page
                :defaultPageImgUrl="defaultPageImgUrl"
                :defaultPageTips="defaultPageTips"
              ></ds-default-page>
            </template>
          </el-table>
        </div>
        <!-- 分页区域 -->
        <div class="pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="changeSizePage"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import DsPagination from "@/components/DsPagination";
import DsDefaultPage from "@/components/DsDefaultPage";
import { mapState } from "vuex";
import { warehouseOperate } from "@/assets/api";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // 用于下载文件

export default {
  components: {
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
    DsPagination,
    DsDefaultPage,
  },
  data() {
    return {
      warehouseIdData: [],
      warehouseData: [],
      tableData: [],
      //分页
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      defaultPageImgUrl: "",
      defaultPageTips: "",
      loading: false,
      //year: "2023",
      year: "2025",
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    tableDataDisplay() {
      let arr = [];
      let start = 0;
      let end = this.paginationForm.pageSize - 1;
      //   当页数不等于1从start=end*this.paginationForm.currentPage - 1开始到所设置的数据条数
      if (this.paginationForm.currentPage == 1) {
        for (let i = start; i < end; i++) {
          if (this.tableData[i]) {
            arr.push(this.tableData[i]);
          }
        }
      } else {
        for (
          let i = end * (this.paginationForm.currentPage - 1);
          i < end * this.paginationForm.currentPage;
          i++
        ) {
          if (this.tableData[i]) {
            arr.push(this.tableData[i]);
          }
        }
      }
      return arr;
    },
    total() {
      return this.tableData.length;
    },
  },
  methods: {
    // 分页功能
    // 设置条数 页数
    changeSizePage(val) {
      this.paginationForm.currentPage = val.page;
      this.paginationForm.pageSize = val.limit;
    },
    //获取领用数据
    getUseData() {
      let year = this.year;
      if (year.length != 4) {
        year = new Date(year).getFullYear();
      }
      warehouseOperate({
        func: "SOR0000",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          year,
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.tableData = data.data;
            this.tableData.forEach((item1, index1) => {
              item1.counts.forEach((item2, index2) => {
                switch (index2) {
                  case 0:
                    this.tableData[index1].January = item2;
                    break;
                  case 1:
                    this.tableData[index1].February = item2;
                    break;
                  case 2:
                    this.tableData[index1].March = item2;
                    break;
                  case 3:
                    this.tableData[index1].April = item2;
                    break;
                  case 4:
                    this.tableData[index1].May = item2;
                    break;
                  case 5:
                    this.tableData[index1].June = item2;
                    break;
                  case 6:
                    this.tableData[index1].July = item2;
                    break;
                  case 7:
                    this.tableData[index1].August = item2;
                    break;
                  case 8:
                    this.tableData[index1].September = item2;
                    break;
                  case 9:
                    this.tableData[index1].October = item2;
                    break;
                  case 10:
                    this.tableData[index1].November = item2;
                    break;
                  case 11:
                    this.tableData[index1].December = item2;
                    break;
                  default:
                    this.tableData[index1].total = item2;
                }
              });
            });
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //导出
    exportFile() {
      let year = this.year;
      if (year.length !== 4) {
        year = new Date(year).getFullYear();
      }

      warehouseOperate({
        func: "SOR0000",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: { year },
      })
        .then(({ data }) => {
          if (data.code === "-1") return this.$message.error(data.data);

          const exportData = data.data;
          if (!exportData || exportData.length === 0) {
            return this.$message.warning("暂无数据可导出");
          }
          console.log(exportData);

          // 构建 Excel 表格
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("领用明细");

          // 表头定义
          const headers = [
            "物品编码",
            "物品名称",
            "规格型号",
            "计量单位",
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
            "合计",
          ];

          // 字段映射（与 header 对应）
          const fields = [
            "code",
            "name",
            "specification",
            "measureUnit",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "total",
          ];

          // 设置列宽
          worksheet.columns = headers.map((header, index) => ({
            header,
            key: fields[index],
            width: header === "合计" ? 10 : header.includes("月") ? 8 : 12,
          }));

          // 添加表头样式
          const headerRow = worksheet.getRow(1);
          headerRow.height = 24;
          headerRow.eachCell((cell) => {
            cell.font = { name: "SimSun", size: 12, bold: true };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFC0C0C0" },
            };
            cell.alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
          });

          // 添加数据行
          exportData.forEach((item) => {
            // ✅ 关键修复：只取前12个月
            const counts = (item.counts || []).slice(0, 12);
            const monthly = Array(12)
              .fill(0)
              .map((_, i) => counts[i] || 0);
            const total = monthly.reduce((a, b) => a + b, 0);

            const row = {
              code: item.code,
              name: item.name,
              specification: item.specification,
              measureUnit: item.measureUnit,
              Jan: counts[0] || 0,
              Feb: counts[1] || 0,
              Mar: counts[2] || 0,
              Apr: counts[3] || 0,
              May: counts[4] || 0,
              Jun: counts[5] || 0,
              Jul: counts[6] || 0,
              Aug: counts[7] || 0,
              Sep: counts[8] || 0,
              Oct: counts[9] || 0,
              Nov: counts[10] || 0,
              Dec: counts[11] || 0,
              total: counts.reduce((sum, count) => sum + (count || 0), 0),
            };

            const excelRow = worksheet.addRow(row);
            excelRow.height = 20;
            excelRow.eachCell((cell) => {
              cell.alignment = {
                vertical: "middle",
                horizontal: "center",
                wrapText: true,
              };
            });
          });

          // 导出文件
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const fileName = `领用领用表_${year}.xlsx`;
            saveAs(blob, fileName);
            this.$message.success(this.$t("h.exportSuccessful"));
          });
        })
        .catch((error) => {
          console.error("导出失败:", error);
          this.$message.error("导出失败，请重试");
        });
    },
  },

  created() {
    this.getUseData();
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-card__body {
  height: 96.2%;
  padding: 20px;
  padding-top: 10px;
}
::v-deep .table-header {
  padding: 0;
  height: 41px;
  font-size: 13px;
  color: #000;
  background-color: #f2f6ff !important;
  border-color: #eeeeee;
}
::v-deep .table-content {
  padding: 0;
  height: 42px;
  color: #333;
  font-size: 13px;
  border-color: #eeeeee;
}
::v-deep .el-table__body-wrapper {
  height: 90%;
}
.table-image-cell {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 60px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  .no-image {
    width: 100%;
    background-color: #bbb;
  }
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
        margin-left: 5px;
        cursor: pointer;
        color: #798cfb;
      }
    }
  }
}
.head {
  margin-bottom: 38px;
  .warehouse {
    margin-right: 20px;
    span {
      font-size: 14px;
      color: #626262;
      display: inline-block;
      margin-right: 10px;
    }
  }
}
.body {
  height: 95.4%;
  .table {
    height: calc(100% - 60px);
  }
  .pagination {
    height: 40px;
  }
}
</style>
