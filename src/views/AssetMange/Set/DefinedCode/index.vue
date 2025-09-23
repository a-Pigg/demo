<template>
  <div class="defined-code">
    <div class="defined-code-card">
      <div class="code-card-content">
        <el-tabs tab-position="left" style="height: 100%">
          <el-tab-pane :label="$t('h.assetCodeSetting')">
            <ds-transfer
              v-model="value"
              :type="$t('h.assetCode')"
              :padLength.sync="assetPadLength"
              :userInfo="userInfo"
              :roleId="roleId"
              :inputValue="assetValue"
              :fields="assetFields"
              :data="assetFieldsData"
              @update="getRuleCodeList"
            ></ds-transfer>
          </el-tab-pane>
          <el-tab-pane :label="$t('h.categoryCodeSetting')">
            <ds-transfer
              v-model="classifyValue"
              :type="$t('h.categoryCode')"
              :padLength.sync="classPadLength"
              :userInfo="userInfo"
              :roleId="classifyRoleId"
              :inputValue="classInputValue"
              :fields="classFields"
              :data="classFieldsData"
              @update="getRuleCodeList"
            >
            </ds-transfer>
          </el-tab-pane>
          <el-tab-pane :label="$t('h.areaCodeSetting')">
            <ds-transfer
              v-model="positionValue"
              :type="$t('h.departmentCode')"
              :padLength.sync="positionPadLength"
              :userInfo="userInfo"
              :roleId="positionRoleId"
              :inputValue="positionInputValue"
              :fields="positionFields"
              :data="positionFieldsData"
              @update="getRuleCodeList"
            >
            </ds-transfer>
          </el-tab-pane>
          <el-tab-pane :label="$t('h.departmentCodeSetting')">
            <ds-transfer
              v-model="deptValue"
              :type="$t('h.departmentCode')"
              :padLength.sync="deptPadLength"
              :userInfo="userInfo"
              :roleId="deptRoleId"
              :inputValue="deptInputValue"
              :fields="deptFields"
              :data="deptFieldsData"
              @update="getRuleCodeList"
            >
            </ds-transfer>
          </el-tab-pane>
          <el-tab-pane :label="$t('h.employeeCodeSetting')">
            <ds-transfer
              v-model="staffValue"
              :type="$t('h.departmentCode')"
              :padLength.sync="staffPadLength"
              :userInfo="userInfo"
              :roleId="staffRoleId"
              :inputValue="staffInputValue"
              :fields="staffFields"
              :data="staffFieldsData"
              @update="getRuleCodeList"
            >
            </ds-transfer>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import DsTransfer from "@/components/DsTransfer";
import { select } from "@/assets/api";
import { mapState } from "vuex";
export default {
  components: { DsTransfer },
  data() {
    return {
      ruleCodeList: [],
      value: [],
      roleId: null,
      assetValue: "",
      assetFields: {},
      assetPadLength: 4,
      assetFieldsData: [
        {
          key: "BuyMonth",
          label:
            this.$t("h.tips135") + this.$t("h.tips136") + this.$t("h.tips139"),
          jointmark: "",
        },
        {
          key: "BuyDay",
          label:
            this.$t("h.tips135") + this.$t("h.tips137") + this.$t("h.tips139"),
          jointmark: "",
        },
        {
          key: "BuyYear4",
          label:
            this.$t("h.tips135") + this.$t("h.tips138") + this.$t("h.tips140"),
          jointmark: "",
        },
        {
          key: "BuyYear6",
          label:
            this.$t("h.tips135") + this.$t("h.tips138") + this.$t("h.tips141"),
          jointmark: "",
        },
        {
          key: "BuyYear",
          label:
            this.$t("h.tips135") + this.$t("h.tips138") + this.$t("h.tips139"),
          jointmark: "",
        },
        {
          key: "classifyCode",
          label: this.$t("h.categoryCode"),
          jointmark: "",
        },
        {
          key: "deptCode",
          label: this.$t("h.departmentCode"),
          jointmark: "",
        },
        {
          key: "CusyomString",
          label: this.$t("h.fixedCharacters"),
          jointmark: "",
        },
      ],
      deptValue: [],
      deptRoleId: null,
      deptInputValue: "",
      deptFields: {},
      deptPadLength: 4,
      deptFieldsData: [
        {
          key: "CusyomString",
          label: this.$t("h.fixedCharacters"),
          jointmark: "",
        },
      ],
      classifyValue: [],
      classifyRoleId: null,
      classInputValue: "",
      classFields: {},
      classPadLength: 4,
      classFieldsData: [
        {
          key: "CusyomString",
          label: this.$t("h.fixedCharacters"),
          jointmark: "",
        },
      ],
      positionValue: [],
      positionRoleId: null,
      positionInputValue: "",
      positionFields: {},
      positionPadLength: 4,
      positionFieldsData: [
        {
          key: "CusyomString",
          label: this.$t("h.fixedCharacters"),
          jointmark: "",
        },
      ],
      staffValue: [],
      staffRoleId: null,
      staffInputValue: "",
      staffFields: {},
      staffPadLength: 4,
      staffFieldsData: [
        {
          key: "CusyomString",
          label: this.$t("h.fixedCharacters"),
          jointmark: "",
        },
      ],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    async getRuleCodeList() {
      const { data: res } = await select({
        func: "S0049",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      }).catch((err) => {
        // "服务器网络错误,无法加载当前编码规则"
        return this.$message.error(this.$t("h.tips18"));
      });
      if (res.code != 0) return this.$message.error(res.data);
      this.ruleCodeList = res.data;
      res.data.forEach((item) => {
        if (item.type == "assetCode") {
          this.value = item.order;
          this.roleId = item.roleId;
          this.assetValue = item.customValue;
          this.assetFields = item.fields;
          this.assetPadLength = item.padLength;
        } else if (item.type == "deptCode") {
          this.deptValue = item.order;
          this.deptRoleId = item.roleId;
          this.deptInputValue = item.customValue;
          this.deptFields = item.fields;
          this.deptPadLength = item.padLength;
        } else if (item.type == "classifyCode") {
          this.classifyValue = item.order;
          this.classifyRoleId = item.roleId;
          this.classInputValue = item.customValue;
          this.classFields = item.fields;
          this.classPadLength = item.padLength;
        } else if (item.type == "positionCode") {
          this.positionValue = item.order;
          this.positionRoleId = item.roleId;
          this.positionInputValue = item.customValue;
          this.positionFields = item.fields;
          this.positionPadLength = item.padLength;
        } else if (item.type == "staffCode") {
          this.staffValue = item.order;
          this.staffRoleId = item.roleId;
          this.staffInputValue = item.customValue;
          this.staffFields = item.fields;
          this.staffPadLength = item.padLength;
        }
      });
    },
  },
  created() {
    this.getRuleCodeList();
  },
};
</script>
<style lang="scss" scoped>
.defined-code {
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .defined-code-card {
    padding: 14px;
    width: 100%;
    height: 100%;
    overflow: auto;
    border-radius: 6px;
    box-shadow: 0px 0px 20px 0px rgba(17, 10, 80, 0.1);
    background-color: #ffffff;
    box-sizing: border-box;
    .code-card-content {
      height: 100%;
    }
  }
}
::v-deep .el-tabs__content {
  height: 100% !important;
  .el-tab-pane {
    height: 100%;
  }
}
</style>
