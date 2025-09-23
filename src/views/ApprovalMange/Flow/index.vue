<template>
  <div class="flow">
    <el-card class="flow-card">
      <div slot="header" class="flow-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button
              size="small"
              type="primary"
              @click="newBillsDialogVisible = true"
              >{{ $t("h.newBtn") }}</el-button
            >
          </ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <ds-search-btn :searchValue.sync="andLike"></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="flow-card-content" v-loading="loading">
        <div class="handle">
          <div class="title">
            <span>{{ $t("h.assetAttributes") }}</span>
          </div>
          <ul class="btns">
            <li class="btn-item border-style" @click="editAuditFlow">
              <i class="el-icon-edit"></i>
              <span>{{ $t("h.editBtn") }}</span>
            </li>
            <li class="btn-item" @click="deleteAuditFlow">
              <i class="el-icon-delete"></i>
              <span>{{ $t("h.delBtn") }}</span>
            </li>
          </ul>
        </div>
        <div class="tabs">
          <el-tabs
            tab-position="left"
            v-model="activeName"
            v-if="tables.length"
          >
            <el-tab-pane
              lazy
              v-for="item in tables"
              :key="item.goodsqId"
              :label="item.name"
              :name="item.name"
            >
              <el-row :gutter="24">
                <el-col
                  v-for="shouItem in item.showList"
                  :xs="24"
                  :sm="24"
                  :md="24"
                  :lg="24"
                  :xl="12"
                  :key="shouItem.name"
                >
                  <div class="grid-content">
                    <div class="title">
                      <span>{{ shouItem.name }}</span>
                    </div>
                    <div class="content">
                      <span>{{ $t("h.audit") }}</span>
                      <ul class="peromise">
                        <li
                          class="peromise-item"
                          v-for="permisson in shouItem.permisson"
                          :key="permisson"
                        >
                          <i class="el-icon-right"></i>
                          <div class="num-icon">
                            {{ permisson.slice(0, 1) }}
                          </div>
                          <span>{{ permisson.substr(0, 4) }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
          <el-empty v-else :description="$t('h.tips175')"></el-empty>
        </div>
      </div>
    </el-card>
    <new-bills-dialog
      class="new-bill-dialog"
      :title="newBillTitle"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @close="newBillsDialogClose"
      @sbumitForm="sbumitFlowForm"
    >
      <template slot="form">
        <el-form
          :model="flowForm"
          :rules="flowFormRules"
          ref="flowFormRef"
          label-width="108px"
        >
          <el-form-item
            class="flow-name-item"
            :label="$t('h.formTips22')"
            prop="name"
          >
            <el-input v-model="flowForm.name"></el-input>
          </el-form-item>
          <el-form-item
            class="checkbox-item"
            :label="$t('h.title240')"
            prop="storageReturnLevel"
          >
            <el-checkbox-group v-model="flowForm.storageReturnLevel">
              <el-checkbox
                v-for="permisson in levels"
                :key="permisson.value"
                :label="permisson.value"
                >{{ permisson.label }} <i class="el-icon-right"></i
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="checkbox-item"
            :label="$t('h.title241')"
            prop="storageInLevel"
          >
            <el-checkbox-group v-model="flowForm.storageInLevel">
              <el-checkbox
                v-for="permisson in levels"
                :key="permisson.value"
                :label="permisson.value"
                >{{ permisson.label }} <i class="el-icon-right"></i
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="checkbox-item"
            :label="$t('h.title242')"
            prop="storageOutLevel"
          >
            <el-checkbox-group v-model="flowForm.storageOutLevel">
              <el-checkbox
                v-for="permisson in levels"
                :key="permisson.value"
                :label="permisson.value"
                >{{ permisson.label }} <i class="el-icon-right"></i
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="checkbox-item"
            :label="$t('h.title243')"
            prop="storageAdjustLevel"
          >
            <el-checkbox-group v-model="flowForm.storageAdjustLevel">
              <el-checkbox
                v-for="permisson in levels"
                :key="permisson.value"
                :label="permisson.value"
                >{{ permisson.label }} <i class="el-icon-right"></i
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="checkbox-item"
            :label="$t('h.title244')"
            prop="storageAllotLevel"
          >
            <el-checkbox-group v-model="flowForm.storageAllotLevel">
              <el-checkbox
                v-for="permisson in levels"
                :key="permisson.value"
                :label="permisson.value"
                >{{ permisson.label }} <i class="el-icon-right"></i
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="checkbox-item"
            :label="$t('h.formTips23')"
            prop="outLevel"
          >
            <el-checkbox-group v-model="flowForm.outLevel">
              <el-checkbox
                v-for="permisson in levels"
                :key="permisson.value"
                :label="permisson.value"
                >{{ permisson.label }} <i class="el-icon-right"></i
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="checkbox-item"
            :label="$t('h.formTips24')"
            prop="scrapLevel"
          >
            <el-checkbox-group v-model="flowForm.scrapLevel">
              <el-checkbox
                v-for="permisson in levels"
                :key="permisson.value"
                :label="permisson.value"
                >{{ permisson.label }} <i class="el-icon-right"></i
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="checkbox-item"
            :label="$t('h.formTips25')"
            prop="returnLevel"
          >
            <el-checkbox-group v-model="flowForm.returnLevel">
              <el-checkbox
                v-for="permisson in levels"
                :key="permisson.value"
                :label="permisson.value"
                >{{ permisson.label }} <i class="el-icon-right"></i
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="checkbox-item"
            :label="$t('h.formTips26')"
            prop="maintainLevel"
          >
            <el-checkbox-group v-model="flowForm.maintainLevel">
              <el-checkbox
                v-for="permisson in levels"
                :key="permisson.value"
                :label="permisson.value"
                >{{ permisson.label }}<i class="el-icon-right"></i
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="checkbox-item"
            :label="$t('h.formTips27')"
            prop="borrowLevel"
          >
            <el-checkbox-group v-model="flowForm.borrowLevel">
              <el-checkbox
                v-for="permisson in levels"
                :key="permisson.value"
                :label="permisson.value"
                >{{ permisson.label }}<i class="el-icon-right"></i
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="checkbox-item"
            :label="$t('h.formTips28')"
            prop="allotLevel"
          >
            <el-checkbox-group v-model="flowForm.allotLevel">
              <el-checkbox
                v-for="permisson in levels"
                :key="permisson.value"
                :label="permisson.value"
                >{{ permisson.label }}<i class="el-icon-right"></i
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="checkbox-item"
            :label="$t('h.formTips29')"
            prop="inLevel"
          >
            <el-checkbox-group v-model="flowForm.inLevel">
              <el-checkbox
                v-for="permisson in levels"
                :key="permisson.value"
                :label="permisson.value"
                >{{ permisson.label }}<i class="el-icon-right"></i
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
    </new-bills-dialog>
  </div>
</template>
<script>
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { deleteData, select, update } from "@/assets/api";
import { mapState } from "vuex";
import { levels } from "@/utils/systemData";
export default {
  components: {
    NewBillsDialog,
    DsSearchBtn,
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      loading: false,
      andLike: "",
      activeName: "",
      flowTabs: [],
      levels: levels,
      newBillsDialogVisible: false,
      newBillTitle: this.$t("h.title104"),
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      flowForm: {
        goodsqId: "",
        name: "",
        outLevel: [],
        scrapLevel: [],
        returnLevel: [],
        maintainLevel: [],
        borrowLevel: [],
        allotLevel: [],
        inLevel: [],
        storageReturnLevel: [],
        storageInLevel: [],
        storageOutLevel: [],
        storageAdjustLevel: [],
        storageAllotLevel: [],
      },
      flowFormRules: {
        name: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.formTips22"),
            trigger: "blur",
          },
        ],
        storageReturnLevel: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.title240"),
            trigger: "change",
          },
        ],
        storageInLevel: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.title241"),
            trigger: "change",
          },
        ],
        storageOutLevel: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.title242"),
            trigger: "change",
          },
        ],
        storageAdjustLevel: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.title243"),
            trigger: "change",
          },
        ],
        storageAllotLevel: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.title244"),
            trigger: "change",
          },
        ],
        outLevel: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips23"),
            trigger: "change",
          },
        ],
        scrapLevel: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips24"),
            trigger: "change",
          },
        ],
        returnLevel: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips25"),
            trigger: "change",
          },
        ],
        maintainLevel: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips26"),
            trigger: "change",
          },
        ],
        borrowLevel: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips27"),
            trigger: "change",
          },
        ],
        allotLevel: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips28"),
            trigger: "change",
          },
        ],
        inLevel: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips29"),
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    tables() {
      const search = this.andLike;
      if (search) {
        return this.flowTabs.filter((dataNews) => {
          return Object.keys(dataNews).some((key) => {
            return String(dataNews[key]).indexOf(search) > -1;
          });
        });
      }
      return this.flowTabs;
    },
  },
  watch: {
    tables(newVal) {
      if (newVal.length) this.activeName = newVal[0].name;
    },
  },
  methods: {
    getFlowTabs() {
      this.loading = true;
      select({
        func: "S0022",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          data.data.forEach((item) => {
            item.showList = [];
            if (item.storageReturnLevel) {
              item.showList.push(
                item.storageReturnLevel.split(",").reduce(
                  (prev, cur) => {
                    let levenName = this.levels.find(
                      (el) => el.value == cur
                    ).label;
                    prev.permisson.push(levenName);
                    return prev;
                  },
                  { name: this.$t("h.title245"), permisson: [] }
                )
              );
            }
            if (item.storageInLevel) {
              item.showList.push(
                item.storageInLevel.split(",").reduce(
                  (prev, cur) => {
                    let levenName = this.levels.find(
                      (el) => el.value == cur
                    ).label;
                    prev.permisson.push(levenName);
                    return prev;
                  },
                  { name: this.$t("h.title246"), permisson: [] }
                )
              );
            }
            if (item.storageOutLevel) {
              item.showList.push(
                item.storageOutLevel.split(",").reduce(
                  (prev, cur) => {
                    let levenName = this.levels.find(
                      (el) => el.value == cur
                    ).label;
                    prev.permisson.push(levenName);
                    return prev;
                  },
                  { name: this.$t("h.title247"), permisson: [] }
                )
              );
            }
            if (item.storageAdjustLevel) {
              item.showList.push(
                item.storageAdjustLevel.split(",").reduce(
                  (prev, cur) => {
                    let levenName = this.levels.find(
                      (el) => el.value == cur
                    ).label;
                    prev.permisson.push(levenName);
                    return prev;
                  },
                  { name: this.$t("h.title248"), permisson: [] }
                )
              );
            }
            if (item.storageAllotLevel) {
              item.showList.push(
                item.storageAllotLevel.split(",").reduce(
                  (prev, cur) => {
                    let levenName = this.levels.find(
                      (el) => el.value == cur
                    ).label;
                    prev.permisson.push(levenName);
                    return prev;
                  },
                  { name: this.$t("h.title249"), permisson: [] }
                )
              );
            }
            item.showList.push(
              item.outLevel.split(",").reduce(
                (prev, cur) => {
                  let levenName = this.levels.find(
                    (el) => el.value == cur
                  ).label;
                  prev.permisson.push(levenName);
                  return prev;
                },
                { name: this.$t("h.collectionProcess"), permisson: [] }
              )
            );
            item.showList.push(
              item.scrapLevel.split(",").reduce(
                (prev, cur) => {
                  let levenName = this.levels.find(
                    (el) => el.value == cur
                  ).label;
                  prev.permisson.push(levenName);
                  return prev;
                },
                { name: this.$t("h.scrapProcess"), permisson: [] }
              )
            );
            item.showList.push(
              item.returnLevel.split(",").reduce(
                (prev, cur) => {
                  let levenName = this.levels.find(
                    (el) => el.value == cur
                  ).label;
                  prev.permisson.push(levenName);
                  return prev;
                },
                { name: this.$t("h.returnToWarehouseProcess"), permisson: [] }
              )
            );
            item.showList.push(
              item.maintainLevel.split(",").reduce(
                (prev, cur) => {
                  let levenName = this.levels.find(
                    (el) => el.value == cur
                  ).label;
                  prev.permisson.push(levenName);
                  return prev;
                },
                { name: this.$t("h.repairProcess"), permisson: [] }
              )
            );
            item.showList.push(
              item.borrowLevel.split(",").reduce(
                (prev, cur) => {
                  let levenName = this.levels.find(
                    (el) => el.value == cur
                  ).label;
                  prev.permisson.push(levenName);
                  return prev;
                },
                { name: this.$t("h.borrowingProcess"), permisson: [] }
              )
            );
            item.showList.push(
              item.allotLevel.split(",").reduce(
                (prev, cur) => {
                  let levenName = this.levels.find(
                    (el) => el.value == cur
                  ).label;
                  prev.permisson.push(levenName);
                  return prev;
                },
                { name: this.$t("h.transferProcess"), permisson: [] }
              )
            );
            item.showList.push(
              item.inLevel.split(",").reduce(
                (prev, cur) => {
                  let levenName = this.levels.find(
                    (el) => el.value == cur
                  ).label;
                  prev.permisson.push(levenName);
                  return prev;
                },
                { name: this.$t("h.stocktakingProcess"), permisson: [] }
              )
            );
          });
          this.flowTabs = data.data;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    editAuditFlow() {
      if (!this.activeName) return this.$message.error(this.$t("h.tips22"));
      let selecFlow = this.flowTabs.find(
        (item) => item.name == this.activeName
      );
      this.flowForm.goodsqId = selecFlow.goodsqId;
      this.flowForm.name = selecFlow.name;
      this.flowForm.goodsqId = selecFlow.goodsqId;
      this.flowForm.outLevel = selecFlow.outLevel.split(",");
      this.flowForm.scrapLevel = selecFlow.scrapLevel.split(",");
      this.flowForm.returnLevel = selecFlow.returnLevel.split(",");
      this.flowForm.maintainLevel = selecFlow.maintainLevel.split(",");
      this.flowForm.borrowLevel = selecFlow.borrowLevel.split(",");
      this.flowForm.allotLevel = selecFlow.allotLevel.split(",");
      this.flowForm.inLevel = selecFlow.inLevel.split(",");
      this.flowForm.storageReturnLevel =
        selecFlow.storageReturnLevel.split(",");
      this.flowForm.storageInLevel = selecFlow.storageInLevel.split(",");
      this.flowForm.storageOutLevel = selecFlow.storageOutLevel.split(",");
      this.flowForm.storageAdjustLevel =
        selecFlow.storageAdjustLevel.split(",");
      this.flowForm.storageAllotLevel = selecFlow.storageAllotLevel.split(",");
      this.newBillTitle = this.$t("h.title105");
      this.newBillsDialogVisible = true;
    },
    deleteAuditFlow() {
      if (!this.activeName) return this.$message.error(this.$t("h.tips22"));
      this.$confirm(this.$t("h.tips176"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          let selecFlow = this.flowTabs.find(
            (item) => item.name == this.activeName
          );
          deleteData({
            func: "D0020",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              goodsqId: selecFlow.goodsqId,
              permissonId: 70,
            },
          })
            .then(({ data }) => {
              if (data.code != 0) return this.$message.error(data.data);
              this.$message.success(data.data);
              this.activeName = "";
              this.getFlowTabs();
            })
            .catch(() => {
              // "服务器网络错误，删除失败"
              this.$message.error(this.$t("h.tips18"));
            });
        })
        .catch(() => {
          this.$message.info(this.$t("h.tips98"));
        });
    },
    newBillsDialogClose() {
      this.$refs["flowFormRef"].resetFields();
      this.flowForm.goodsqId = "";
      this.newBillTitle = this.$t("h.title104");
    },
    sbumitFlowForm() {
      this.$refs.flowFormRef.validate((valid) => {
        if (!valid) return false;
        let permissonId = this.flowForm.goodsqId == "" ? 68 : 70;
        const LOADING = this.$loading(this.dialogLoading);
        update({
          func: "U0023",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            goodsqId: this.flowForm.goodsqId,
            name: this.flowForm.name,
            outLevel: this.flowForm.outLevel.join(","),
            scrapLevel: this.flowForm.scrapLevel.join(","),
            returnLevel: this.flowForm.returnLevel.join(","),
            maintainLevel: this.flowForm.maintainLevel.join(","),
            borrowLevel: this.flowForm.borrowLevel.join(","),
            allotLevel: this.flowForm.allotLevel.join(","),
            inLevel: this.flowForm.inLevel.join(","),
            storageReturnLevel: this.flowForm.storageReturnLevel.join(","),
            storageInLevel: this.flowForm.storageInLevel.join(","),
            storageOutLevel: this.flowForm.storageOutLevel.join(","),
            storageAdjustLevel: this.flowForm.storageAdjustLevel.join(","),
            storageAllotLevel: this.flowForm.storageAllotLevel.join(","),
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.$message.success(data.data);
            this.newBillsDialogVisible = false;
            this.getFlowTabs();
          })
          .catch(() => {
            LOADING.close();
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
  },
  created() {
    this.getFlowTabs();
  },
};
</script>
<style lang="scss" scoped>
.flow {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .flow-card {
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
}
.flow-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.flow-card-content {
  height: 100%;
  .handle {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  .handle > .title {
    font-size: 13px;
    font-weight: bold;
    color: #000000;
  }
  .handle > .btns {
    display: flex;
    font-size: 12px;
    color: #588ab9;
  }
  .btn-item {
    cursor: pointer;
    margin-right: 16px;
  }
  .btn-item > i {
    margin-right: 6px;
  }
  .border-style {
    position: relative;
  }
  .border-style::after {
    content: "";
    position: absolute;
    top: 2px;
    right: -9px;
    display: block;
    width: 2px;
    height: 14px;
    background: #333333;
  }
  .tabs {
    height: calc(100% - 57px);
  }
}
::v-deep .el-tabs {
  height: 100%;
  .el-tabs__content {
    padding: 7px 0px 7px 16px;
    height: 100%;
    overflow: auto;
  }
}
.el-empty {
  width: 100%;
  height: 100%;
}
.el-col {
  border-radius: 4px;
  margin-bottom: 24px;
  .grid-content {
    border-radius: 4px;
    min-width: 475px;
    min-height: 140px;
    border: 1px solid #eeeeee;
    .title {
      padding-left: 24px;
      height: 34px;
      line-height: 34px;
      background: #f5f5f5;
      border-radius: 4px 4px 0px 0px;
      font-size: 13px;
      font-weight: bold;
      color: #000000;
    }
    .content {
      display: flex;
      padding: 24px 24px 0 24px;
      height: 106px;
      box-sizing: border-box;
    }
    .content > span {
      display: block;
      padding-top: 5px;
      width: 42px;
      height: 100%;
      box-sizing: border-box;
      font-size: 13px;
      font-weight: 400;
      color: #666666;
    }
  }
}
.peromise {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .peromise-item {
    position: relative;
    display: flex;
    align-items: center;
    margin-right: 29px;
    padding: 0 10px 0 8px;
    width: 100px;
    height: 30px;
    background: #f8f8f8;
    border-radius: 4px;
    box-sizing: border-box;
    .el-icon-right {
      position: absolute;
      top: 50%;
      right: -22px;
      transform: translateY(-50%);
      font-size: 14px;
      font-weight: bold;
      color: #588ab9;
    }
    .num-icon {
      width: 19px;
      height: 19px;
      line-height: 19px;
      border-radius: 50%;
      text-align: center;
      background: #588ab9;
      color: #fff;
      font-weight: bold;
      font-size: 10px;
    }
    span {
      margin-left: 10px;
      font-size: 13px;

      color: #333333;
    }
  }
  .peromise-item:last-child {
    margin-right: 0px;
    .el-icon-right {
      display: none;
    }
  }
}
.el-checkbox:last-of-type {
  margin-right: 0px;
  .el-icon-right {
    display: none;
  }
}
</style>
