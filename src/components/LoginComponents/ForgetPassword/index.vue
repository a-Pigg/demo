<template>
  <div class="forget">
    <el-form ref="forgetFormRef" :model="forgetForm" :rules="forgetFormRules">
      <el-form-item prop="companyName">
        <el-input
          v-model.trim="forgetForm.companyName"
          clearable
          :placeholder="$t('h.tips3') + $t('h.company')"
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
      <el-form-item prop="code">
        <el-input
          v-model="forgetForm.code"
          :placeholder="$t('h.tips3') + $t('h.verificationCode')"
        >
          <el-button
            class="code-btn"
            slot="append"
            :disabled="!isGetCode"
            @click="sendVerificationCode"
          >
            <span v-if="isGetCode">{{ $t("h.send") }}</span>
            <span v-else>{{ $t("h.await") }}：{{ s }}{{ $t("h.second") }}</span>
          </el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          type="password"
          v-model="forgetForm.password"
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
  name: "ForgetPassword",
  data() {
    return {
      forgetForm: {
        companyName: "",
        phone: "",
        code: "",
        password: "",
      },
      forgetFormRules: {
        companyName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.company"),
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
        code: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.verificationCode"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.newPassword"),
            trigger: "blur",
          },
        ],
      },
      isGetCode: true,
      s: 60,
      timer: null,
    };
  },
  methods: {
    sendVerificationCode() {
      try {
        clearInterval(this.timer);
        if (this.isGetCode) {
          this.$refs.forgetFormRef.validateField("phone", (valid) => {
            if (valid) return false;
            let lan = localStorage.getItem("locale") || "en";
            let lanStr = lan == "zh" ? "zh_CN" : "en_US";
            anonym({
              func: "A0001",
              language: lanStr,
              requstData: {
                phone: this.forgetForm.phone,
                register: 2,
              },
            })
              .then((res) => {
                if (res.data.code != 0) {
                  return this.$message.error(res.data.data);
                } else {
                  this.isGetCode = false;
                  this.timer = setInterval(() => {
                    --this.s;
                    if (this.s == 0) {
                      this.isGetCode = true;
                      clearInterval(this.timer);
                      this.s = 60;
                    }
                  }, 1000);
                }
              })
              .catch(() => {
                this.$message.error(this.$t("h.tips18"));
              });
          });
        }
      } catch (e) {
        // console.log(e)
      }
    },
    submitForgetForm() {
      this.$refs.forgetFormRef.validate(async (valid) => {
        if (!valid) return false;
        let lan = localStorage.getItem("locale") || "en";
        let lanStr = lan == "zh" ? "zh_CN" : "en_US";
        const { data: res } = await anonym({
          func: "A0008",
          language: lanStr,
          requstData: this.forgetForm,
        }).catch(() => {
          // "服务器网络错误，修改密码失败"
          this.$message.error(this.$t("h.tips18"));
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
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
.send-btn {
  width: 280px;
  height: 50px;
  border-radius: 8px;
}
.code-btn {
  border: none !important;
}
</style>
