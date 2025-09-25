<template>
  <div class="AnalysisReport">
    <el-card class="box-card">
      <div class="head">
        <ds-query-form>
          <ds-query-form-left-panel>
            <div class="warehouse">
              <span>{{ $t("h.formTips54") }}</span>
              <el-cascader
                style="margin-left: 20px"
                :options="warehouseData"
                :props="{ checkStrictly: true }"
                v-model="warehouseIdData"
              ></el-cascader>
              <!-- <el-select
                v-model="warehouseIdData"
                multiple
                collapse-tags
                style="margin-left: 20px"
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
            </div>
            <el-button
              size="small"
              type="primary"
              @click="getHouseSummaryData(warehouseIdData.join(''))"
              >{{ $t("h.Search") }}</el-button
            >
            <el-button size="small" @click="exportFile">{{
              $t("h.export")
            }}</el-button>
          </ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <!-- <ds-search-btn
              :searchValue.sync="andLike"
              @search="search"
            ></ds-search-btn> -->
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="body">
        <div class="table">
          <el-table
            :data="tableDataDisplay"
            header-cell-class-name="table-header"
            cell-class-name="table-content"
            style="width: 100%"
            height="100%"
            border
            align="center"
            v-loading="loading"
          >
            <el-table-column
              prop="houseName"
              :label="$t('h.formTips54')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="image"
              :label="$t('h.formTips62')"
              align="center"
            >
              <template slot-scope="scope">
                <div class="table-image-cell">
                  <el-image
                    v-if="scope.row.image"
                    :src="scope.row.image"
                    :preview-src-list="[scope.row.image]"
                  ></el-image>
                  <div class="no-image" v-else>
                    <span>{{ $t("h.title51") }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              :label="$t('h.title166')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="substanceName"
              :label="$t('h.formTips38')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="sortName"
              :label="$t('h.formTips55')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="barCode"
              :label="$t('h.formTips63')"
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
            <el-table-column :label="$t('h.title158')" align="center">
              <el-table-column
                prop="inAmount"
                :label="$t('h.number')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="inPrice"
                :label="$t('h.price')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="inMoney"
                :label="$t('h.columns47')"
                align="center"
              >
              </el-table-column>
            </el-table-column>
            <el-table-column :label="$t('h.title159')" align="center">
              <el-table-column
                prop="outAmount"
                :label="$t('h.number')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="outPrice"
                :label="$t('h.price')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="outMoney"
                :label="$t('h.columns47')"
                align="center"
              >
              </el-table-column>
            </el-table-column>
            <el-table-column :label="$t('h.title161')" align="center">
              <el-table-column
                prop="amount"
                :label="$t('h.number')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="price"
                :label="$t('h.price')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="money"
                :label="$t('h.columns47')"
                align="center"
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
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsPagination from "@/components/DsPagination";
import DsDefaultPage from "@/components/DsDefaultPage";
import { warehouseOperate } from "@/assets/api";
import { mapState } from "vuex";
import { clickDownloadLink } from "@/utils/basic-methods";
export default {
  components: {
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
    DsSearchBtn,
    DsPagination,
    DsDefaultPage,
  },
  data() {
    return {
      warehouseIdData: [],
      warehouseData: [],
      // andLike: "",
      tableData: [],
      //分页
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      defaultPageImgUrl: "",
      defaultPageTips: "",
      loading: false,
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
    // search() {},
    changeSizePage(val) {
      this.paginationForm.currentPage = val.page;
      this.paginationForm.pageSize = val.limit;
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
            });
            this.warehouseData = this.tree(arr, "-");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    tree(list, subId) {
      const arr = [];
      // 1.遍历
      list.forEach((item) => {
        // 2.首次传入空字符串  判断list的pid是否为空 如果为空就是一级节点
        if (item.subId == subId) {
          // 找到之后就要去找item下面有没有子节点  以 item.id 作为 父 id, 接着往下找
          const children = this.tree(list, item.value);
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
    //获取收发存数据
    getSummaryData(houseId) {
      let requstData = {};
      if (houseId && houseId.length) {
        requstData.houseId = houseId;
      }
      warehouseOperate({
        func: "SR0000",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData,
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.tableData = data.data;
            this.tableData.forEach((item) => {
              if (!item.houseName) {
                item.houseName = this.$t("h.title167");
              }
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
              }
            });
          } else {
            this.tableData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //搜索选中仓库收发存数据
    getHouseSummaryData(houseId) {
      let requstData = {};
      this.loading = true;
      if (houseId && houseId.length) {
        requstData.house_id = houseId;
      }
      warehouseOperate({
        func: "SR0000",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData,
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.tableData = data.data;
            this.tableData.forEach((item) => {
              if (!item.houseName) {
                item.houseName = this.$t("h.title167");
              }
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
              }
            });
            this.loading = false;
          } else {
            this.tableData = [];
            this.loading = false;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //导出
    async exportFile() {
      try {
        const res = await warehouseOperate({
          func: "SR0000",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {},
        });

        const { data } = res;
        if (data.code === "-1") return this.$message.error(data.data);

        const exportData = data.data;
        if (!exportData || exportData.length === 0) {
          return this.$message.warning("暂无数据可导出");
        }
        
        exportData.forEach((row)=>{
          if(row.image)
          // console.log(row)
          row.image = window.$EXCEL_URL + 'image/' + row.image
        })
        console.log("exda", exportData);
        // exportData

        // 表头和字段（顺序一致）
        const headers = [
          "仓库",
          "照片",
          "物品编码",
          "物品名称",
          "物品分类",
          "商品条码",
          "规格型号",
          "计量单位",
          "入库-数量",
          "入库-单价",
          "入库-金额",
          "出库-数量",
          "出库-单价",
          "出库-金额",
          "结存-数量",
          "结存-单价",
          "结存-金额",
        ];

        const fields = [
          "houseName",
          "image",
          "code",
          "substanceName",
          "sortName",
          "barCode",
          "specification",
          "measureUnit",
          "inAmount",
          "inPrice",
          "inMoney",
          "outAmount",
          "outPrice",
          "outMoney",
          "amount",
          "price",
          "money",
        ];

        // 创建 workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("仓库物品明细");

        // 设置列（第2列是“照片”）
        worksheet.columns = headers.map((header, index) => ({
          header: header,
          key: fields[index],
          width: header === "照片" ? 20 : 12,
        }));

        // 表头样式（无边框）
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

        // 添加数据行（照片列留空）
        exportData.forEach((row) => {
          const values = fields.map((field) => {
            if (field === "image") return ""; // 照片列不写 URL
            let val = row[field];
            return val == null ? "" : String(val);
          });
          const excelRow = worksheet.addRow(values);
          excelRow.height = 80;
          excelRow.eachCell((cell) => {
            cell.alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
          });
        });

        // === 嵌入图片（第2列）===
        for (let i = 0; i < exportData.length; i++) {
          const imageUrl = exportData[i].image;
          if (!imageUrl) continue;

          try {
            const response = await fetch(imageUrl, { mode: "cors" });
            if (!response.ok) continue;

            const contentType =
              response.headers.get("content-type") || "image/png";
            const extMatch = contentType.match(
              /image\/(jpeg|png|gif|bmp|webp)/
            );
            const extension = extMatch ? extMatch[1] : "png";

            const arrayBuffer = await response.arrayBuffer();
            const imageId = workbook.addImage({
              buffer: arrayBuffer,
              extension,
            });

            // 插入到第2列（B列），行 i+2
            worksheet.addImage(imageId, {
              tl: { col: 1, row: i + 1 }, // col 1 = 第2列（0-based）
              br: { col: 2, row: i + 2 },
              editAs: "oneCell",
            });
          } catch (err) {
            console.warn("图片加载失败:", imageUrl, err);
            worksheet.getCell(`B${i + 2}`).value = "图片加载失败";
          }
        }

        // 导出文件
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const fileName = `收发存汇总表${dayjs().format(
          "YYYYMMDD_HHmmss"
        )}.xlsx`;
        saveAs(blob, fileName);
        this.$message.success("导出成功");
      } catch (error) {
        console.error("导出失败:", error);
        this.$message.error("导出失败，请重试");
      }
    },
  },
  created() {
    this.getWarehouseData();
    this.getSummaryData();
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
