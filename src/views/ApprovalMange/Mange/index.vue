<template>
  <div class="mange">
    <el-card class="mange-card">
      <div slot="header" class="mange-card-header">
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
      <div class="mange-card-content" v-loading="loading">
        <div class="user">
          <h3>{{ $t("h.userName") }}</h3>
          <ul class="user-list">
            <li
              class="user-item"
              v-for="(item, index) in searchAuditUser"
              :key="item._id"
              @click.stop="handleSelectUser(index, item)"
            >
              <i class="el-icon-user-solid"></i>
              <span>{{ item.staffName }}</span>
            </li>
          </ul>
        </div>
        <div class="scope">
          <div class="scope-title">
            <h3>{{ $t("h.approvalManagement") }}</h3>
            <ul class="btns">
              <li class="btn-item border-style" @click="editAuditSetInfo">
                <i class="el-icon-edit"></i>
                <span>{{ $t("h.editBtn") }}</span>
              </li>
              <li class="btn-item" @click="deleteAuditUser">
                <i class="el-icon-delete"></i>
                <span>{{ $t("h.delBtn") }}</span>
              </li>
            </ul>
          </div>
          <div class="scope-info">
            <div class="scope-info-level">
              <div class="title">
                <span>{{ $t("h.approvalLevel") }}</span>
              </div>
              <ul class="content">
                <li
                  class="content-item"
                  v-for="(item, index) in selectAuditUser.levelName"
                  :key="index"
                >
                  <div class="icon">{{ item.slice(0, 1) }}</div>
                  <span>{{ item.slice(0, -1) }}</span>
                </li>
              </ul>
            </div>
            <div class="scope-info-dept">
              <div class="title">
                <span>{{ $t("h.departmentUnderManagement") }}</span>
              </div>
              <ul class="content">
                <li
                  class="content-item"
                  v-for="(item, index) in selectAuditUser.deptName"
                  :key="index"
                >
                  <img src="@/assets/images/icon-dept-top.png" alt="" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <new-bills-dialog
      class="new-bill-dialog"
      :title="newBillTitle"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @opened="newBillsDialogOpened"
      @close="newBillsDialogClose"
      @sbumitForm="sbumitMangeForm"
    >
      <template slot="form">
        <el-form
          ref="mangeUserFormRef"
          :model="mangeUserForm"
          :rules="mangeUserRules"
          label-width="80px"
        >
          <el-form-item :label="$t('h.userName')" prop="userId">
            <el-select
              v-model="mangeUserForm.userId"
              :placeholder="$t('h.tips4') + $t('h.userName')"
              ref="userSelectRef"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="item in users"
                :key="item._id"
                :label="item.staffName"
                :value="item._id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('h.approvalLevel')" prop="level">
            <el-select
              v-model="mangeUserForm.level"
              :placeholder="$t('h.tips4') + $t('h.approvalLevel')"
              multiple
              filterable
              ref="userSelectRef"
              style="width: 100%"
            >
              <el-option
                v-for="item in levels"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('h.department')" prop="detpId">
            <ds-select-tree
              v-model="mangeUserForm.detpId"
              :placeholder="$t('h.tips4') + $t('h.department')"
              :treeData="treeDepts"
              :defaultProps="{
                children: 'children',
                label: 'deptName',
                value: '_id',
              }"
              :checkStrictly="true"
              :multiple="true"
              :collapse-tags="true"
            >
            </ds-select-tree>
          </el-form-item>
        </el-form>
      </template>
    </new-bills-dialog>
  </div>
</template>
<script>
import DsSelectTree from "@/components/DsSelectTree";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import { deleteData, select, update } from "@/assets/api";
import { mapState } from "vuex";
import { levels2 } from "@/utils/systemData";
export default {
  components: {
    DsSelectTree,
    DsSearchBtn,
    NewBillsDialog,
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      loading: false,
      andLike: "",
      selectAuditUser: {},
      depts: [],
      treeDepts: [],
      levels: levels2,
      users: [],
      mangeUsers: [],
      newBillsDialogVisible: false,
      newBillTitle: this.$t("h.title106"),
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      mangeUserForm: {
        id: "",
        userId: "",
        level: [],
        detpId: [],
      },
      mangeUserRules: {
        userId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.userName"),
            trigger: "change",
          },
        ],
        level: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.approvalLevel"),
            trigger: "change",
          },
        ],
        detpId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.department"),
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    searchAuditUser() {
      const search = this.andLike;
      if (search) {
        return this.mangeUsers.filter((dataNews) => {
          return Object.keys(dataNews).some((key) => {
            return String(dataNews[key]).indexOf(search) > -1;
          });
        });
      }
      return this.mangeUsers;
    },
  },
  watch: {
    searchAuditUser(newVal) {
      if (newVal.length) {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          let firstUserItem = document.querySelectorAll(".user-item")[0];
          firstUserItem.click();
        }, 0);
      } else {
        this.selectAuditUser = {};
      }
    },
  },
  methods: {
    getDepts() {
      this.loading = true;
      select({
        func: "S0004",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.depts = data.data;
          this.treeDepts = transListDataToTreeData(data.data, null);
          this.getMangeUsers();
        })
        .catch(() => {
          this.loading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getUsers() {
      select({
        func: "S0026",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.users = data.data;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getMangeUsers() {
      select({
        func: "S0024",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          data.data.forEach((item) => {
            item.deptName = item.detpId.split(",").reduce((prev, cur) => {
              let deptInfo = this.depts.find((dItem) => dItem._id == cur);
              if (deptInfo) prev.push(deptInfo.code + "-" + deptInfo.deptName);
              else prev.push(this.$t("h.tips177"));
              return prev;
            }, []);
            item.levelName = item.level.split(",").reduce((prev, cur) => {
              let levelInfo = this.levels.find((lItem) => lItem.value == cur);
              if (levelInfo) prev.push(levelInfo.label);
              else prev.push(this.$t("h.tips178"));
              return prev;
            }, []);
          });
          this.mangeUsers = data.data;
          if (this.mangeUsers.length) {
            let timer = setTimeout(() => {
              clearTimeout(timer);
              let firstUserItem = document.querySelectorAll(".user-item")[0];
              firstUserItem.click();
            }, 0);
          }
        })
        .catch(() => {
          this.loading = false;
          // "服务器网络错误,请求审核人员失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    handleSelectUser(index, item) {
      this.selectAuditUser = item;
      document.querySelectorAll(".user-item").forEach((item, i) => {
        item.style.background = "#fff";
        item.style.color = "#333";
        item.style.fontWeight = "400";
        if (index == i) {
          item.style.background = "#f8f8f8";
          item.style.color = "#588ab9";
          item.style.fontWeight = "700";
        }
      });
    },
    editAuditSetInfo() {
      if (!this.selectAuditUser.id)
        return this.$message.error(this.$t("h.tips179"));
      this.mangeUserForm.id = this.selectAuditUser.id;
      this.mangeUserForm.userId = this.selectAuditUser.userId;
      this.mangeUserForm.level = this.selectAuditUser.level.split(",");
      this.mangeUserForm.detpId = this.selectAuditUser.detpId
        .split(",")
        .map((item) => parseInt(item));
      this.newBillTitle = this.$t("h.title107");
      this.newBillsDialogVisible = true;
    },
    deleteAuditUser() {
      if (!this.selectAuditUser.id)
        return this.$message.error(this.$t("h.tips22"));
      this.$confirm(this.$t("h.tips180"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          deleteData({
            func: "D0021",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              id: this.selectAuditUser.id,
              permissonId: 65,
            },
          })
            .then(({ data }) => {
              if (data.code != 0) return this.$message.error(data.data);
              this.$message.success(data.data);
              this.getMangeUsers();
            })
            .catch(() => {
              // "服务器网络异常，删除审核人员失败"
              this.$message.error(this.$t("h.tips18"));
            });
        })
        .catch(() => {
          this.$message.info(this.$t("h.tips98"));
        });
    },
    newBillsDialogOpened() {
      this.$refs.mangeUserFormRef.clearValidate();
    },
    newBillsDialogClose() {
      this.$refs.mangeUserFormRef.resetFields();
      this.mangeUserForm.id = "";
      this.newBillTitle = this.$t("h.title106");
    },
    sbumitMangeForm() {
      this.$refs.mangeUserFormRef.validate((valid) => {
        if (!valid) return false;
        let permissonId = this.mangeUserForm.id == "" ? 64 : 66;
        const LOADING = this.$loading(this.dialogLoading);
        update({
          func: "U0024",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            id: this.mangeUserForm.id,
            userId: this.mangeUserForm.userId,
            level: this.mangeUserForm.level.join(","),
            detpId: this.mangeUserForm.detpId.join(","),
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.$message.success(data.data);
            this.newBillsDialogVisible = false;
            this.getMangeUsers();
          })
          .catch(() => {
            LOADING.close();
            // "服务器网络错误,添加/修改审核人员失败"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
  },
  mounted() {
    this.getDepts();
    this.getUsers();
  },
};
</script>
<style lang="scss" scoped>
.mange {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .mange-card {
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
.mange-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.mange-card-content {
  display: flex;
  height: 100%;
}
.user {
  padding-bottom: 24px;
  min-width: 256px;
  width: 256px;
  border-right: 1px solid #eeeeee;
  box-sizing: border-box;
  h3 {
    margin: 24px 0 10px 0;
    font-size: 13px;
    font-weight: bold;
    color: #000000;
  }
  .user-list {
    height: calc(100% - 51px);
    overflow: auto;
    box-sizing: border-box;
  }
  .user-item {
    display: flex;
    align-items: center;
    padding-left: 10px;
    cursor: pointer;
    height: 42px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    .el-icon-user-solid {
      margin-right: 7px;
      font-size: 20px;
      color: #588ab9;
    }
    span {
      display: inline-block;
      width: 218px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .user-item:hover {
    span {
      color: #588ab9;
    }
  }
}
.scope {
  padding: 0 0 24px 24px;
  flex: 1;
  box-sizing: border-box;
  overflow: auto;
  .scope-title {
    margin: 24px 0 18px 0;
    display: flex;
    justify-content: space-between;
    h3 {
      font-size: 13px;
      font-weight: bold;
      color: #000000;
    }
    .btns {
      display: flex;
      font-size: 12px;
      font-weight: 400;
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
  }
  .scope-info {
    padding: 24px;
    height: calc(100% - 61px);
    border: 1px solid #eeeeee;
    box-sizing: border-box;
    overflow: auto;
  }
  .scope-info-level {
    display: flex;
    height: 66px;
    .title {
      margin-right: 47px;
      min-width: 181px;
      width: 181px;
      height: 65px;
      line-height: 65px;
      background: #f8f8f8;
      border: 1px solid #eeeeee;
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      color: #000000;
    }
    .content {
      display: flex;
      align-items: center;
      flex: 1;
    }
    .content-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 30px;
      padding: 0 10px 0 8px;
      width: 100px;
      height: 30px;
      background: #f8f8f8;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .content-item:last-child {
      margin-right: 0px;
    }
    .content-item > .icon {
      width: 19px;
      height: 19px;
      line-height: 19px;
      border-radius: 50%;
      text-align: center;
      background: #588ab9;
      color: #fff;
      font-weight: bold;
    }
    .content-item > span {
      font-size: 13px;
      font-weight: 400;
      color: #333333;
    }
  }
  .scope-info-dept {
    display: flex;
    margin-top: 24px;
    min-height: 158px;
    height: calc(100% - 90px);
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 47px;
      width: 181px;
      height: 157px;
      background: #f8f8f8;
      border: 1px solid #eeeeee;
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      color: #000000;
    }
    .content {
      padding-top: 24px;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      flex: 1;
      overflow: auto;
      box-sizing: border-box;
    }
    .content-item {
      margin-right: 20px;
      margin-bottom: 24px;
      height: 20px;
    }
    .content-item > img {
      margin-right: 12px;
      width: 20px;
      vertical-align: middle;
    }
    .content-item > span {
      vertical-align: middle;
      font-size: 14px;
      font-weight: 400;
      color: #444444;
    }
  }
}
</style>
