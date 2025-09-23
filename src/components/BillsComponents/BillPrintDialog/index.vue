<template>
  <el-dialog
    v-loading="loading"
    custom-class="vPrintDialog"
    :title="$t('h.title58')"
    fullscreen
    :visible.sync="voucherPrintDialogVisible"
    @closed="closedVoucherPrinter"
    @opened="openVoucherPrinter"
  >
    <div class="box">
      <div class="box-1">
        <div class="tags">
          <el-row :gutter="10">
            <el-col
              :xs="24"
              :sm="12"
              :lg="8"
              v-for="(item, i) in pagMultipleSelection.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )"
              :key="i"
            >
              <el-image
                :src="item"
                lazy
                :preview-src-list="pagMultipleSelection"
              ></el-image>
            </el-col>
          </el-row>
        </div>
        <div class="pag">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagMultipleSelection.length"
          >
          </el-pagination>
        </div>
      </div>
      <div class="box-2" v-loading="refreshLoading">
        <el-form
          :model="printForm"
          :rules="printFormRules"
          ref="printFormRef"
          label-width="142px"
        >
          <el-form-item :label="$t('h.formTips1')" prop="printName">
            <el-select
              v-model="printForm.printName"
              :placeholder="$t('h.tips4') + $t('h.formTips1')"
              @change="printerSelectChange"
              @clear="printSelectClear"
              clearable
            >
              <el-option
                v-for="(item, index) in printerSymbol"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-popover
              placement="top-start"
              :title="$t('h.formTips1') + $t('h.tips46')"
              width="200"
              trigger="hover"
            >
              <div>
                {{ $t("h.formTips1") + $t("h.tips48") }}:{{ printerName
                }}<br />{{ $t("h.formTips1") + $t("h.tips49") }}:{{ printerType
                }}{{ $t("h.formTips1") }}
              </div>
              <img
                class="printerInfoIcon"
                slot="reference"
                src="@/assets/images/detailIcon.png"
                :alt="$t('h.tips46')"
              />
            </el-popover>
            <i @click="refreshPrinter" class="el-icon-refresh refresh_icon"></i>
          </el-form-item>
          <el-form-item :label="$t('h.formTips2')">
            <el-input-number
              v-model="printForm.printNum"
              :min="1"
              :precision="0"
              size="small"
            ></el-input-number>
          </el-form-item>
          <el-form-item :label="$t('h.formTips3')" prop="moban">
            <el-select
              v-model="printForm.moban"
              :placeholder="$t('h.tips4') + $t('h.formTips3')"
              @change="templateSelectChange"
              ref="printTempSelectRef"
            >
              <el-option
                v-for="(item, i) in voucherPrintTemplate"
                :key="i"
                :label="item.title"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-collapse v-model="activeNames" accordion>
            <el-collapse-item :title="$t('h.formTips5')" name="1">
              <el-form-item :label="$t('h.formTips6')">
                <el-input-number
                  v-model="printForm.transverse"
                  size="small"
                  :precision="0"
                ></el-input-number>
                <span
                  style="
                    margin-left: 10px;
                    font-size: 12px;
                    position: absolute;
                    width: 165px;
                    line-height: 20px;
                  "
                  >{{ $t("h.formTips7") }}</span
                >
              </el-form-item>
              <el-form-item :label="$t('h.formTips10')">
                <el-input-number
                  v-model="printForm.longitudinal"
                  size="small"
                  :precision="0"
                ></el-input-number>
                <span
                  style="
                    margin-left: 10px;
                    font-size: 12px;
                    position: absolute;
                    width: 165px;
                    line-height: 20px;
                  "
                  >{{ $t("h.formTips8") }}</span
                >
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <div class="box2_foot">
          <el-button @click="voucherPrintDialogVisible = false">{{
            $t("h.cancelBtn")
          }}</el-button>
          <el-button type="primary" @click="startPrint">{{
            $t("h.confirmBtn")
          }}</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { printPost, printGet, select, update } from "@/assets/api";
import { createVoucherTags } from "@/utils/getBillTemplate";
export default {
  data() {
    return {
      voucherPrintDialogVisible: false,
      // 枚举到的打印机
      printerSymbol: [],
      //   打印机详情
      printerName: "",
      printerType: "",
      //   打印图片
      pagMultipleSelection: [],
      //  打印参数
      printForm: {
        printName: "",
        printNum: "",
        moban: null,
        transverse: "",
        longitudinal: "",
      },
      printFormRules: {
        printName: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips1"),
            trigger: "change",
          },
        ],
        moban: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips19"),
            trigger: "change",
          },
        ],
      },
      //   模板
      // voucherTemplate: [],
      //折叠层数
      activeNames: ["1"],
      // 获取打印下拉选中的下标
      ListIndex: "",
      //打印机Key值
      facilityKey: "",
      //打印机DPI
      printerDpi: "",
      //传给打印机的主体数据
      body: {
        printLab: [],
      },
      //用于拼接数组
      NUMList: [],
      // 加载标识
      loading: false,
      refreshLoading: false,
      // 分页
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 定时器
      timer: null,
    };
  },
  watch: {
    "printForm.printName"(newVal) {
      if (newVal != "") {
        this.loading = true;
        if (this.facilityKey) {
          printGet({ code: 3, key: this.facilityKey })
            .then((result) => {
              this.facilityKey = "";
              printGet({
                code: 2,
                devType: "ESCP",
                param: newVal,
              })
                .then((result) => {
                  this.facilityKey = result.data;
                  window.localStorage.setItem(
                    "voucherFacilityKey",
                    result.data
                  );
                  this.getPrinterState(3);
                })
                .catch((err) => {
                  this.loading = false;
                  return this.$message(this.$t("h.tips53"));
                });
            })
            .catch((err) => {
              this.$message.error(this.$t("h.tips54"));
              printGet({
                code: 2,
                devType: "ESCP",
                param: newVal,
              })
                .then((result) => {
                  this.facilityKey = result.data;
                  window.localStorage.setItem(
                    "voucherFacilityKey",
                    result.data
                  );
                  this.getPrinterState(3);
                })
                .catch((err) => {
                  this.loading = false;
                  return this.$message(this.$t("h.tips53"));
                });
            });
        } else {
          printGet({
            code: 2,
            devType: "ESCP",
            param: newVal,
          })
            .then((result) => {
              this.facilityKey = result.data;
              window.localStorage.setItem("voucherFacilityKey", result.data);
              this.getPrinterState(3);
            })
            .catch((err) => {
              this.loading = false;
              return this.$message(this.$t("h.tips53"));
            });
        }
      }
    },
  },
  props: {
    voucherData: {
      type: Array,
      default() {
        return [];
      },
    },
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    voucherPrintTemplate: {
      type: Array,
      default() {
        return [];
      },
    },
    locationName: {
      type: String,
    },
  },
  methods: {
    closedVoucherPrinter() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.total = 0;
      this.printerSymbol = [];
      this.pagMultipleSelection = [];
      if (this.facilityKey) this.closePrintServer(this.facilityKey);
    },
    // 关闭打印机服务
    closePrintServer(key) {
      printGet({ code: 3, key: key })
        .then((result) => {
          this.printForm.printName = "";
          this.$message.success(this.$t("h.tips57"));
        })
        .catch((err) => {
          this.printForm.printName = "";
          this.$message.error(this.$t("h.tips57"));
        });
    },
    // 清除打印机选项
    printSelectClear() {
      this.closePrintServer(this.facilityKey);
    },
    // 打开dialog枚举打印机
    async openVoucherPrinter() {
      this.loading = true;
      const voucherFacilityKey =
        window.localStorage.getItem("voucherFacilityKey");
      if (voucherFacilityKey) printGet({ code: 3, key: voucherFacilityKey });
      this.printForm.moban = parseInt(
        window.localStorage.getItem(this.locationName)
      );
      const tagItem = this.voucherPrintTemplate.find((item) => {
        return item._id == this.printForm.moban;
      });
      for (let i = 0; i < this.voucherData.length; i++) {
        if (!this.voucherPrintDialogVisible) {
          this.printerSymbol = [];
          this.pagMultipleSelection = [];
          break;
        }
        await this.createVoucherTemplate(i, tagItem);
      }
      printGet({ code: 1 })
        .then((result) => {
          const a = new RegExp("MDL:");
          const b = new RegExp("CMD:");
          const filterPrinterName = [];
          for (let i = 0; i < result.data.symbol.length; i++) {
            const str = this.SplitDemo(result.data.symbol[i]);
            filterPrinterName.push(str);
            if (
              filterPrinterName[i][2].indexOf("DS") != -1 ||
              filterPrinterName[i][2].indexOf(" DS") != -1
            ) {
              this.printerName = filterPrinterName[i][2].replace(a, "");
              const TypeStr = filterPrinterName[i][1];
              this.printerType = TypeStr.replace(b, "");
              this.printerSymbol.push({
                name: this.printerName,
                value: result.data.symbol[i],
                deType: this.printerType,
              });
            }
          }
        })
        .catch((error) => {
          if (error.response == undefined) {
            this.$confirm(this.$t("h.tips61"), this.$t("h.title18"), {
              confirmButtonText: this.$t("h.confirmBtn"),
              cancelButtonText: this.$t("h.cancelBtn"),
              type: "warning",
            })
              .then(() => {
                const link = document.createElement("a");
                const url = "//120.197.55.79:6180/Release.zip";
                link.style.display = "none";
                link.href = url;
                link.setAttribute("Release.zip", name);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: this.$t("h.tips62"),
                });
              });
          } else if (error.response.status == 400) {
            return this.$notify.error({
              title: this.$t("h.title27"),
              message: this.$t("h.tips63"),
            });
          } else {
            return this.$notify.error({
              title: this.$t("h.title27"),
              message:
                this.$t("h.title27") + "," + this.$t("h.restartThePrinter"),
            });
          }
        });
    },
    refreshPrinter() {
      this.refreshLoading = true;
      if (this.facilityKey) this.closePrintServer(this.facilityKey);
      this.printForm.printName = "";
      this.printerName = "";
      this.printerType = "";
      this.printerSymbol = [];
      printGet({ code: 1 })
        .then((result) => {
          const a = new RegExp("MDL:");
          const b = new RegExp("CMD:");
          const filterPrinterName = [];
          for (let i = 0; i < result.data.symbol.length; i++) {
            const str = this.SplitDemo(result.data.symbol[i]);
            filterPrinterName.push(str);
            if (
              filterPrinterName[i][2].indexOf("DS") != -1 ||
              filterPrinterName[i][2].indexOf(" DS") != -1
            ) {
              this.printerName = filterPrinterName[i][2].replace(a, "");
              const TypeStr = filterPrinterName[i][1];
              this.printerType = TypeStr.replace(b, "");
              this.printerSymbol.push({
                name: this.printerName,
                value: result.data.symbol[i],
                deType: this.printerType,
              });
            }
          }
          this.refreshLoading = false;
          this.$message.success(this.$t("h.formTips1") + this.$t("h.tips64"));
        })
        .catch((error) => {
          this.refreshLoading = false;
          if (error.response == undefined) {
            this.$confirm(this.$t("h.tips61"), this.$t("h.title18"), {
              confirmButtonText: this.$t("h.confirmBtn"),
              cancelButtonText: this.$t("h.cancelBtn"),
              type: "warning",
            })
              .then(() => {
                const link = document.createElement("a");
                const url = "//120.197.55.79:6180/Release.zip";
                link.style.display = "none";
                link.href = url;
                link.setAttribute("Release.zip", name);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: this.$t("h.tips62"),
                });
              });
          } else if (error.response.status == 400) {
            return this.$notify.error({
              title: this.$t("h.title27"),
              message: this.$t("h.tips63"),
            });
          } else {
            return this.$notify.error({
              title: this.$t("h.title27"),
              message:
                this.$t("h.tips60") + "," + this.$t("h.restartThePrinter"),
            });
          }
        });
    },
    //对字符串进行分割，只显示及型号
    SplitDemo(a) {
      // 在每个;处进行分解。
      let ss = a.split(";");
      return ss;
    },
    // 获取单据打印模板
    // async getVoucherTempTag() {
    //   const { data: res } = await select({
    //     func: 'S0034',
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       type: 'LY',
    //     },
    //   }).catch((err) => {
    //     return this.$message.error('获取单据模板失败')
    //   })
    //   if (res.code != 0) return this.$message.error(res.data)
    //   this.voucherTemplate = res.data
    // },
    // 切换模板
    async templateSelectChange(val) {
      const tagItem = this.voucherPrintTemplate.find((item) => {
        return item._id == val;
      });
      this.pagMultipleSelection = [];
      for (let i = 0; i < this.voucherData.length; i++) {
        if (!this.voucherPrintDialogVisible) {
          this.printerSymbol = [];
          this.pagMultipleSelection = [];
          break;
        }
        await this.createVoucherTemplate(i, tagItem);
      }
    },
    // 选中打印机
    printerSelectChange() {
      let proNum = this.printerSymbol.findIndex((item, index) => {
        this.ListIndex = index;
      });
    },
    // 请求设备状态
    getPrinterState(id) {
      // 4/2/
      printGet({ code: 4, param: parseInt(id), key: this.facilityKey })
        .then((result) => {
          if (id == 3) {
            const DPI = result.data.DeviceDPI;
            if (DPI == null || DPI == undefined || DPI == "") {
              this.printerDpi = 203;
            } else {
              this.printerDpi = DPI;
            }
            this.loading = false;
            this.$message.success("设备打开成功");
          } else if (id == 0) {
            // console.log('打印过程中的信息--->', result.data)
          } else if (id == 1) {
            // console.log('打印结果信息--->', result.data)
          }
        })
        .catch((err) => {
          this.loading = false;
          return err;
        });
    },
    // 开始打印
    startPrint() {
      this.$refs["printFormRef"].validate(async (valid) => {
        if (!valid) return false;
        this.loading = true;
        for (let i = 0; i < this.pagMultipleSelection.length; i++) {
          this.body.printLab[i] = {
            tag: 8,
            printDpi: parseInt(this.printerDpi), //打印机的DPI
            xOffset: parseInt(this.printForm.transverse), //横向位置偏移，单位：mm
            yOffset: parseInt(this.printForm.longitudinal), //纵向位置偏移，单位：mm
            epcSect: "",
            userSect: "",
            resvSect: "",
            lockSect: "",
            datEncode: "Base64", //"Base64","Hex","String"
            datFmt: "Img", //"Img","Text","Dat"
            prnDats: this.pagMultipleSelection[i].split(",")[1],
          };
        }
        this.NUMList = this.body.printLab;
        if (this.printForm.printNum > 1) {
          for (let i = 0; i < this.printForm.printNum; i++) {
            this.body.printLab = this.body.printLab.concat(this.NUMList);
          }
        }
        // 检测是否缺纸
        printGet({ code: 4, param: 3, key: this.facilityKey })
          .then((result) => {
            if (result.data.statInfo.devStat != "Ok") {
              this.loading = false;
              this.$notify.error({
                title: this.$t("h.title27"),
                message: this.$t("h.tips103"),
              });
            } else {
              printPost(
                "post",
                {
                  key: this.facilityKey,
                  sendCode: "1",
                },
                this.base64Encode(JSON.stringify(this.body))
              )
                .then((result) => {
                  this.loading = false;
                  this.body.printLab = [];
                  this.$notify.success({
                    title: this.$t("h.title36"),
                    message: this.$t("h.tips104"),
                  });
                })
                .catch((err) => {
                  this.loading = false;
                  this.$message.error(this.$t("h.tips105"));
                  this.body.printLab = [];
                });
            }
          })
          .catch((err) => {
            this.loading = false;
            return this.$message.error(this.$t("h.tips106"));
          });
      });
    },
    //字符串转base64
    base64Encode(input) {
      var rv;
      rv = encodeURIComponent(input);
      rv = unescape(rv);
      rv = window.btoa(rv);
      return rv;
    },
    // 渲染模板
    async createVoucherTemplate(i, dataJSON) {
      const canvas = document.createElement("canvas");
      let printAssetData = [];
      if (this.locationName != "receivedTemplateId") {
        const { data: res } = await select({
          func: "S0007",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            // _id: this.voucherData[i].assetIds,
            item: [
              {
                key: "_id",
                handle: "OIS",
                value: this.voucherData[i].assetIds,
              },
            ],
          },
        }).catch((err) => err);
        if (res.code != 0) {
          this.loading = false;
          return this.$message.error(this.$t("h.tips107"));
        }
        printAssetData = res.data;
      } else printAssetData = this.voucherData[i].asset;
      const tableLength = printAssetData.length;
      let length = 1;
      if (tableLength > 7) {
        length = parseInt(tableLength / 7);
        if (tableLength % 7 !== 0) ++length;
        const arr = this.sliceIntoChunks(printAssetData, 7);
        for (let j = 0; j < length; j++) {
          const base64 = await createVoucherTags(
            canvas,
            dataJSON,
            true,
            this.voucherData[i],
            arr[j]
          );
          this.pagMultipleSelection.push(base64);
        }
      } else {
        const base64 = await createVoucherTags(
          canvas,
          dataJSON,
          true,
          this.voucherData[i],
          printAssetData
        );
        this.pagMultipleSelection.push(base64);
      }
      this.loading = false;
    },
    sliceIntoChunks(arr, chunkSize) {
      const res = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
      }
      return res;
    },
    // 分页功能
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
  created() {
    // this.getVoucherTempTag()
  },
  destroyed() {
    // clearInterval(this.timer)
  },
};
</script>
<style lang="scss" scoped>
::v-deep .vPrintDialog {
  .el-dialog__title {
    margin-top: 17px;
    margin-left: 81px;
    font-family: Microsoft YaHei;
    font-weight: 700;
    font-size: 16px;
    color: #1c1c28;
  }
  .el-dialog__header {
    height: 50px;
    padding: 0;
    box-sizing: border-box;
    padding-top: 13px;
    .el-dialog__headerbtn {
      font-size: 24px;
      color: #abaaaa;
      top: 12px;
    }
  }
  .el-dialog__body {
    width: calc(100% - 50px);
    height: calc(100% - 50px);
    padding: 0 0 0 50px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    .box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .box-1 {
        position: relative;
        width: calc(100% - 500px);
        height: 100%;
        background: #ebeced;
        padding: 20px 20px 60px 20px;
        box-sizing: border-box;
        overflow: hidden;
        .tags {
          height: 100%;
          overflow: auto;
          box-sizing: border-box;
          .el-col {
            text-align: center;
          }
          .el-row {
            margin: 0 !important;
            box-sizing: border-box !important;
          }
        }
        .pag {
          position: absolute;
          bottom: 15px;
          right: 30px;
        }
        ::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
          height: 10px;
        }
        ::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 4px;
          // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: rgba(144, 147, 153, 0.6);
        }
        ::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          background: #ededed;
          margin: 5px 0;
        }
      }
      .box-2 {
        width: 500px;
        height: 100%;
        position: relative;
        overflow: hidden;
        border-top: 1px solid #eceff6;
        padding-top: 34px;
        box-sizing: border-box;
        .el-form {
          height: calc(100% - 100px);
          overflow: auto;
          .el-form-item__label {
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #303133;
          }
          .el-collapse-item__header {
            font-weight: bold;
            color: #000000;
          }
        }
        .box2_foot {
          width: 100%;
          position: absolute;
          right: 50%;
          bottom: 45px;
          transform: translate(50%);
          text-align: center;
          .el-button:nth-of-type(1) {
            width: 100px;
            margin-right: 40px;
            color: #999999;
            border: 1px solid #999999;
            border-radius: 2px;
            box-sizing: border-box;
          }
          .el-button:nth-of-type(2) {
            width: 100px;
            margin-left: 40px;
            background: #473bb4;
            border-radius: 2px;
            box-sizing: border-box;
          }
        }
        .el-collapse {
          margin: 0px 15px 0 32px;
        }
        // 打印机详情图标
        .printerInfoIcon {
          vertical-align: middle;
          margin-left: 14px;
        }
        // 箭头
        .el-collapse-item__arrow {
          font-weight: bold;
          color: #cdcdcd;
        }
      }
    }
  }
}
.refresh_icon {
  transition: all 1s;
  margin-left: 5px;
  cursor: pointer;
  font-size: 26px;
  vertical-align: middle;
  color: #4e42b7;
}
</style>
