<template>
  <div class="try-account">
    <el-form
      ref="tryAccountFormRef"
      :model="tryAccountForm"
      :rules="tryAccountFormRules"
    >
      <el-form-item prop="conpanyName">
        <el-input
          v-model.trim="tryAccountForm.conpanyName"
          :placeholder="$t('h.tips3') + $t('h.company')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          v-model.trim="tryAccountForm.name"
          :placeholder="$t('h.tips3') + $t('h.nickname')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          v-model.trim="tryAccountForm.phone"
          :placeholder="$t('h.tips3') + $t('h.userName')"
        >
        </el-input>
      </el-form-item>
      <!-- <el-form-item prop="code">
        <el-input
          v-model.trim="tryAccountForm.code"
          :placeholder="$t('h.tips3') + $t('h.verificationCode')"
        >
          <el-button slot="append" :disabled="isGetCode" @click="snedCode">
            <span v-show="!isGetCode">{{ $t("h.send") }}</span>
            <span v-show="isGetCode"
              >{{ $t("h.await") }}：{{ second }}{{ $t("h.second") }}</span
            >
          </el-button>
        </el-input>
      </el-form-item> -->
      <el-form-item prop="password">
        <el-input
          type="password"
          show-password
          v-model.trim="tryAccountForm.password"
          :placeholder="$t('h.tips3') + $t('h.password')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="sumbit-btn"
          type="primary"
          @click="submitTryRegister"
          >{{ $t("h.confirmBtn") }}</el-button
        >
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
  name: "TryRegister",
  data() {
    return {
      tryAccountForm: {
        conpanyName: "",
        name: "",
        phone: "",
        // code: "",
        password: "",
      },
      tryAccountFormRules: {
        conpanyName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.company"),
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.nickname"),
            trigger: "blur",
          },
        ],
        // phone: [{ required: true, validator: validateTel, trigger: "blur" }],
        phone: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.userName"),
            trigger: "blur",
          },
        ],
        // code: [
        //   {
        //     required: true,
        //     message: this.$t("h.tips3") + this.$t("h.verificationCode"),
        //     trigger: "blur",
        //   },
        // ],
        password: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.password"),
            trigger: "blur",
          },
          {
            min: 8,
            max: 16,
            message: this.$t("h.tips171"),
            trigger: "blur",
          },
        ],
      },
      loadingStyle: {
        lock: true,
        text: this.$t("h.tips198"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      timer: null,
      second: 60,
    };
  },
  props: {
    protocolChecked: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isGetCode() {
      if (this.second != 60) return true;
      return false;
    },
  },
  methods: {
    // 发送验证码
    snedCode() {
      clearInterval(this.timer);
      this.$refs.tryAccountFormRef.validateField("phone", async (valie) => {
        console.log("phone");
        if (valie) return false;
        // 国际化
        let lan = localStorage.getItem("locale") || "en";
        let lanStr = lan == "zh" ? "zh_CN" : "en_US";
        const { data: res } = await anonym({
          func: "A0001",
          language: lanStr,
          requstData: {
            phone: this.tryAccountForm.phone,
            register: 1,
          },
        }).catch(() => {
          // "服务器网络出错，请稍后重试"
          this.$message.error(this.$t("h.tips18"));
        });
        if (res.code != 0) return this.$message.error(res.data);
        this.timer = setInterval(() => {
          --this.second;
          if (!this.second) {
            clearInterval(this.timer);
            this.second = 60;
          }
        }, 1000);
      });
    },
    submitTryRegister() {
      this.$refs.tryAccountFormRef.validate(async (valid) => {
        if (!valid) return false;
        if (!this.protocolChecked) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips192"),
          });
        }
        const RES_LOADING = this.$loading(this.loadingStyle);
        // 国际化
        let lan = localStorage.getItem("locale") || "en";
        let lanStr = lan == "zh" ? "zh_CN" : "en_US";
        const { data: res } = await anonym({
          func: "A0015",
          requstData: this.tryAccountForm,
          language: lanStr,
        }).catch(() => {
          RES_LOADING.close();
          this.$message.error(this.$t("h.tips18"));
        });
        RES_LOADING.close();
        if (res.code != 0) return this.$message.error(res.data);
        this.$message.success(this.$t("h.tips204"));
        this.$refs.tryAccountFormRef.resetFields();
      });
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
.sumbit-btn {
  width: 280px;
  height: 50px;
  border-radius: 8px;
}
</style>
