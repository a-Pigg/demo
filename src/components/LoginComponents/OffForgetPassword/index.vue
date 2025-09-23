<template>
  <div class="off-forget">
    <el-form ref="forgetFormRef" :model="forgetForm" :rules="forgetFormRules">
      <el-form-item prop="conpanyName">
        <el-input
          v-model="forgetForm.conpanyName"
          clearable
          :placeholder="$t('h.tips186') + $t('h.company')"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          v-model="forgetForm.phone"
          clearable
          :placeholder="$t('h.tips3') + $t('h.userName')"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="oldPassWord">
        <el-input
          v-model="forgetForm.oldPassWord"
          type="password"
          show-password
          :placeholder="$t('h.tips3') + $t('h.oldPassword')"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="new1PassWord">
        <el-input
          type="password"
          show-password
          v-model="forgetForm.new1PassWord"
          :placeholder="$t('h.tips3') + $t('h.newPassword')"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="new2PassWord">
        <el-input
          v-model="forgetForm.new2PassWord"
          show-password
          type="password"
          :placeholder="$t('h.tips3') + $t('h.newPassword')"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="send-btn" type="primary" @click="submitForgetForm">{{
          $t("h.confirmBtn")
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { anonym } from "@/assets/api";
import { regEx } from "@/utils/regEx";
const validateTel = (rule, value, callback) => {
  if (value === "") {
    callback(new Error(this.$t("h.tips3") + this.$t("h.userName")));
  } else if (!regEx.mobile.test(value)) {
    callback(new Error(this.$t("h.tips201")));
  } else {
    callback();
  }
};
export default {
  name: "OffForgetPassword",
  data() {
    const validatePassWord2 = (rule, value, callback) => {
      if (value === "")
        callback(new Error(this.$t("h.tips3") + this.$t("h.newPassword")));
      else if (value != this.forgetForm.new1PassWord)
        callback(new Error(this.$t("h.tips202")));
      else callback();
    };
    const validatePassWord1 = (rule, value, callback) => {
      if (value === "")
        callback(new Error(this.$t("h.tips3") + this.$t("h.newPassword")));
      else if (value == this.forgetForm.oldPassWord)
        callback(new Error(this.$t("h.tips203")));
      else callback();
    };
    return {
      forgetForm: {
        conpanyName: "",
        phone: "",
        oldPassWord: "",
        new1PassWord: "",
        new2PassWord: "",
      },
      forgetFormRules: {
        conpanyName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.company"),
            trigger: "blur",
          },
        ],
        // phone: [{ required: true, validator: validateTel, trigger: "blur" }],
        phone: [{ required: true,  trigger: "blur" }],
        oldPassWord: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.oldPassword"),
            trigger: "blur",
          },
        ],
        new1PassWord: [{ validator: validatePassWord1, trigger: "blur" }],
        new2PassWord: [{ validator: validatePassWord2, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForgetForm() {
      this.$refs.forgetFormRef.validate(async (valid) => {
        if (!valid) return false;
        // 国际化
        let lan = localStorage.getItem("locale") || "en";
        let lanStr = lan == "zh" ? "zh_CN" : "en_US";
        const { data: res } = await anonym({
          func: "A0014",
          language: lanStr,
          requstData: this.forgetForm,
        }).catch(() => {
          // "服务器网络错误，修改密码失败"
          this.$message.success(this.$t("h.tips18"));
        });
        if (res.code != 0) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: res.data,
          });
        }
        this.$message.success(res.data);
        this.$refs["forgetFormRef"].resetFields();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.send-btn {
  width: 280px;
  height: 50px;
  border-radius: 8px;
}
</style>
