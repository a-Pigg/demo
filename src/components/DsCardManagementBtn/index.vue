<template>
  <div class="management">
    <el-popover trigger="click" ref="columnSetPopverRef">
      <div class="dropdown-menu">
        <span class="title">{{ $t("h.setColumns") }}</span>
        <div class="dropdown-menu-item">
          <el-switch
            v-for="item in columnsSetData"
            :key="item._id"
            :active-text="item.label"
            :disabled="item.attr == 'assetCode' || item.attr == 'name'"
            v-model="item.show"
            active-color="#78A1C7"
            inactive-color="#C0CCDA"
          ></el-switch>
        </div>
        <div class="btn">
          <el-button type="text" size="small" @click="selectAllColumnsSet">{{
            $t("h.showAllBtn")
          }}</el-button>
          <el-button type="text" size="small" @click="unselectAllColumnsSet">{{
            $t("h.hideAllBtn")
          }}</el-button>
          <el-button
            class="svae-btn"
            type="primary"
            size="small"
            @click="submitColumnSetData"
            >{{ $t("h.saveBtn") }}</el-button
          >
        </div>
      </div>
      <el-button slot="reference" size="small" type="text">
        <i class="el-icon-setting" />
      </el-button>
    </el-popover>
    <el-popover trigger="click" ref="fixedColumnsPopverRef">
      <div class="dropdown-menu">
        <span class="title">{{ $t("h.fixedColumns") }}</span>
        <div class="dropdown-menu-item">
          <el-switch
            v-for="item in fixedColumnsData"
            :key="item._id"
            :active-text="item.label"
            v-model="item.fixed"
            active-color="#78A1C7"
            inactive-color="#C0CCDA"
          ></el-switch>
        </div>
        <div class="fixed-btn btn">
          <el-button
            class="svae-btn"
            type="primary"
            size="small"
            @click="submitFixedColumnsData"
            >{{ $t("h.saveBtn") }}</el-button
          >
        </div>
      </div>
      <el-button slot="reference" size="small" type="text">
        <i class="el-icon-lock" />
      </el-button>
    </el-popover>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import deepCopy from "@/utils/deepCopy";
import { update } from "@/assets/api";
export default {
  name: "DsCardManagementBtn",
  data() {
    return {
      columnsSetData: [],
    };
  },
  computed: {
    ...mapState(["userInfo", "assetTableHeader"]),
    fixedColumnsData() {
      return this.columnsSetData.filter((item) => {
        return item.show;
      });
    },
  },
  watch: {
    assetTableHeader() {
      this.handleColumnSetData();
    },
  },
  methods: {
    ...mapActions(["GET_ASSETTABLEHEADER"]),
    handleColumnSetData() {
      this.columnsSetData = deepCopy(this.assetTableHeader);
    },
    selectAllColumnsSet() {
      this.columnsSetData.forEach((item) => {
        item.show = true;
      });
    },
    unselectAllColumnsSet() {
      this.columnsSetData.forEach((item) => {
        if (item.attr == "assetCode" || item.attr == "name") {
          item.show = true;
        } else {
          item.show = false;
        }
      });
    },
    // 保存设置
    async submitColumnSetData() {
      const { data: res } = await update({
        func: "U0061",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          alias: this.columnsSetData,
          permissonId: 25,
        },
      });
      if (res.code != 0) return this.$message.error(res.data);
      await this.GET_ASSETTABLEHEADER();
      this.handleColumnSetData();
      this.$message.success(this.$t("h.tips95"));
      this.$refs.columnSetPopverRef.doClose();
      this.$emit("updateTable");
    },
    async submitFixedColumnsData() {
      const { data: res } = await update({
        func: "U0061",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          alias: this.fixedColumnsData,
          permissonId: 25,
        },
      });
      if (res.code != 0) return this.$message.error(res.data);
      await this.GET_ASSETTABLEHEADER();
      this.$message.success(this.$t("h.tips96"));
      this.$refs.fixedColumnsPopverRef.doClose();
      this.$emit("updateTable");
    },
  },
  created() {
    this.handleColumnSetData();
  },
};
</script>
<style lang="scss" scoped>
.management {
  height: 35px;
}
.dropdown-menu {
  text-align: center;
  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .dropdown-menu-item {
    max-height: 450px;
    overflow-y: auto;
    text-align: left;
    .el-switch {
      margin-top: 10px;
      display: block;
    }
  }
  .fixed-btn {
    margin-top: 10px;
  }
  .svae-btn {
    display: block;
    width: 160px;
  }
}
::v-deep .el-icon-setting {
  margin: 0 5px;
  font-size: 14px;
}
::v-deep .el-icon-lock {
  padding: 0 5px;
  border-left: 2px solid #333;
  border-right: 2px solid #333;
  font-size: 14px;
}
</style>
