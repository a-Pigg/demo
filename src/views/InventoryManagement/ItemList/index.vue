<template>
  <div class="item-list">
    <el-card class="card">
      <div class="operation-area">
        <!-- 右侧头部 -->
        <div class="right-header">
          <ds-query-form>
            <ds-query-form-left-panel>
              <el-button size="small" @click="exportFile">{{
                $t("h.title165")
              }}</el-button>
              <el-button size="small" @click="print">{{
                $t("h.title209")
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
        <!-- 筛选区域  -->
        <div class="screen">
          <ds-query-form>
            <ds-query-form-left-panel>
              <ds-filter-tag
                :filterTagsData="highFilterTags"
                @handleCloseTag="handleCloseFilterTag"
              ></ds-filter-tag>
            </ds-query-form-left-panel>
            <ds-query-form-right-panel>
              <span
                class="advancedSearch"
                @click="bodyFilteringVisible = true"
                >{{ $t("h.advancedBtn") }}</span
              >
            </ds-query-form-right-panel>
          </ds-query-form>
        </div>
        <!-- 主体 -->
        <div class="right-body">
          <div class="table">
            <ds-table
              ref="tableDataDisplay"
              :tableData="tableDataDisplay"
              :tableConfig="bodyTableConfig"
              :columns="columns"
              :rowKey="(row) => row.code"
              onlyKey="code"
              @handleSelectionChange="itemListSelete"
            >
            </ds-table>
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
        <!-- 高级筛选 -->
        <ds-filter-drawer
          class="ds-filter-drawer"
          :filterDrawerVisible.sync="bodyFilteringVisible"
          @resetFilterForm="resetBodyFilterForm"
          @submitFilterForm="submitBodyFilterForm"
          :modal="false"
        >
          <el-form :model="bodyFiltering" ref="body" label-width="100px">
            <el-form-item :label="$t('h.categoryName')" prop="sortingName">
              <el-select
                v-model="bodyFiltering.sortingNameCondition"
                :placeholder="$t('h.tips4')+$t('h.criteria')"
              >
                <el-option :label="$t('h.equal')" value="IS"></el-option>
                <el-option :label="$t('h.contain')" value="ANDLIKE"></el-option>
              </el-select>
              <el-input
                v-model="bodyFiltering.sortingName"
                :placeholder="$t('h.tips3')+$t('h.categoryName')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.title166')" prop="code">
              <el-select
                v-model="bodyFiltering.codeCondition"
                :placeholder="$t('h.tips4')+$t('h.criteria')"
              >
                <el-option :label="$t('h.equal')" value="IS"></el-option>
                <el-option :label="$t('h.contain')" value="ANDLIKE"></el-option>
              </el-select>
              <el-input
                v-model="bodyFiltering.code"
                :placeholder="$t('h.tips3')+$t('h.title166')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.formTips38')" prop="name">
              <el-select
                v-model="bodyFiltering.nameCondition"
                :placeholder="$t('h.tips4')+$t('h.criteria')"
              >
                <el-option :label="$t('h.equal')" value="IS"></el-option>
                <el-option :label="$t('h.contain')" value="ANDLIKE"></el-option>
              </el-select>
              <el-input
                v-model="bodyFiltering.name"
                :placeholder="$t('h.tips3')+$t('h.formTips38')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.formTips63')" prop="barCode">
              <el-select
                v-model="bodyFiltering.barCodeCondition"
                :placeholder="$t('h.tips4')+$t('h.criteria')"
              >
                <el-option :label="$t('h.equal')" value="IS"></el-option>
                <el-option :label="$t('h.contain')" value="ANDLIKE"></el-option>
              </el-select>
              <el-input
                v-model="bodyFiltering.barCode"
                :placeholder="$t('h.tips3')+$t('h.formTips63')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.columns27')" prop="specification">
              <el-select
                v-model="bodyFiltering.specificationCondition"
                :placeholder="$t('h.tips4')+$t('h.criteria')"
              >
                <el-option :label="$t('h.equal')" value="IS"></el-option>
                <el-option :label="$t('h.contain')" value="ANDLIKE"></el-option>
              </el-select>
              <el-input
                v-model="bodyFiltering.specification"
                :placeholder="$t('h.tips3')+$t('h.columns27')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.title198')" prop="logo">
              <el-select
                v-model="bodyFiltering.logoCondition"
                :placeholder="$t('h.tips4')+$t('h.criteria')"
              >
                <el-option :label="$t('h.equal')" value="IS"></el-option>
                <el-option :label="$t('h.contain')" value="ANDLIKE"></el-option>
              </el-select>
              <el-input
                v-model="bodyFiltering.logo"
                :placeholder="$t('h.tips3')+$t('h.title198')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.columns28')" prop="measureUnit">
              <el-select
                v-model="bodyFiltering.measureUnitCondition"
                :placeholder="$t('h.tips4')+$t('h.criteria')"
              >
                <el-option :label="$t('h.equal')" value="IS"></el-option>
                <el-option :label="$t('h.contain')" value="ANDLIKE"></el-option>
              </el-select>
              <el-input
                v-model="bodyFiltering.measureUnit"
                :placeholder="$t('h.tips3')+$t('h.columns28')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.number')" prop="amount">
              <el-select
                v-model="bodyFiltering.amountCondition"
                :placeholder="$t('h.tips4')+$t('h.criteria')"
              >
                <el-option :label="$t('h.equal')" value="IS"></el-option>
                <el-option :label="$t('h.title210')" value="ANDLTE"></el-option>
                <el-option :label="$t('h.title211')" value="ANDGTE"></el-option>
              </el-select>
              <el-input
                v-model="bodyFiltering.amount"
                :placeholder="$t('h.tips3')+$t('h.number')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.price')" prop="price">
              <el-select
                v-model="bodyFiltering.priceCondition"
                :placeholder="$t('h.tips4')+$t('h.criteria')"
              >
                <el-option :label="$t('h.equal')" value="IS"></el-option>
                <el-option :label="$t('h.title210')" value="ANDLTE"></el-option>
                <el-option :label="$t('h.title211')" value="ANDGTE"></el-option>
              </el-select>
              <el-input
                v-model="bodyFiltering.price"
                :placeholder="$t('h.tips3')+$t('h.price')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.columns47')" prop="money">
              <el-select
                v-model="bodyFiltering.moneyCondition"
                :placeholder="$t('h.tips4')+$t('h.criteria')"
              >
                <el-option :label="$t('h.equal')" value="IS"></el-option>
                <el-option :label="$t('h.title210')" value="ANDLTE"></el-option>
                <el-option :label="$t('h.title211')" value="ANDGTE"></el-option>
              </el-select>
              <el-input
                v-model="bodyFiltering.money"
                :placeholder="$t('h.tips3')+$t('h.columns47')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.comment')" prop="remark">
              <el-select
                v-model="bodyFiltering.remarkCondition"
                :placeholder="$t('h.tips4')+$t('h.criteria')"
              >
                <el-option :label="$t('h.equal')" value="IS"></el-option>
                <el-option :label="$t('h.contain')" value="ANDLIKE"></el-option>
              </el-select>
              <el-input
                v-model="bodyFiltering.remark"
                :placeholder="$t('h.comment')"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="仓库" prop="houseId">
              <el-select
                v-model="bodyFiltering.houseId"
                placeholder="请选择仓库"
                filterable
              >
                <el-option
                  v-for="item in warehouseData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->
          </el-form>
        </ds-filter-drawer>
      </div>
    </el-card>
    <inventory-print-components
      ref="apdRef"
      :userInfo="userInfo"
      :selectAssetsData="selectAssetsData"
      @refreshAssets="getData"
    ></inventory-print-components>
  </div>
</template>
<script>
import { mapState } from "vuex";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
// import DsSearchBtn from "@/components/DsSearchBtn";
import DsPagination from "@/components/DsPagination";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import DsTable from "@/components/DsTable";
import InventoryPrintComponents from "@/components/InventoryComponents/InventoryPrintComponents";
import DsFilterTag from "@/components/DsFilterTag";
import { warehouseOperate, select } from "@/assets/api";
import { clickDownloadLink } from "@/utils/basic-methods";
import { articleListColumns } from "@/utils/systemData";
export default {
  components: {
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
    // DsSearchBtn,
    DsPagination,
    DsTable,
    DsFilterDrawer,
    InventoryPrintComponents,
    DsFilterTag,
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
  data() {
    return {
      //用户
      userId: "",
      token: "",
      //员工数据
      employeeData: [],
      //主体表格
      //   andLike: "",
      tableData: [],
      bodyFilteringVisible: false,
      bodyFiltering: {
        sortingNameCondition: "IS", //分类名称条件
        sortingName: "",
        codeCondition: "IS", //物品编码条件
        code: "",
        nameCondition: "IS", //物品名称条件
        name: "",
        barCodeCondition: "IS", //商品条码条件
        barCode: "",
        specificationCondition: "IS", //规格型号条件
        specification: "",
        logoCondition: "IS", //品牌商标条件
        logo: "",
        measureUnitCondition: "IS", //计量单位条件
        measureUnit: "",
        amountCondition: "IS", //数量条件
        amount: "",
        priceCondition: "IS", //单价条件
        price: "",
        moneyCondition: "IS", //金额条件
        money: "",
        remarkCondition: "IS", //备注条件
        remark: "",
        houseId: "",
      },
      bodyTableConfig: {
        selection: true,
      },
      columns: articleListColumns,
      selectAssetsData: [],
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      highFilterTags: [],
      //仓库数据
      warehouseData: [],
      houseId: "",
      houseNameData: [], //主体表格仓库名字数据
    };
  },
  methods: {
    //删除用户高级筛选填写数据
    handleCloseFilterTag(val) {
      switch (val.keyStr) {
        case "sortingName":
          this.bodyFiltering.sortingName = "";
          break;
        case "code":
          this.bodyFiltering.code = "";
          break;
        case "name":
          this.bodyFiltering.name = "";
          break;
        case "barCode":
          this.bodyFiltering.barCode = "";
          break;
        case "specification":
          this.bodyFiltering.specification = "";
          break;
        case "logo":
          this.bodyFiltering.logo = "";
          break;
        case "measureUnit":
          this.bodyFiltering.measureUnit = "";
          break;
        case "amount":
          this.bodyFiltering.amount = "";
          break;
        case "price":
          this.bodyFiltering.price = "";
          break;
        case "money":
          this.bodyFiltering.money = "";
          break;
        case "remark":
          this.bodyFiltering.remark = "";
          break;
        default:
          this.bodyFiltering.houseId = "";
          break;
      }
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      let params = [
        {
          key: "sortingName",
          value: "",
          handle: "",
        },
        {
          key: "code",
          value: "",
          handle: "",
        },
        {
          key: "name",
          value: "",
          handle: "",
        },
        {
          key: "barCode",
          value: "",
          handle: "",
        },
        {
          key: "specification",
          value: "",
          handle: "",
        },
        {
          key: "logo",
          value: "",
          handle: "",
        },
        {
          key: "measureUnit",
          value: "",
          handle: "",
        },
        {
          key: "amount",
          value: "",
          handle: "",
        },
        {
          key: "price",
          value: "",
          handle: "",
        },
        {
          key: "money",
          value: "",
          handle: "",
        },
        {
          key: "remark",
          value: "",
          handle: "",
        },
        {
          key: "houseId",
          value: "",
          handle: "",
        },
      ];
      this.highFilterTags.forEach((item) => {
        params.forEach((item2) => {
          if (item.keyStr == item2.key) {
            if (item2.key == "houseId") {
              item2.value = item.uploadValue;
            } else {
              item2.value = item.value;
            }
            item2.handle = item.handle;
          }
        });
      });
      params = params.filter((item) => {
        if (item.value) {
          return item;
        }
      });
      warehouseOperate({
        func: "SA0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          params,
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.tableData = data.data;
          if (!this.tableData || this.tableData.length == 0) {
            this.tableData = [];
          }
          this.tableData.forEach((item) => {
            if (item.image && item.image[0] != "h") {
              item.image = window.$EXCEL_URL + "image/" + item.image;
              item.prop = item.image;
            }
          });
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 分页功能
    // 设置条数 页数
    changeSizePage(val) {
      this.paginationForm.currentPage = val.page;
      this.paginationForm.pageSize = val.limit;
    },
    //导出
    exportFile() {
      warehouseOperate({
        func: "SA0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          params: [],
          pull: 1,
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          clickDownloadLink(window.$EXCEL_URL + data.data);
          this.$message.success(this.$t("h.exportSuccessful"));
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //获取员工数据
    getEmployeeData() {
      select({
        func: "S0005",
        userId: this.userId,
        token: this.token,
        requstData: {
          _id: "",
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.employeeData = data.data;
          } else {
            this.employeeData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //获取仓库数据
    getWarehouseData() {
      warehouseOperate({
        func: "ST0001",
        userId: this.userId,
        token: this.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            let arr = data.data;
            arr.forEach((item) => {
              this.warehouseData.push({
                name: item.name,
                value: item.houseId,
                state: item.state,
              });
            });
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //获取物品列表
    getData() {
      warehouseOperate({
        func: "SA0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          params: [],
        },
      })
        .then(({ data }) => {
          this.tableData = data.data;
          if (!this.tableData) this.tableData = [];
          this.tableData.forEach((item) => {
            if (item.image && item.image[0] != "h") {
              item.image = window.$EXCEL_URL + "image/" + item.image;
              item.prop = item.image;
            }
          });
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // //搜索
    // search() {
    //   this.tableDataDisplay = this.tableData.filter((item) => {
    //     for (let key in item) {
    //       if (item[key] && item[key].indexOf(this.andLike) != -1) {
    //         if (key == "name") {
    //           return item;
    //         }
    //       }
    //     }
    //   });
    // },
    //重置body高级筛选
    resetBodyFilterForm() {
      this.highFilterTags = [];
      this.$refs["body"].resetFields();
      warehouseOperate({
        func: "SA0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          params: [],
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.tableData = data.data;
          if (!this.tableData || this.tableData.length == 0) {
            this.tableData = [];
          }
          this.tableData.forEach((item) => {
            if (item.image && item.image[0] != "h") {
              item.image = window.$EXCEL_URL + "image/" + item.image;
              item.prop = item.image;
            }
          });
          this.$refs["body"].resetFields();
          this.bodyFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //body高级筛选
    submitBodyFilterForm() {
      let params = [
        {
          key: "sortingName",
          value: this.bodyFiltering.sortingName,
          handle: this.bodyFiltering.sortingNameCondition,
        },
        {
          key: "code",
          value: this.bodyFiltering.code,
          handle: this.bodyFiltering.codeCondition,
        },
        {
          key: "name",
          value: this.bodyFiltering.name,
          handle: this.bodyFiltering.nameCondition,
        },
        {
          key: "barCode",
          value: this.bodyFiltering.barCode,
          handle: this.bodyFiltering.barCodeCondition,
        },
        {
          key: "specification",
          value: this.bodyFiltering.specification,
          handle: this.bodyFiltering.specificationCondition,
        },
        {
          key: "logo",
          value: this.bodyFiltering.logo,
          handle: this.bodyFiltering.logoCondition,
        },
        {
          key: "measureUnit",
          value: this.bodyFiltering.measureUnit,
          handle: this.bodyFiltering.measureUnitCondition,
        },
        {
          key: "amount",
          value: this.bodyFiltering.amount,
          handle: this.bodyFiltering.amountCondition,
        },
        {
          key: "price",
          value: this.bodyFiltering.price,
          handle: this.bodyFiltering.priceCondition,
        },
        {
          key: "money",
          value: this.bodyFiltering.money,
          handle: this.bodyFiltering.moneyCondition,
        },
        {
          key: "remark",
          value: this.bodyFiltering.remark,
          handle: this.bodyFiltering.remarkCondition,
        },
        {
          key: "houseId",
          value: this.bodyFiltering.houseId,
          handle: "IS",
        },
      ];
      params = params.filter((item) => {
        if (item.value) {
          return item;
        }
      });
      warehouseOperate({
        func: "SA0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          params,
        },
      })
        .then(({ data }) => {
          this.highFilterTags = [];
          if (data.code == "-1") return this.$message.error(data.data);
          this.tableData = data.data;
          if (!this.tableData || this.tableData.length == 0) {
            this.tableData = [];
          }
          params.forEach((item) => {
            if (item.key == "sortingName") {
              this.highFilterTags.push({
                name: this.$t("h.categoryName"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "code") {
              this.highFilterTags.push({
                name: this.$t("h.title166"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "name") {
              this.highFilterTags.push({
                name: this.$t("h.formTips38"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "barCode") {
              this.highFilterTags.push({
                name: this.$t("h.formTips63"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "specification") {
              this.highFilterTags.push({
                name: this.$t("h.columns27"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "logo") {
              this.highFilterTags.push({
                name: this.$t("h.title198"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "measureUnit") {
              this.highFilterTags.push({
                name: this.$t("h.columns28"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "amount") {
              this.highFilterTags.push({
                name: this.$t("h.number"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "price") {
              this.highFilterTags.push({
                name: this.$t("h.price"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "money") {
              this.highFilterTags.push({
                name: this.$t("h.columns47"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "remark") {
              this.highFilterTags.push({
                name: this.$t("h.comment"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "houseId") {
              let houseName = "";
              this.warehouseData.forEach((children) => {
                if (children.value == item.value) {
                  houseName = children.name;
                }
              });
              this.highFilterTags.push({
                name: this.$t("h.formTips54"),
                value: houseName,
                keyStr: item.key,
                uploadValue: item.value,
                handle: item.handle,
              });
            }
          });
          // this.$refs["body"].resetFields();
          this.bodyFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //主体表格选择事件
    itemListSelete(val) {
      this.selectAssetsData = val;
    },
    //打印
    print() {
      if (this.selectAssetsData.length == 0) {
        return this.$message.error(this.$t("h.tips121"));
      } else if (this.selectAssetsData.length > 10) {
        // 一次性打印物品列表不能超过10条
        return this.$message.error(this.$t("h.tips122")+10+this.$t("h.tips123"));
      }
      this.$refs.apdRef.dialogVisible = true;
    },
  },
  created() {
    this.userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
    this.token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
    this.getData(this.userId, this.token);
    this.getEmployeeData();
    this.getWarehouseData();
  },
};
</script>
<style lang="scss" scoped>
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
::v-deep .el-select {
  width: 45% !important;
}
.ds-filter-drawer {
  .el-input {
    margin-left: 10px;
    width: 45% !important;
  }
}
.item-list {
  padding: 15px;
  height: 100%;
  box-sizing: border-box;
  .card {
    width: 100%;
    height: 100%;
    padding: 20px;
    padding-top: 10px;
    box-sizing: border-box;
    ::v-deep .el-card__body {
      padding: 0;
      height: 100%;
    }
  }
  .operation-area {
    width: 100%;
    height: 100%;
    .screen {
      height: 28px;
      margin-top: 5px;
      margin-bottom: 5px;
      .advancedSearch {
        display: inline-block;
        margin-left: 10px;
        color: #188cfb;
        font-size: 14px;
        cursor: pointer;
      }
    }
    .right-body {
      height: 93.17%;
      margin-top: 10px;
      .pagination {
        height: 40px;
      }
    }
    .right-panel {
      width: 35.96%;
    }
    .search {
      display: flex;
      height: 20px;
      margin-top: 10px;
      margin-bottom: 10px;
      justify-content: flex-end;
    }
    .table {
      height: 94.5%;
    }
    .pagination {
      height: 40px;
    }
    .title {
      font-size: 18px;
    }
  }
}
</style>