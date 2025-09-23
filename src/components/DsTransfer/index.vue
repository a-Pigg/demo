<template>
  <div class="ds-transfer">
    <el-alert :closable="false">
      <span slot="title"
        >{{ $t("h.title74") }}{{ type }}{{ $t("h.title75") }}</span
      >
    </el-alert>
    <div class="code-preview">
      <span>{{ $t("h.title76") }}：</span>
      <div class="preview-tag">
        <div v-for="(item, index) in previewCode" :key="index">
          <el-tag effect="dark" size="small">{{ item.label }}</el-tag>
          <span>&nbsp;{{ item.jointmark }}&nbsp;</span>
        </div>
        <el-tag effect="dark" size="small"
          >{{ num }}{{ $t("h.title77") }}</el-tag
        >
      </div>
    </div>
    <el-transfer
      ref="transfer"
      id="transfer"
      v-model="currentValue"
      :data="data"
      :titles="[$t('h.title78'), $t('h.title79')]"
      target-order="unshift"
    >
      <div
        class="select-list"
        slot-scope="{ option }"
        :draggable="!option.disabled"
        @dragstart="drag($event, option)"
      >
        {{ option.label }}
        <el-select
          v-if="isShowSelect(option.key) == 'select'"
          size="mini"
          v-model="option.jointmark"
          :placeholder="$t('h.tips4')"
          @change="(option) => selectChange(option)"
          @click.native.prevent="preventSuffix"
        >
          <el-option
            v-for="(item, index) in jointmarkList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div
          style="display: inline-block"
          v-if="isShowSelect(option.key) == 'inputSelect'"
        >
          <el-input v-model="customValue" maxlength="10"></el-input>
          <el-select
            size="mini"
            v-model="option.jointmark"
            :placeholder="$t('h.tips4')"
            @change="(option) => selectChange(option)"
            @click.native.prevent="preventSuffix"
          >
            <el-option
              v-for="(item, index) in jointmarkList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </el-transfer>
    <div class="run-water">
      <span>{{ $t("h.title80") }}</span>
      <el-input-number
        v-model="num"
        size="mini"
        step-strictly
        @change="handleChange"
        :min="4"
        :max="8"
        :step="1"
        :label="$t('h.title81')"
      ></el-input-number>
    </div>
    <div class="btns">
      <el-button type="primary" @click="saveRuleCode">{{
        $t("h.saveBtn")
      }}</el-button>
    </div>
  </div>
</template>
<script>
import Sortable from "sortablejs";
import { update } from "@/assets/api";
export default {
  data() {
    return {
      jointmarkList: [
        {
          value: "",
          label: this.$t("h.title82"),
        },

        {
          value: "_",
          label: "_",
        },
        {
          value: "-",
          label: "-",
        },
      ],
      jointmark: "",
      customValue: "",
      draggingKey: null,
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    type: {
      type: String,
      default: "资产编码",
    },
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    roleId: Number,
    fields: Object,
    inputValue: String,
    padLength: Number,
  },
  computed: {
    previewCode() {
      let previewCode = [];
      this.currentValue.forEach((item) => {
        let filterCodeArr = this.data.filter((fitem) => fitem.key == item);
        let filterItem = JSON.parse(JSON.stringify(filterCodeArr[0]));
        if (filterItem.key == "CusyomString" && this.customValue != "")
          filterItem.label = this.customValue;
        previewCode.push(filterItem);
      });
      return previewCode;
    },
    currentValue: {
      get: function () {
        return this.value;
      },
      set: function (newValue) {
        this.$emit("input", newValue);
      },
    },
    num: {
      get: function () {
        return this.padLength;
      },
      set: function (val) {
        this.$emit("update:padLength", val);
      },
    },
  },
  watch: {
    inputValue(newVal, oldVal) {
      this.customValue = newVal;
    },
    fields(newVal, oldVal) {
      this.data.forEach((item) => {
        for (let key in newVal) {
          if (item.key == key) {
            item.jointmark = newVal[key];
          }
        }
      });
    },
  },
  methods: {
    isShowSelect(key) {
      if (this.currentValue.indexOf(key) != -1 && key != "CusyomString")
        return "select";
      else if (this.currentValue.indexOf(key) != -1 && key == "CusyomString")
        return "inputSelect";
      return false;
    },
    drag(ev, option) {
      this.draggingKey = option.key;
      const transfer = this.$refs.transfer.$el;
      const leftPanel = transfer
        .getElementsByClassName("el-transfer-panel")[0]
        .getElementsByClassName("el-transfer-panel__body")[0];
      const rightPanel = transfer
        .getElementsByClassName("el-transfer-panel")[1]
        .getElementsByClassName("el-transfer-panel__body")[0];
      const rightEl = rightPanel.getElementsByClassName(
        "el-transfer-panel__list"
      )[0];
      Sortable.create(rightEl, {
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt;
          this.currentValue.splice(
            newIndex,
            0,
            this.currentValue.splice(oldIndex, 1)[0]
          );
        },
      });
    },
    preventSuffix() {},
    selectChange(val) {
      // console.log(val)
    },
    handleChange(currentValue, oldValue) {
      // console.log(currentValue)
      // console.log(oldValue)
    },
    async saveRuleCode() {
      if (this.currentValue.indexOf("CusyomString") != -1) {
        let reg = /^[A-Za-z0-9]+$/;
        if (!reg.test(this.customValue)) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.title83"),
          });
        }
        let RuleCodeForm = {};
        this.currentValue.forEach((item) => {
          const filterItem = this.data.filter((fItem) => fItem.key == item);
          RuleCodeForm[filterItem[0].key] = filterItem[0].jointmark;
        });
        const { data: res } = await update({
          func: "U0057",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            customValue: this.customValue,
            fields: RuleCodeForm,
            order: this.currentValue,
            padLength: this.num,
            permissonId: 78,
            roleId: this.roleId,
          },
        }).catch((err) => {
          // "服务器网络错误,无法保存编码规则"
          return this.$message.error(this.$t("h.tips18"));
        });
        if (res.code != 0) return this.$message.error(res.data);
        this.$message.success(res.data);
        this.$emit("update");
        // console.log(res.data)
        // console.log('RuleCodeForm>>>', RuleCodeForm)
        // console.log('padlength', this.num)
        // console.log('order', this.currentValue)
        // console.log(this.customValue)
      } else {
        let RuleCodeForm = {};
        this.currentValue.forEach((item) => {
          const filterItem = this.data.filter((fItem) => fItem.key == item);
          RuleCodeForm[filterItem[0].key] = filterItem[0].jointmark;
        });
        const { data: res } = await update({
          func: "U0057",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            fields: RuleCodeForm,
            order: this.currentValue,
            padLength: this.num,
            permissonId: 78,
            roleId: this.roleId,
          },
        }).catch((err) => {
          // "服务器网络错误,无法保存编码规则"
          return this.$message.error(this.$t("h.tips18"));
        });
        if (res.code != 0) return this.$message.error(res.data);
        this.$message.success(res.data);
        this.$emit("update");
        // console.log(res.data)
        // console.log('RuleCodeForm>>>', RuleCodeForm)
        // console.log('padlength', this.num)
        // console.log('order', this.currentValue)
      }
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.ds-transfer {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 14px;
  .el-alert {
    background-color: #e9ecff;
    color: #6a83fc;
  }
  .code-preview {
    display: flex;
    align-items: center;
    margin: 10px 0;
    padding-left: 10px;
    width: 100%;
    height: 37px;
    border-radius: 4px;
    border: 1px dotted rgb(221, 221, 221);
    border-radius: 4px;
    color: #626262;
    background: rgb(249, 249, 249);
    box-sizing: border-box;
    .preview-tag {
      display: flex;
    }
  }
  ::v-deep .el-transfer-panel {
    width: 309px;
    height: 400px;
    .el-transfer-panel__body {
      height: 360px;
      .el-transfer-panel__list {
        overflow: hidden;
        height: 360px;
        &:hover {
          overflow-y: auto;
        }
        &::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
          height: 1px;
        }

        &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 6px;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: #cccccc;
        }

        &::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: #ffffff;
        }
      }
    }
  }
  .select-list {
    position: relative;
    .el-input {
      margin-left: 20px;
      width: 110px;
      vertical-align: middle;
    }
    .el-select {
      position: absolute;
      left: 200px;
      width: 60px;
      vertical-align: middle;
    }
  }
  ::v-deep .el-checkbox {
    margin-right: 0;
  }
  .run-water {
    margin-top: 20px;
    span {
      margin-right: 40px;
      font-size: 14px;
      color: #666;
    }
  }
  .btns {
    position: absolute;
    bottom: 0;
    left: 50%;
  }
}
::v-deep .el-input__inner {
  height: 26px !important;
}
</style>
