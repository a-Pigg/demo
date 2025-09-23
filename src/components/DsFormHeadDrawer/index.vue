<template>
  <div class="formHeadDrawer">
    <el-button type="text" size="small" @click="openFormHeadDrawer">
      <i class="el-icon-edit" />
    </el-button>
    <el-drawer
      v-loading="drawerLoading"
      :title="$t('h.title05')"
      :size="550"
      :visible.sync="setFormDrawerVisible"
      direction="rtl"
      @open="setFormDrawerVisibleOpen"
      @closed="setFormDrawerVisibleClosed"
    >
      <div class="system-area">
        <div class="system-area-form">
          <el-form
            ref="assetHeaderFormRef"
            :model="assetHeaderForm"
            :rules="assetHeaderFormRules"
            label-width="140px"
          >
            <el-form-item
              v-for="item in tempAssetFormHeader"
              :key="item.dbDataName"
              :label="item.nameShow"
              :prop="item.dbDataName"
            >
              <el-input
                :placeholder="item.nameShow"
                size="mini"
                v-model.trim="assetHeaderForm[item.dbDataName]"
              ></el-input>
              <i
                v-if="item.dbDataName.length == 32"
                class="el-icon-circle-close"
                @click="deleteCustomSection(item.dbDataName)"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="custom-area">
        <h5>{{ $t("h.title06") }}</h5>
        <div class="custom-area-tag">
          <ds-default-page
            v-if="!addCustomKeys.length"
            :defaultPageTips="$t('h.tips190')"
          ></ds-default-page>
          <template v-else>
            <el-tag
              v-for="item in addCustomKeys"
              :key="item"
              size="medium"
              effect="dark"
              closable
              @close="customTagClose(item)"
            >
              {{ item }}
            </el-tag>
          </template>
        </div>
        <div class="custom-area-btn">
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('h.title06')"
            placement="top"
          >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              circle
              @click="customFormShow = !customFormShow"
            ></el-button>
          </el-tooltip>
          <transition name="slide-fade">
            <el-input
              v-show="customFormShow"
              v-model.trim="customNameValue"
              size="mini"
              :placeholder="$t('h.tips3') + $t('h.customFieldName')"
            >
              <el-button
                type="text"
                slot="suffix"
                size="mini"
                @click="saveCustomValue"
                >{{ $t("h.saveBtn") }}</el-button
              >
            </el-input>
          </transition>
        </div>
      </div>
      <div class="btn">
        <el-button type="primary" size="samll" @click="submitUserCustomForm">{{
          $t("h.saveBtn")
        }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { update } from "@/assets/api";
import deepCopy from "@/utils/deepCopy";
import DsDefaultPage from "@/components/DsDefaultPage";
export default {
  name: "DsFormHeadDrawer",
  components: { DsDefaultPage },
  data() {
    return {
      drawerLoading: false,
      setFormDrawerVisible: false,
      customFormShow: false,
      assetHeaderForm: {},
      assetHeaderFormRules: {},
      tempAssetFormHeader: [],
      customNameValue: "",
      deleteCustomKeys: [],
      addCustomKeys: [],
    };
  },
  computed: {
    ...mapState(["assetFormHeader", "userInfo"]),
  },
  methods: {
    ...mapActions(["GET_ASSETFORMHEADER", "GET_ASSETTABLEHEADER"]),
    openFormHeadDrawer() {
      this.setFormDrawerVisible = true;
    },
    setFormDrawerVisibleOpen() {
      this.tempAssetFormHeader = deepCopy(this.assetFormHeader);
    },
    setFormDrawerVisibleClosed() {
      this.assetHeaderForm = {};
      this.tempAssetFormHeader = [];
      this.customFormShow = false;
      this.customNameValue = "";
      this.deleteCustomKeys = [];
      this.addCustomKeys = [];
    },
    deleteCustomSection(keyName) {
      this.$confirm(this.$t("h.tips97"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          this.deleteCustomKeys.push(keyName);
          this.tempAssetFormHeader.splice(
            this.tempAssetFormHeader.findIndex(
              (item) => item.dbDataName == keyName
            ),
            1
          );
          this.$delete(this.assetHeaderForm, keyName);
          // this.assetTableHead.splice(
          //   this.assetTableHead.findIndex((item) => item.dbDataName == keyName),
          //   1
          // );
          // this.$delete 删除对象属性
          // this.$delete(this.assetTableHeadForm, keyName);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("h.tips98"),
          });
        });
    },
    saveCustomValue() {
      if (!this.customNameValue) {
        return this.$message.error(this.$t("h.tips99"));
      }
      for (let i = 0; i < this.addCustomKeys.length; i++) {
        if (this.customNameValue == this.addCustomKeys[i]) {
          this.customNameValue = "";
          return this.$message.error(this.$t("h.tips100"));
        }
      }
      this.addCustomKeys.push(this.customNameValue);
      this.customNameValue = "";
    },
    customTagClose(customName) {
      this.addCustomKeys.splice(this.addCustomKeys.indexOf(customName), 1);
    },
    async submitUserCustomForm() {
      this.drawerLoading = true;
      let alias = [];
      for (let key in this.assetHeaderForm) {
        let obj = {};
        obj.nameShow = this.assetHeaderForm[key];
        obj.dbDataName = key;
        alias.push(obj);
      }
      if (
        !alias.length &&
        !this.addCustomKeys.length &&
        !this.deleteCustomKeys.length
      ) {
        this.drawerLoading = false;
        return;
      }
      const { data: res } = await update({
        func: "U0027",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          alias: alias,
          value: this.deleteCustomKeys.join(","),
          key: this.addCustomKeys.join(","),
          permissonId: 26,
        },
      });
      this.drawerLoading = false;
      if (res.code != 0) return this.$message.error(res.data);
      await this.GET_ASSETFORMHEADER();
      await this.GET_ASSETTABLEHEADER(
        sessionStorage.getItem("loginCompanyName")
      );
      this.$emit("updateTable");
      this.$emit("updateHighFilter");
      this.$message.success(res.data);
      this.setFormDrawerVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-drawer {
  .el-drawer__header {
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }
  .system-area {
    width: 100%;
    height: calc(100% - 220px);
    .system-area-form {
      padding: 0 50px;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
    }
  }
  .custom-area {
    padding: 0 50px;
    height: 150px;
    box-sizing: border-box;
    h5 {
      // 24px
      margin-top: 10px;
      font-size: 18px;
    }
  }
  .btn {
    height: 60px;
    line-height: 60px;
    text-align: center;
    .el-button {
      width: 200px;
    }
  }
}
.custom-area-tag {
  // 98px
  height: 98px;
  overflow: auto;
  .el-tag {
    margin-right: 5px;
  }
}
::v-deep .custom-area-btn {
  display: flex;
  padding: 0 30px;
  height: 28px;
  box-sizing: border-box;
  .el-button {
    margin: 0 10px;
  }
}
.el-form-item {
  position: relative;
  .el-icon-circle-close {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 5px;
    color: #131a5c;
    &:hover {
      color: #f56c6c;
      font-weight: bold;
    }
  }
}
.el-icon-edit {
  padding: 0 5px;
  border-left: 2px solid #333;
  border-right: 2px solid #333;
  font-size: 14px;
}
.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter {
  transform: translateX(-20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
