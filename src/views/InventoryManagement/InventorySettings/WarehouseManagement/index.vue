<template>
  <div class="WarehouseManagement">
    <el-card class="box-card">
      <!-- <el-menu default-active="2" class="el-menu-vertical-demo">
        <sidebar-item :subMenuList="subMenuList" />
      </el-menu> -->
      <div class="classification">
        <div class="classification-title">
          {{ $t("h.formTips54") + $t("h.title150") }}
        </div>
        <el-tree
          class="el-menu-vertical-demo"
          :data="subMenuList"
          :props="subMenuListProps"
          :highlight-current="highlightCurrent"
          node-key="houseId"
          @node-click="tableDataSwitching"
        >
          <!-- <span slot-scope="{ node }">
            <span class="text" style="font-size: 14px">
              {{ node.label }}
            </span>
          </span> -->
          <span slot-scope="{ data }" class="span">
            <span class="icon">
              <template v-if="data.children == null">
                <svg-icon class="childIcon" icon-file-name="childGb"></svg-icon>
              </template>
              <template v-else>
                <svg-icon class="parentIcon" icon-file-name="gb"></svg-icon>
              </template>
            </span>
            <span class="text" style="font-size: 14px">
              {{ data.code }}-{{ data.name }}
            </span>
          </span>
        </el-tree>
      </div>
      <div class="operation-area">
        <!-- 右侧头部 -->
        <div class="right-header">
          <ds-query-form>
            <ds-query-form-left-panel>
              <ds-search-btn
                :searchValue.sync="andLike"
                @search="search"
              ></ds-search-btn>
            </ds-query-form-left-panel>
            <ds-query-form-right-panel>
              <el-button size="mini" @click="showAll">{{
                $t("h.showAllWarehouses")
              }}</el-button>
              <el-button size="mini" @click="readDialogVisible = true">{{
                $t("h.batchImportWarehouse")
              }}</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="dialogVisible = true"
                >{{ $t("h.newBtn") + $t("h.formTips54") }}</el-button
              >
            </ds-query-form-right-panel>
          </ds-query-form>
        </div>
        <!-- 右侧主体 -->
        <div class="right-body">
          <div class="table">
            <el-table
              :data="tableDataDisplay"
              header-cell-class-name="table-header"
              cell-class-name="table-content"
              style="width: 100%; height: 100%"
              border
              align="center"
            >
              <el-table-column
                prop="code"
                :label="$t('h.title201')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                :label="$t('h.title202')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="subName"
                :label="$t('h.title203')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="stateName"
                :label="$t('h.state')"
                align="center"
              >
              </el-table-column>
              <el-table-column
                :label="$t('h.action')"
                align="center"
                fixed="right"
                :width="lang == 'EN' ? '330' : '220'"
              >
                <template slot-scope="scope">
                  <el-button size="mini" @click="modify(scope.row)">{{
                    $t("h.changeBtn")
                  }}</el-button>
                  <el-button size="mini" @click="disable(scope.row)">{{
                    scope.row.disabled ? $t("h.enable") : $t("h.disabled")
                  }}</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteWarehouse(scope.row)"
                    >{{ $t("h.delBtn") }}</el-button
                  >
                </template>
              </el-table-column>
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
        <!-- 新建仓库数据填写 -->
        <el-dialog
          :title="functionConversion ? $t('h.title204') : $t('h.title181')"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <el-form
            :model="warehouseData"
            :rules="warehouseRules"
            ref="warehouseData"
            label-width="80px"
          >
            <el-form-item :label="$t('h.title205')" prop="code">
              <el-input v-model="warehouseData.code"></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.title202')" prop="name">
              <el-input v-model="warehouseData.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.title203')" prop="subId">
              <el-cascader
                :options="superiorWarehouseData"
                :props="{ checkStrictly: true }"
                v-model="warehouseData.subId"
                :show-all-levels="false"
              ></el-cascader>
              <!-- <el-select
                v-model="warehouseData.subId"
                placeholder="请选择上级仓库"
              >
                <el-option
                  v-for="item in superiorWarehouseData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                  :disabled="JSON.parse(item.disabled)"
                ></el-option>
              </el-select> -->
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">{{ $t("h.cancelBtn") }}</el-button>
            <el-button
              type="primary"
              @click="addWarehouse"
              v-if="!functionConversion"
              >{{ $t("h.confirmBtn") }}</el-button
            >
            <el-button
              type="primary"
              @click="modifyWarehouse"
              v-if="functionConversion"
              >{{ $t("h.saveBtn") }}</el-button
            >
          </span>
        </el-dialog>
        <!-- 批量导入仓库数据填写 -->
        <read-excel-file
          :readDialogVisible.sync="readDialogVisible"
          :setp="setp"
          :percentage="percentage"
          :errorText="errorText"
          :title="$t('h.bulkBtn')"
          @download="downloadImportFile"
          @closed="readDialogVisibleClosed"
          @submit="readDialogVisibleSubmit"
        >
          <upload-excel-file
            :value.sync="file"
            :loading="readLoading"
          ></upload-excel-file>
        </read-excel-file>
      </div>
    </el-card>
  </div>
</template>
<script>
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsPagination from "@/components/DsPagination";
import ReadExcelFile from "@/components/ReadExcelFile";
import UploadExcelFile from "@/components/ReadExcelFile/components/UploadExcelFile.vue";
import { clickDownloadLink } from "@/utils/basic-methods";
import { warehouseOperate } from "@/assets/api";
import { mapState } from "vuex";
export default {
  components: {
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
    DsSearchBtn,
    DsPagination,
    ReadExcelFile,
    UploadExcelFile,
  },
  data() {
    return {
      superiorWarehouseData: [],
      highlightCurrent: true,
      andLike: "",
      tableData: [],
      tableDataDisplay: [], //代替tableData的页面数据显示
      subMenuList: [],
      subMenuListProps: { children: "children", label: "name" },
      warehouseData: {
        code: "",
        name: "",
        subId: "",
      },
      warehouseRules: {
        code: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.title205"),
            trigger: ["blur", "change"],
          },
          // {
          //   pattern: /^[A-Za-z0-9]+$/,
          //   message: "仓库编码只能数字/字母",
          //   trigger: ["change", "blur"],
          // },
        ],
        name: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.title202"),
            trigger: ["blur", "change"],
          },
        ],
        subId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.title203"),
            trigger: "change",
          },
        ],
      },
      //分页
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      //上级仓库数据
      dialogVisible: false,
      batchVisible: false,
      houseId: "",
      functionConversion: false, //判断仓库数据填写是修改还是新增
      //批量导入仓库
      readDialogVisible: false,
      setp: "upload",
      percentage: 0,
      errorText: "",
      file: {
        value: "",
        name: "",
      },
      readLoading: false,
      mapKey: {
        "仓库编码（必填）": "code",
        "仓库名称（必填）": "name",
        "所属公司编码（必填）": "date",
        上级仓库编码: "subId",
      },
      lang: "ZH",
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    // 分页功能
    // 设置条数 页数
    changeSizePage(val) {
      this.paginationForm.currentPage = val.page;
      this.paginationForm.pageSize = val.limit;
      let start = 0;
      let end = this.paginationForm.pageSize - 1;
      this.tableDataDisplay = [];
      //   当页数不等于1从start=end*this.paginationForm.currentPage - 1开始到所设置的数据条数
      if (this.paginationForm.currentPage == 1) {
        for (let i = start; i < end; i++) {
          if (this.tableData[i]) {
            this.tableDataDisplay.push(this.tableData[i]);
          }
        }
      } else {
        for (
          let i = end * (this.paginationForm.currentPage - 1);
          i < end * this.paginationForm.currentPage;
          i++
        ) {
          if (this.tableData[i]) {
            this.tableDataDisplay.push(this.tableData[i]);
          }
        }
      }
    },
    //确定上传文件
    readDialogVisibleSubmit() {
      if (!this.file.value)
        return this.$notify.error({
          title: this.$t("h.title18"),
          message: this.$t("h.title93"),
        });
      this.readExcel();
    },
    readExcel() {
      this.readLoading = true;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.file.value);
      fileReader.onload = (ev) => {
        try {
          let data = ev.target.result;
          data = data.split("base64,")[1];
          this.readLoading = false;
          this.setp = "loading";
          this.percentage = 50;
          warehouseOperate({
            func: "ST0005",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              base64: data,
              permissonId: 16,
            },
          })
            .then(({ data }) => {
              this.percentage = 100;
              if (data.code != 0) {
                this.setp = "result";
                this.errorText = data.data;
                return;
              }
              this.setp = "result";
              this.getData(this.userInfo._id, this.userInfo.token);
            })
            .catch(() => {
              this.percentage = 100;
              this.setp = "result";
              // 服务器网络错误，请稍后再试
              this.errorText = this.$t("h.tips18");
            });
        } catch (error) {
          this.readLoading = false;
          this.$notify({
            title: this.$t("h.title27"),
            message: this.$t("h.tips156"),
          });
        }
      };
    },
    //下载文件模板
    downloadImportFile() {
      clickDownloadLink(window.$EXCEL_URL + "物品仓库导入模板.xlsx");
    },
    // 关闭批量导入
    readDialogVisibleClosed() {
      this.file.value = "";
      this.file.name = "";
      this.setp = "upload";
      this.percentage = 0;
      this.errorText = "";
    },
    //dialog关闭
    handleClose() {
      this.$nextTick(() => {
        if (this.functionConversion) {
          this.modifySuperiorWarehouseData();
        }
        this.warehouseData.code = "";
        this.warehouseData.name = "";
        this.warehouseData.subId = "";
        this.$refs["warehouseData"].resetFields();
        this.dialogVisible = false;
        this.functionConversion = false;
      });
    },
    closeDialog() {
      this.$nextTick(() => {
        if (this.functionConversion) {
          this.modifySuperiorWarehouseData();
        }
        this.warehouseData.code = "";
        this.warehouseData.name = "";
        this.warehouseData.subId = "";
        this.$refs["warehouseData"].resetFields();
        this.dialogVisible = false;
        this.functionConversion = false;
      });
    },
    //dialog关闭修改上级仓库数据
    modifySuperiorWarehouseData() {
      // this.superiorWarehouseData = [
      //   { label: "无上级", value: "-", disabled: false },
      // ];
      // this.tableData.forEach((item) => {
      //   this.superiorWarehouseData.push({
      //     label: item.name,
      //     value: item.houseId,
      //     disabled: item.disabled,
      //   });
      // });
      this.superiorWarehouseData = JSON.parse(JSON.stringify(this.subMenuList));
      this.superiorWarehouseData.unshift({
        label: this.$t("h.title199"),
        value: "-",
        disabled: false,
      });
    },
    //新增仓库
    addWarehouse() {
      this.$refs["warehouseData"].validate((valid) => {
        if (!valid) return false;
        let message = false;
        this.tableData.forEach((item) => {
          if (item.code == this.warehouseData.code) message = true;
        });
        if (message) return this.$message.error(this.$t("h.tips267"));
        let userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
        let token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
        warehouseOperate({
          func: "ST0002",
          userId,
          token,
          requstData: {
            code: this.warehouseData.code,
            name: this.warehouseData.name,
            subId:
              this.warehouseData.subId.length > 1
                ? this.warehouseData.subId[this.warehouseData.subId.length - 1]
                : this.warehouseData.subId.join(),
            houseId: this.houseId,
            state: "0",
          },
        })
          .then(({ data }) => {
            this.$message.success(data.data);
            localStorage.setItem(
              "houseId",
              JSON.parse(localStorage.getItem("houseId")) + 1
            );
            this.getData(userId, token);
          })
          .catch((error) => this.$message.error(error));
        this.warehouseData.code = "";
        this.warehouseData.name = "";
        this.warehouseData.subId = "";
        this.$refs["warehouseData"].resetFields();
        this.dialogVisible = false;
      });
    },
    //树状图生成
    tree(list, subId) {
      const arr = [];
      // 1.遍历
      list.forEach((item) => {
        // 2.首次传入空字符串  判断list的pid是否为空 如果为空就是一级节点
        if (item.subId == subId) {
          // 找到之后就要去找item下面有没有子节点  以 item.id 作为 父 id, 接着往下找
          const children = this.tree(list, item.houseId);
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
    //获取仓库数据
    getData(userId, token) {
      warehouseOperate({
        func: "ST0001",
        userId,
        token,
        requstData: {},
      })
        .then(({ data }) => {
          // console.log("获取仓库数据", data.data);
          this.tableData = data.data;
          if (data.data) {
            this.subMenuList = [];
            this.tableData.forEach((item) => {
              if (!item.subId) {
                item.subId = "-";
              }
              if (item.subId != "-") {
                this.tableData.forEach((item2) => {
                  if (item.subId == item2.houseId) {
                    item.subName = item2.name;
                  }
                });
              } else {
                item.subName = "-";
              }
              if (!item.disabled) {
                item.stateName = this.$t("h.enable");
              } else if (item.disabled) {
                item.stateName = this.$t("h.disabled");
              } else if (item.state == "-1") {
                item.stateName = this.$t("h.title206");
              }
            });
            this.subMenuList = this.tree(
              JSON.parse(JSON.stringify(this.tableData)),
              "-"
            );
            this.tree(this.tableData, "-");
            this.subMenuList.forEach((item) => {
              // item.name = item.code + "-" + item.name;
              item.label = item.name;
              item.value = item.houseId;
              if (item.children && item.children.length) {
                this.modifySeleteWarehouse(item.children);
                // item.children.forEach((item2) => {
                //   item2.name = item2.code + "-" + item2.name;
                // });
              }
            });
            this.superiorWarehouseData = JSON.parse(
              JSON.stringify(this.subMenuList)
            );
            this.superiorWarehouseData.unshift({
              label: this.$t("h.title199"),
              value: "-",
              disabled: false,
            });
            this.tableDataDisplay = this.tableData;
          } else if (!data.data) {
            this.tableData = [];
          }
          this.total = this.tableData.length;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //删除仓库
    deleteWarehouse(row) {
      let userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
      let token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
      if (row.children && row.children.length) {
        return this.$message.error(this.$t("h.tips268"));
      } else {
        this.$confirm(this.$t("h.tips269"), this.$t("h.title18"), {
          confirmButtonText: this.$t("h.confirmBtn"),
          cancelButtonText: this.$t("h.cancelBtn"),
          type: "warning",
        })
          .then(() => {
            warehouseOperate({
              func: "ST0004",
              userId,
              token,
              requstData: {
                houseId: row.houseId,
              },
            })
              .then(({ data }) => {
                this.$message.success(data.data);
                this.getData(userId, token);
              })
              .catch((error) => this.$message.error(error));
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("h.tips98"),
            });
          });
      }
    },
    //禁用仓库
    disable(row) {
      let userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
      let token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
      this.$confirm(
        `${this.$t("h.title207")}${
          row.disabled ? this.$t("h.enable") : this.$t("h.disabled")
        }${this.$t("h.title208")}`,
        this.$t("h.title18"),
        {
          confirmButtonText: this.$t("h.confirmBtn"),
          cancelButtonText: this.$t("h.cancelBtn"),
          type: "warning",
        }
      )
        .then(() => {
          warehouseOperate({
            func: "ST0003",
            userId,
            token,
            requstData: {
              houseId: row.houseId,
              code: row.code,
              name: row.name,
              subId: row.subId,
              disabled: !row.disabled,
            },
          })
            .then(() => {
              this.getData(userId, token);
            })
            .catch((error) => this.$message.error(error));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("h.tips226"),
          });
        });
    },
    //修改仓库
    modify(row) {
      this.changeData(this.superiorWarehouseData, row.houseId);
      this.warehouseData.code = row.code;
      this.warehouseData.name = row.name;
      this.warehouseData.subId = row.subId;
      this.warehouseData.state = row.state;
      this.warehouseData.houseId = row.houseId;
      this.dialogVisible = true;
      //修改仓库标识
      this.functionConversion = true;
    },
    modifyWarehouse() {
      let userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
      let token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
      console.log(this.warehouseData.subId.length);
      warehouseOperate({
        func: "ST0003",
        userId,
        token,
        requstData: {
          houseId: this.warehouseData.houseId,
          code: this.warehouseData.code,
          name: this.warehouseData.name,
          // subId:
          //   this.warehouseData.subId.length > 1
          //     ? this.warehouseData.subId[this.warehouseData.subId.length - 1]
          //     : this.warehouseData.subId.join(),
          subId: (() => {
            const subId = this.warehouseData.subId;
            // 如果是数组
            if (Array.isArray(subId)) {
              return subId.length > 1 ? subId[subId.length - 1] : subId.join();
            }
            // 如果是对象（且不是 null，因为 typeof null === 'object'）
            else if (subId !== null && typeof subId === "object") {
              const values = Object.values(subId);
              return values.length > 0 ? values[0] : "";
            }
            else {
              return subId || ""; // 保证不报错，返回空字符
            }
          })(),
          state: this.warehouseData.state,
        },
      })
        .then(({ data }) => {
          if (data.code != "-1") {
            this.$message.success(data.data);
            this.getData(userId, token);
          } else {
            this.$message.error(data.data + this.$t("h.tips263"));
          }
        })
        .catch((error) => this.$message.error(error));
      delete this.warehouseData.houseId;
      delete this.warehouseData.state;
      this.warehouseData.code = "";
      this.warehouseData.name = "";
      this.warehouseData.subId = "";
      this.$refs["warehouseData"].resetFields();
      this.dialogVisible = false;
      this.functionConversion = false;
    },
    //搜索
    search() {
      this.tableDataDisplay = this.tableData.filter((item) => {
        for (let key in item) {
          if (item[key] && item[key].toString().indexOf(this.andLike) != -1) {
            if (key == "code" || key == "name") {
              return item;
            }
          }
        }
      });
    },
    //点击树状图返回将表格转换成相对应的数据
    tableDataSwitching(data) {
      if (!this.highlightCurrent) {
        this.highlightCurrent = true;
      }
      this.tableDataDisplay = this.tableData.filter(
        (item) => item.houseId == data.houseId
      );
      if (data.children && data.children.length) {
        data.children.forEach((children) => {
          this.tableData.forEach((item) => {
            if (item.houseId == children.houseId) {
              this.tableDataDisplay.push(item);
            }
          });
        });
      }
    },
    //显示全部数据
    showAll() {
      this.tableDataDisplay = this.tableData;
      this.highlightCurrent = false;
    },
    modifySeleteWarehouse(children) {
      children.forEach((item) => {
        // item.name = item.code + "-" + item.name;
        item.label = item.name;
        item.value = item.houseId;
        if (item.children && item.children.length) {
          this.modifySeleteWarehouse(item.children);
        }
      });
    },
    //清除不需要的仓库选择数据
    changeData(arr, id) {
      arr.forEach((item, index) => {
        if (item.value == id) {
          arr.splice(index, 1);
        }
        if (item.children && item.children.length)
          this.changeData(item.children, id);
      });
    },
  },
  created() {
    if (localStorage.getItem("houseId")) {
      this.houseId = JSON.parse(localStorage.getItem("houseId"));
    } else {
      localStorage.setItem("houseId", 1);
      this.houseId = JSON.parse(localStorage.getItem("houseId"));
    }
    let userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
    let token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
    this.getData(userId, token);
    this.lang = localStorage.getItem("lang");
  },
};
</script>
<style lang="scss" scoped>
.WarehouseManagement {
  height: calc(100% - 2px);
  box-sizing: border-box;
  padding: 15px;
  .box-card {
    height: 100%;
  }
}
::v-deep .el-card__body {
  display: flex;
  height: 96.7%;
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
.classification {
  width: 21.97%;
  min-width: 200px;
  .classification-title {
    height: 32px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 20px;
  }
  .el-menu-vertical-demo {
    height: 88%;
    box-shadow: 0px 0px 20px 0px rgba(17, 10, 80, 0.1);
    .span {
      display: flex;
      align-items: center;
    }
    .svg-icon {
      width: 2em;
      height: 2em;
    }
  }
}
.operation-area {
  width: 78%;
  .ds-search {
    margin-left: 10px;
  }
  .right-body {
    height: 100%;
    margin-top: 20px;
    padding-left: 10px;
    .table {
      height: calc(100% - 100px);
    }
    .pagination {
      height: 40px;
    }
  }
}
</style>
