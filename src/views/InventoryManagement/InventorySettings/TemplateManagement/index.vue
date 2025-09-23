<template>
  <div class="TemplateManagement">
    <el-card class="template-card">
      <div slot="header" class="template-card-header">
        <span>{{ $t("h.title200") }}</span>
      </div>
      <div class="template-card-content" v-loading="templateLoading">
        <el-row>
          <el-col :xs="24" :sm="12" :lg="8">
            <div class="grid-content">
              <div class="pedding-add-asset" @click="addInventoryTempalte">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </el-col>
          <el-col
            :xs="24"
            :sm="12"
            :lg="8"
            v-for="(item, index) in printTemplates"
            :key="item._id"
          >
            <div class="grid-content" @click="checkInventoryTemplate(item._id)">
              <img :src="item.base" class="template-img" />
              <div class="mask-box"></div>
              <button
                class="check-tempalate-btn"
                v-show="inventoryTemaplateId == item._id"
              >
                <i class="el-icon-check"></i>
              </button>
              <button
                class="delete-template-btn"
                v-show="item._id > 7"
                @click.stop="deleteInventoryTemplate(item._id)"
              >
                <i class="el-icon-close"></i>
              </button>
              <button
                class="edit-template-btn"
                v-show="item.edit"
                @click.stop="editInventoryTemplate(index)"
              >
                <i class="el-icon-edit"></i>
              </button>
            </div>
            <div class="title">
              <span>{{ item.title }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <draw-printed-pictures
      :customDialogVisible.sync="customDialogVisible"
      :step.sync="step"
      :tableData="templateItem"
      :templateType="1"
      @closed="customDialogVisibleClosed"
      @refreshTags="getInventoryTemplates"
      :dataList="dataList"
    ></draw-printed-pictures>
  </div>
</template>
<script>
import DrawPrintedPictures from "@/components/DrawPrintedPictures";
import { getCanvasTemplate } from "@/utils/getAssetTemplate";
import { dataToPrintImg } from "@/utils/dataToPrintImage";
import { deleteData, select } from "@/assets/api";
import { mapState } from "vuex";
export default {
  components: {
    DrawPrintedPictures,
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  data() {
    return {
      customDialogVisible: false,
      step: false,
      templateItem: {},
      templateLoading: false,
      printTemplates: [],
      inventoryTemaplateId: null,
      inventoryTemplates: [],
      dataList: [
        { nameShow: this.$t("h.title166"), dbDataName: "code" },
        { nameShow: this.$t("h.formTips38"), dbDataName: "name" },
        { nameShow: this.$t("h.formTips63"), dbDataName: "barCode" },
        { nameShow: this.$t("h.formTips55"), dbDataName: "sorting" },
        { nameShow: this.$t("h.title198"), dbDataName: "logo" },
        { nameShow: this.$t("h.columns27"), dbDataName: "specification" },
        { nameShow: this.$t("h.columns28"), dbDataName: "measureUnit" },
        { nameShow: this.$t("h.columns70"), dbDataName: "price" },
        { nameShow: this.$t("h.columns57"), dbDataName: "lowerSize" },
        { nameShow: this.$t("h.columns58"), dbDataName: "upperSize" },
        { nameShow: this.$t("h.comment"), dbDataName: "remark" },
      ],
    };
  },
  methods: {
    // 资产打印模版
    customDialogVisibleClosed() {
      this.templateItem = {};
      this.step = false;
    },
    // 获取模板数据
    getInventoryTemplates() {
      this.templateLoading = true;
      this.inventoryTemaplateId = window.localStorage.getItem(
        "inventoryTemaplateId"
      );
      select({
        func: "S0019",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          type: 1,
        },
      })
        .then(async ({ data }) => {
          this.templateLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          if (data.data && data.data.length) {
            this.inventoryTemplates = data.data;
            if (
              !data.data.some((item) => item._id == this.inventoryTemaplateId)
            ) {
              this.inventoryTemaplateId = data.data[0]._id;
              localStorage.setItem(
                "inventoryTemaplateId",
                this.inventoryTemaplateId
              );
            }
            this.printTemplates = [];
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].html) {
                // 1.新方式
                let element = document.createElement("div");
                element.style.position = "fixed";
                element.style.top = "-10000px";
                document.body.appendChild(element);
                let base64 = await dataToPrintImg(
                  data.data[i],
                  element,
                  undefined
                );
                document.body.removeChild(element);
                this.printTemplates.push({
                  _id: data.data[i]._id,
                  base: base64,
                  title: data.data[i].name,
                  edit: true,
                });
              } else {
                // 2.旧方式
                let canvas = document.createElement("CANVAS");
                let tagItemInfo = await getCanvasTemplate(
                  data.data[i],
                  canvas,
                  undefined,
                  false
                );
                tagItemInfo._id = data.data[i]._id;
                tagItemInfo.edit = data.data[i].false;
                this.printTemplates.push(tagItemInfo);
              }
            }
          }
        })
        .catch(() => {
          this.templateLoading = false;
          // 服务器网络异常，请求资产打印模版异常
          this.$message.error(this.$t("h.tips18"));
        });
    },
    //添加新模板
    addInventoryTempalte() {
      this.customDialogVisible = true;
    },
    // 选择模板
    checkInventoryTemplate(_id) {
      this.inventoryTemaplateId = _id;
      window.localStorage.setItem("inventoryTemaplateId", _id);
    },
    //删除模板
    deleteInventoryTemplate(_id) {
      if (_id == this.inventoryTemaplateId) {
        return this.$notify.error({
          title: this.$t("h.title27"),
          message: this.$t("h.tips266"),
        });
      }
      if (_id <= 7) {
        return this.$notify.error({
          title: this.$t("h.title27"),
          message: this.$t("h.drawLabelComponents77"),
        });
      }
      this.$confirm(this.$t("h.drawLabelComponents78"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          this.templateLoading = true;
          deleteData({
            func: "D0018",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              _id: _id,
              permissonId: 57,
              type: 1,
            },
          })
            .then(({ data }) => {
              if (data.code != 0) {
                this.templateLoading = false;
                return this.$message.error(data.data);
              }
              this.getInventoryTemplates();
              this.$message.success(data.data);
            })
            .catch(() => {
              this.templateLoading = false;
              // 服务器网络错误，删除打印资产模版失败
              this.$message.error(this.$t("h.tips18"));
            });
        })
        .catch(() => {
          this.$message.info(this.$t("h.tips98"));
        });
    },
    // 修改模板
    editInventoryTemplate(index) {
      this.templateItem = this.inventoryTemplates[index];
      this.customDialogVisible = true;
      this.step = true;
    },
  },
  created() {
    this.getInventoryTemplates();
  },
};
</script>
<style lang="scss" scoped>
.template-card {
  padding: 0 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  ::v-deep .el-card__header {
    padding: 0;
    height: 60px;
    border: none;
  }
  ::v-deep .el-card__body {
    padding: 0;
    height: calc(100% - 60px);
  }
}
.template-card-header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  font-weight: bold;
  font-size: 18px;
}
.template-card-content {
  margin: 10px 0;
  height: calc(100% - 20px);
  overflow: auto;
  .grid-content {
    position: relative;
    padding: 10px;
    margin-bottom: 10px;
    height: 280px;
    overflow: hidden;
    border-radius: 2px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      .mask-box {
        opacity: 1;
      }
    }
    .template-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 5px;
      box-shadow: 0px 0px 8px 0px rgba(10, 10, 10, 0.2);
    }
    .mask-box {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      opacity: 0;
      background: rgba(2, 29, 87, 0.2);
      transition: opacity 0.3s;
      -webkit-transition: opacity 0.3s; /* Safari */
    }
    .check-tempalate-btn {
      position: absolute;
      top: 8px;
      left: 10px;
      z-index: 2;
      outline: none;
      border: none;
      border-radius: 50%;
      background-color: #588ab9;
      .el-icon-check {
        padding: 4px;
        font-size: 18px;
        color: #fff;
      }
    }
    .delete-template-btn {
      position: absolute;
      top: 8px;
      right: 10px;
      z-index: 2;
      outline: none;
      background-color: transparent;
      border: none;
      border-radius: 5px;
      transition: all 0.25s;
      .el-icon-close {
        transition: all 0.25s;
        padding: 4px;
        border-radius: 5px;
        font-size: 18px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        text-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
      }
      .el-icon-close:hover {
        border-radius: 50%;
        background: #d84d4e;
      }
    }
    .edit-template-btn {
      position: absolute;
      top: 8px;
      right: 40px;
      z-index: 2;
      outline: none;
      background-color: transparent;
      border: none;
      border-radius: 5px;
      transition: all 0.25s;
      .el-icon-edit {
        transition: all 0.25s;
        padding: 4px;
        border-radius: 5px;
        font-size: 18px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        text-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
      }
      .el-icon-edit:hover {
        border-radius: 50%;
        background: #588ab9;
      }
    }
    .pedding-add-asset {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border-radius: 5px;
      box-shadow: 0px 0px 8px 0px rgba(10, 10, 10, 0.2);
      color: #588ab9;
      font-size: 36px;
    }
  }
  .title {
    height: 25px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
}
</style>
