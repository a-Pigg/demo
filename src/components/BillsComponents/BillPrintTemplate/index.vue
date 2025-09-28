<template>
  <el-dialog
    :title="title"
    custom-class="printTempDialog"
    :visible.sync="printTempDialogVisible"
    top="0"
    @opened="applyPrintTemplate"
    @closed="printTemplateImgList = []"
  >
    <el-row class="imgRow" :gutter="10">
      <el-col
        :xs="24"
        :sm="24"
        :lg="8"
        v-for="(item, i) in printTemplateImgList"
        :key="i"
      >
        <div class="tempBox" @click="selectTempalte(item.id)">
          <el-image :src="item.base64"></el-image>
          <div class="mask"></div>
          <div class="radioBox" v-show="item.id == selectId">
            <i class="el-icon-check"></i>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { createVoucherTags } from "@/utils/getBillTemplate";
export default {
  data() {
    return {
      printTempDialogVisible: false,
      printTemplateImgList: [],
    };
  },
  props: {
    //模板
    voucherPrintTempList: {
      type: Array,
      default() {
        return [];
      },
    },
    //标题
    title: {
      type: String,
      default: "单据模板",
    },
    //模板id
    selectId: {
      type: [String, Number],
    },
  },
  methods: {
    selectTempalte(id) {
      this.$emit("setVoucherTag", id);
    },
    async applyPrintTemplate() {
      console.log('打开模板')
      let canvas = document.createElement("CANVAS");
      for (let i = 0; i < this.voucherPrintTempList.length; i++) {
        if (!this.printTempDialogVisible) {
          this.printTemplateImgList = [];
          break;
        }
        const base64 = await createVoucherTags(
          canvas,
          this.voucherPrintTempList[i],
          false
        );
        let obj = {};
        obj.base64 = base64;
        obj.id = this.voucherPrintTempList[i]._id;
        this.printTemplateImgList.push(obj);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .printTempDialog {
  width: 80%;
  height: 90%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-42%, -50%);
  margin: 0;
  border-radius: 6px;
  .el-dialog__title {
    margin-left: 30px;
    font-family: Microsoft YaHei;
    font-weight: 700;
    font-size: 16px;
    color: #1c1c28;
  }
  .el-dialog__header {
    height: 55px;
    padding: 0;
    box-sizing: border-box;
    padding-top: 18px;
    border-bottom: 2px solid #eeeeee;
    .el-dialog__headerbtn {
      font-size: 24px;
      color: #abaaaa;
      top: 12px;
    }
  }
  .tempBox {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 0px 20px 0px rgba(17, 10, 80, 0.2);
    position: relative;
    .mask {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(2, 29, 87, 0.2);
      z-index: 2;
      &:hover {
        opacity: 1;
      }
    }
    .radioBox {
      opacity: 1;
      position: absolute;
      top: 15px;
      left: 15px;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      border: 2px solid #668eff;
      background: #668eff;
      text-align: center;
      line-height: 20px;
      i {
        font-weight: bold;
        color: #fff;
      }
    }
    ::v-deep .el-image {
      img {
        vertical-align: middle;
      }
    }
  }
  .el-dialog__body {
    padding: 30px !important;
    height: calc(100% - 140px);
    overflow: auto;
    .el-col {
      margin-bottom: 20px;
      &:last-of-type {
        margin-bottom: 0px !important;
      }
    }
  }
}
</style>
