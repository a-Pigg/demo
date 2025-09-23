<template>
  <div class="login-contain">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
      <el-form-item prop="companyName">
        <el-select
          ref="companySelectRef"
          :placeholder="$t('h.tips3') + $t('h.company')"
          v-model.trim="loginForm.companyName"
          filterable
          allow-create
          clearable
          default-first-option
          @blur="recruitReasonBlur"
        >
          <el-option
            v-for="(item, index) in storageCompanyListData"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          v-model.trim="loginForm.phone"
          clearable
          :placeholder="$t('h.tips3') + $t('h.userName')"
        >
          <!-- :placeholder="$t('h.tips3') + $t('h.phoneNumber')" -->
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          v-model.trim="loginForm.password"
          :placeholder="$t('h.tips3') + $t('h.password')"
        >
        </el-input>
      </el-form-item>
      <template>
        <div class="forget-password">
          <!-- <span @click="goForGetPassword"
            >{{ $t("h.forgetThePassword") }}?</span
          > -->
        </div>
      </template>
      <el-form-item>
        <el-button type="primary" @click="submitLoginForm">
          {{ $t("h.loginBtn") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import { anonym } from "@/assets/api";
import { setCookie } from "@/utils/Cookie";
export default {
  name: "LoginIn",
  data() {
    return {
      loginForm: {
        phone: "",
        password: "",
        companyName: "",
      },
      loginFormRules: {
        phone: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.userName"),
            // message: this.$t("h.tips3") + this.$t("h.account"),
            trigger: "blur",
          },
          // {
          //   min: 11,
          //   max: 11,
          //   message: this.$t("h.tips170"),
          //   trigger: "blur",
          // },
        ],
        password: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.password"),
            trigger: "blur",
          },
          {
            min: 6,
            max: 16,
            message: this.$t("h.tips171"),
            trigger: "blur",
          },
        ],
        companyName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.company"),
            trigger: "blur",
          },
        ],
      },
      // 缓存登录过的公司
      storageCompanyListData: [],
      loadingStyle: {
        lock: true,
        text: this.$t("h.tips191"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
    };
  },
  props: {
    protocolChecked: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapMutations(["SET_USERINFO", "SET_PERMISSION", "SET_MAXLIMIT"]),
    ...mapActions([
      "GET_ASSETFORMHEADER",
      "GET_ASSETTABLEHEADER",
      "GET_ASSETSTATE",
      "GET_STORAGEMETHOD",
    ]),
    submitLoginForm() {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return false;
        if (!this.protocolChecked) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips192"),
          });
        }
        const LOGIN_LOADIND = this.$loading(this.loadingStyle);
        // 国际化
        let lan = localStorage.getItem("locale") || "en";
        let lanStr = lan == "zh" ? "zh_CN" : "en_US";
        anonym({
          func: "A0002",
          requstData: this.loginForm,
          language: lanStr,
        })
          .then(({ data }) => {
            LOGIN_LOADIND.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.SET_USERINFO(data.data[0]);
            this.SET_PERMISSION(data.data[1]);
            this.SET_MAXLIMIT(data.data[3]);
            setCookie(
              encodeURIComponent(
                this.loginForm.companyName + data.data[0].phone
              ),
              data.data[0].refreshToken,
              localStorage.getItem("refres")
            );
            window.sessionStorage.setItem(
              "loginCompanyName",
              this.loginForm.companyName
            );
            let companyListStr = window.localStorage.getItem("company");
            if (!companyListStr)
              window.localStorage.setItem(
                "company",
                `${this.loginForm.companyName},`
              );
            else {
              let companyList = companyListStr.split(",");
              let addFlag = true;
              for (let i = 0; i < companyList.length; i++) {
                if (this.loginForm.companyName == companyList[i])
                  addFlag = false;
              }
              if (addFlag)
                window.localStorage.setItem(
                  "company",
                  `${companyListStr}${this.loginForm.companyName},`
                );
            }
            this.GET_ASSETFORMHEADER(); //请求资产表头
            this.GET_ASSETTABLEHEADER(this.loginForm.companyName); //请求资产表头
            this.GET_ASSETSTATE(); //请求资产状态表
            this.GET_STORAGEMETHOD()  //请求入库方式表
            // 检测列表高级筛选配置单
            this.$router.replace({ path: "/Home" }).catch(() => {});
            this.$message.success(this.$t("h.tips193"));
          })
          .catch(() => {
            LOGIN_LOADIND.close();
            // "服务器网络异常,无法登录"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    goForGetPassword() {
      this.$emit("goForGetPassword");
    },
    recruitReasonBlur() {
      if (!this.$refs.companySelectRef.selectedLabel) return;
      this.loginForm.companyName = this.$refs.companySelectRef.selectedLabel;
    },
  },
  created() {
    if (window.localStorage.getItem("company")) {
      this.storageCompanyListData = window.localStorage
        .getItem("company")
        .split(",");
      this.storageCompanyListData.pop();
    }
    window.sessionStorage.clear();
  },
};
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.el-button {
  width: 280px;
  height: 50px;
  border-radius: 8px;
}
.forget-password {
  cursor: pointer;
  margin-top: -10px;
  margin-bottom: 20px;
  text-align: right;
  color: #73727f;
  font-size: 12px;
  &:hover {
    color: #40388b;
  }
}
</style>
