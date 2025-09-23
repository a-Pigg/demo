<template>
  <el-dialog
    top="0"
    custom-class="dialog"
    :show-close="false"
    :visible.sync="dialogVisible"
    @opened="dialogVisibleOpened"
    @close="dialogVisibleClose"
    @closed="dialogVisibleClosed"
  >
    <div slot="title" class="dialog-header">
      <div class="left">
        <span>{{ $t("h.title15") }}</span>
      </div>
      <div class="right">
        <i class="el-icon-close" @click="dialogVisible = false"></i>
      </div>
    </div>
    <div class="dialog-body">
      <el-tabs v-model="activeName" tab-position="left" style="height: 100%">
        <el-tab-pane :label="$t('h.basicInformation')" name="base">
          <div class="tab-pane-titel">
            <span>{{ $t("h.basicInformation") }}</span>
          </div>
          <div class="tab-pane-content">
            <el-row :gutter="20">
              <el-col
                v-for="(item, index) in billFormDetail"
                :key="index"
                :span="item.span"
                :class="item.class"
              >
                {{ item.val }}
              </el-col>
            </el-row>
          </div>
          <div class="tab-pane-titel">
            <span>{{ $t("h.List") }}</span>
            <el-button
              v-show="print"
              type="text"
              style="margin-left: 10px"
              @click="printAssetCard"
              >{{ $t("h.printLabelBtn") }}</el-button
            >
          </div>
          <div class="tab-pane-table">
            <slot name="table" />
          </div>
          <div class="tab-pane-pagination">
            <slot name="pagination"></slot>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('h.auditInformation')"
          name="audit"
          v-if="audit"
        >
          <el-timeline>
            <el-timeline-item v-for="(item, index) in auditStep" :key="index">
              <div class="audit-info" v-if="item.state == 'pedding'">
                <div class="audit-staff">
                  <img src="@/assets/images/head-portrait.png" alt="" />
                  <span>{{ item.auditStaffName }}</span>
                  <i :class="'icon el-icon-' + item.auditState"></i>
                </div>
                <div class="popconfirm">
                  <h5 v-if="item.auditState == 'success'">
                    {{ $t("h.agree") }}
                  </h5>
                  <h5 v-if="item.auditState == 'error'">
                    {{ $t("h.reject") }}
                  </h5>
                  <h5 v-if="item.auditState == 'more'">
                    {{ $t("h.PendingApproval") }}
                  </h5>
                  <span>{{ item.message }}</span>
                </div>
              </div>
              <span v-else>{{ $t("h.end") }}</span>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      activeName: "base",
    };
  },
  props: {
    billDetailDialogVisible: {
      type: Boolean,
      default: false,
    },
    billFormDetail: {
      type: Array,
      default: () => [],
    },
    audit: {
      type: Boolean,
      default: true,
    },
    auditStep: {
      type: Array,
      default: () => [],
    },
    print: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.billDetailDialogVisible;
      },
      set(val) {
        this.$emit("update:billDetailDialogVisible", val);
      },
    },
  },
  methods: {
    dialogVisibleOpened() {
      this.$emit("opened");
    },
    dialogVisibleClose() {
      document.querySelector(".el-tabs__content").scrollTop = 0;
    },
    dialogVisibleClosed() {
      this.activeName = "base";
      this.$emit("closed");
    },
    printAssetCard() {
      console.log(this.billFormDetail);
      this.$emit("print");
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: 1200px;
  height: calc(100% - 150px);
  border-radius: 6px;
  overflow: hidden;
  .el-dialog__header {
    padding: 0;
  }
  .dialog-header {
    padding: 0 10px 0 20px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    box-sizing: border-box;
    font-size: 17px;
    font-weight: bold;
    .el-icon-close:hover {
      color: #588ab9;
      cursor: pointer;
    }
  }
  .el-dialog__body {
    padding: 0;
    height: calc(100% - 36px);
  }
  .dialog-body {
    padding: 14px;
    height: 100%;
    box-sizing: border-box;
  }
}
::v-deep .el-tabs__content {
  padding: 8px;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  .el-tab-pane {
    height: 100%;
  }
}
.tab-pane-titel {
  position: relative;
  padding: 0 10px;
  font-size: 16px;
}
.tab-pane-titel::before {
  position: absolute;
  top: 4px;
  left: 0px;
  content: "";
  width: 4px;
  height: 16px;
  background-color: #588ab9;
}
.tab-pane-content {
  margin-top: 10px;
  .el-row {
    width: calc(100% - 10px);
    .el-col {
      margin: 10px 0;
    }
    .col-title {
      height: 40px;
      line-height: 40px;
      color: #588ab9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .col-title:hover {
      white-space: normal;
      overflow: visible;
      text-overflow: inherit;
    }
    .col-content {
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      background-color: #eee;
      border-radius: 6px;
      color: #000;
    }
    .pic-title,
    .bz-title {
      height: 120px;
      color: #588ab9;
    }
    .pic-content {
      height: 120px;
    }
    .bz-content {
      height: 120px;
      background-color: #eee;
      border-radius: 6px;
      color: #000;
    }
    .el-image {
      height: 120px;
    }
  }
}
.tab-pane-table {
  margin-top: 10px;
  height: 600px;
}
.tab-pane-pagination {
  height: 40px;
}
.audit-info {
  display: flex;
  .audit-staff {
    position: relative;
    width: 50px;
    height: 69px;
    text-align: center;
    font-size: 12px;
    img {
      width: 100%;
    }
    .icon {
      position: absolute;
      top: 30px;
      right: -3px;
      font-size: 20px;
    }
    .el-icon-error {
      color: #ff5959;
    }
    .el-icon-success {
      color: #7dde57;
    }
    .el-icon-more {
      width: 20px;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      border-radius: 50%;
      color: #fff;
      background-color: #c8c8c8;
    }
  }
  .popconfirm {
    position: relative;
    margin-top: 5px;
    margin-left: 20px;
    padding: 20px;
    max-width: 500px;
    border-radius: 6px;
    box-sizing: border-box;
    background: #e8f0ff;
  }
  .popconfirm::before {
    content: "";
    position: absolute;
    top: 10px;
    left: -5px;
    transform: rotate(45deg);
    border: 8px solid #e8f0ff;
    border-right-color: transparent;
    border-top-color: transparent;
  }
}
</style>
