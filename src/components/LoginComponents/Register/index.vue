<template>
  <div class="register">
    <el-form
      ref="registerFormRef"
      :model="registerForm"
      :rules="registerFormRules"
    >
      <el-form-item prop="conpanyName">
        <el-input
          v-model.trim="registerForm.conpanyName"
          :placeholder="$t('h.tips3') + $t('h.company')"
        >
        </el-input>
      </el-form-item>
      <!-- 线上 -->
      <el-form-item v-if="serverLevel == 0" prop="registrationNo">
        <el-input
          v-model.trim="registerForm.registrationNo"
          :placeholder="$t('h.tips3') + $t('h.registrationCode')"
        >
        </el-input>
      </el-form-item>
      <!-- 私有化部署 -->
      <el-form-item v-if="serverLevel != 0" prop="activationCode">
        <el-input
          v-model.trim="registerForm.activationCode"
          :placeholder="$t('h.tips3') + $t('h.tips194')"
        >
          <el-popover slot="suffix" placement="top" width="250">
            <div class="qrcode-form" v-show="!isShowCode">
              <el-form-item prop="code">
                <el-input
                  v-model.trim="registerForm.code"
                  :placeholder="$t('h.tips3') + $t('h.registrationCode')"
                >
                </el-input>
              </el-form-item>
              <el-button type="text" @click="createActivateQRCode">{{
                $t("h.tips195")
              }}</el-button>
            </div>
            <div class="qrcode-image" v-show="isShowCode">
              <div id="QRcode"></div>
              <el-button @click="reloadQRcode" type="text">{{
                $t("h.tips196")
              }}</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">{{
              $t("h.tips197")
            }}</el-button>
          </el-popover>
        </el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          v-model.trim="registerForm.name"
          :placeholder="$t('h.tips3') + $t('h.nickname')"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          v-model.trim="registerForm.phone"
          :placeholder="$t('h.tips3') + $t('h.userName')"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          v-model.trim="registerForm.password"
          :placeholder="$t('h.tips16')"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="submit-btn"
          type="primary"
          @click="submitRegisterForm"
          >{{ $t("h.register") }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { anonym } from "@/assets/api";
import QRCode from "qrcodejs2";
export default {
  name: "Register",
  data() {
    return {
      isShowCode: false,
      registerForm: {
        conpanyName: "",
        name: "",
        phone: "",
        password: "",
        // 线下注册码
        code: "",
        //线上注册码
        registrationNo: "",
        // 激活码
        activationCode: "",
      },
      registerFormRules: {
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
            message: this.$t("h.tips3") + this.$t("h.userName"),
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.userName"),
            trigger: "blur",
          },
          // { min: 11, max: 11, message: this.$t("h.tips170"), trigger: "blur" },
        ],
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
        // activationCode: [
        //   { required: true, message: "请输入激活码", trigger: "blur" },
        // ],
        registrationNo: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.registrationCode"),
            trigger: "blur",
          },
        ],
        // code: [{ required: true, message: "请输入注册码", trigger: "blur" }],
      },
      loadingStyle: {
        lock: true,
        text: this.$t("h.tips198"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
    };
  },
  props: ["serverId", "serverLevel", "protocolChecked"],
  methods: {
    // 线下部署生成 获取激活码 的 二维码链接
    createActivateQRCode() {
      // this.$refs.registerFormRef.validateField("code", (err) => {
      // if (err) return false;
      if (!this.registerForm.code)
        return this.$notify.error({
          title: this.$t("h.title27"),
          message: this.$t("h.tips3") + this.$t("h.registrationCode"),
        });
      if (!this.serverId)
        return this.$message.error(this.$t('h.tips199'));
      this.isShowCode = true;
      let qrCode = document.getElementById("QRcode");
      qrCode.innerHTML = "";
      const CODE_URL = window.$CODE_URL;
      new QRCode(qrCode, {
        text: `${CODE_URL}?code=${this.registerForm.code}&serviceId=${this.serverId}`,
        width: 85,
        height: 85,
        colorDark: "#000",
        colorLight: "#fff",
      });
      // });
    },
    // 重新生成 激活码 的二维码链接
    reloadQRcode() {
      this.isShowCode = false;
    },
    // 发送注册账号信息
    submitRegisterForm() {
      this.$refs.registerFormRef.validate(async (valid) => {
        // if (!this.registerForm.code && this.serverLevel != 0) {
        //   return this.$notify.error({ title: "错误", message: "请输入注册码" });
        // }
        if (!valid) return false;
        if (!this.protocolChecked) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips192"),
          });
        }
        const REGISTER_LOADIN = this.$loading(this.loadingStyle);
        // 国际化
        let lan = localStorage.getItem("locale") || "en";
        let lanStr = lan == "zh" ? "zh_CN" : "en_US";
        const { data: res } = await anonym({
          func: "A0003",
          language: lanStr,
          requstData: this.registerForm,
        }).catch(() => {
          REGISTER_LOADIN.close();
          // "服务器网络错误，注册失败"
          this.$message.error(this.$t("h.tips18tips3"));
        });
        REGISTER_LOADIN.close();
        if (res.code != 0) return this.$message.error(res.data);
        this.$message.success(this.$t("h.tips200"));
        this.$refs.registerFormRef.resetFields();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.submit-btn {
  width: 280px;
  height: 50px;
  border-radius: 8px;
}
.qrcode-form {
  text-align: center;
}
.qrcode-image {
  text-align: center;
  #QRcode {
    margin: 0 auto;
    width: 85px;
    height: 85px;
  }
}
</style>
