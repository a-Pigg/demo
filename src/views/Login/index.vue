<template>
  <div class="login">
    <div class="login-map" :class="{ con: language == 'EN' }">
      <div
        class="board"
        v-if="serviseDetail.serverLevel == 0"
        @mouseenter="boardMouseenter"
        @mouseleave="boardMouseLeave"
      >
        <img src="@/assets/images/bulletin-board.png" class="board-bg" alt="" />
        <div class="borad-item" v-if="noticeList.length">
          <h3 class="title">{{ noticeList[noticeNum].title || "" }}</h3>
          <p class="content">
            {{ noticeList[noticeNum].content }}
          </p>
          <div class="time">
            <span> {{ noticeList[noticeNum].date }}</span>
          </div>
        </div>
        <ol class="circle" v-if="noticeList.length">
          <li
            v-for="(item, index) in noticeList"
            :key="item.id"
            :style="index == noticeNum ? 'background:#757573' : ''"
            @click="toggleNotice(index)"
          ></li>
        </ol>
        <div class="noNoticeNum" v-if="!noticeList.length">
          <span>{{ $t("h.title113") }}</span>
        </div>
      </div>
      <div class="logo">
        <img
          class="logo-img"
          :src="publicPath + 'userConfig/logo.png'"
          alt="logo"
        />
        <img
          v-if="language == 'ZH'"
          src="@/assets/images/logo-title.png"
          alt=""
        />
        <img v-else src="@/assets/images/fixed-assets.png" alt="" />
      </div>
    </div>
    <div class="login-handle">
      <div class="logo-color">
        <img :src="publicPath + 'userConfig/logo-color.png'" alt="" />
      </div>
      <div class="certificate" v-if="serviseDetail.serverLevel != 0">
        <el-button
          type="primary"
          size="mini"
          @click="copyIdCard"
          :loading="copyLoading"
          >{{ $t("h.title114") }}</el-button
        >
        <div class="upload-btn">
          <el-popover placement="bottom" width="auto" trigger="click">
            <el-upload
              class="upload-demo"
              drag
              action="http://127.0.0.1:20174/v1.1/uploads/certificate"
              name="multipartFile"
              :on-success="uploadFileSuccess"
              :on-error="uploadFileError"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                {{ $t("h.title115") }}<em>{{ $t("h.title116") }}</em>
              </div>
            </el-upload>
            <el-button type="primary" size="mini" slot="reference">{{
              $t("h.title117")
            }}</el-button>
          </el-popover>
        </div>
      </div>
      <div class="login-handle-contain">
        <div class="system-info">
          <!-- <h1>{{ systemName }}</h1> -->
          <h1>{{ $t("h.system") }}</h1>
        </div>
        <div class="login-form">
          <keep-alive>
            <component
              :is="currentView"
              :serverId="serviseDetail.serverId"
              :serverLevel="serviseDetail.serverLevel"
              :protocolChecked="protocolChecked"
              @goForGetPassword="goForGetPassword"
            >
            </component>
          </keep-alive>
          <div v-show="!loginOrRegister" class="account" @click="goRegister">
            {{ $t("h.tips12")
            }}<span>{{ $t("h.register") }}{{ $t("h.tips229") }}</span>
          </div>
          <div v-show="loginOrRegister" class="account" @click="goLogin">
            {{ $t("h.tips13") }}<span>{{ $t("h.loginBtn") }}</span>
          </div>
          <div
            class="trial-account"
            @click="goTryRegister"
            v-if="serviseDetail.serverLevel == 0"
          >
            <span>{{ $t("h.accountTrial") }}</span>
          </div>
          <div
            class="trial-account"
            @click="goTrialActivation"
            v-if="serviseDetail.serverLevel != 0"
          >
            <span>{{ $t("h.title118") }}</span>
          </div>
        </div>
        <div class="clause">
          <el-checkbox v-model="protocolChecked" v-show="protocol">
            {{ $t("h.tips14") }}
            <a
              v-if="language == 'ZH'"
              :href="url + '线上固资免责协议.pdf'"
              target="_blank"
              >《{{ $t("h.tips15") }}》</a
            >
          </el-checkbox>
          <div class="version-detail" v-if="serviseDetail.serverLevel != 0">
            <p>{{ $t("h.title119") }}v{{ serviseDetail.version }}</p>
            <p class="web-version">{{ $t("h.title120") }}v01.01.12.00</p>
          </div>
        </div>
        <div
          class="equity"
          @click="goVersionEquity"
          v-if="serviseDetail.serverLevel == 0"
        >
          <img
            v-if="language == 'ZH'"
            src="@/assets/images/icon-equity-left.png"
            class="equity-left"
          />
          <img
            v-else
            src="@/assets/images/icon-equity-left2.png"
            class="equity-left2"
          />
          <img src="@/assets/images/icon-equity-right.png" alt="" />
        </div>
      </div>
      <div class="full">
        <!-- <span class="lan">{{ language }}</span> -->
        <el-select v-model="language" size="mini" @change="changeLangEvent()">
          <el-option
            v-for="item in languageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { anonym, operation } from "@/assets/api";
import LoginIn from "@/components/LoginComponents/LoginIn";
import Register from "@/components/LoginComponents/Register";
import ForgetPassword from "@/components/LoginComponents/ForgetPassword";
import OffForgetPassword from "@/components/LoginComponents/OffForgetPassword";
import TryRegister from "@/components/LoginComponents/TryRegister";
import TrialActivation from "@/components/LoginComponents/TrialActivation";
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL,
      copyLoading: false,
      protocolChecked: false,
      currentView: "LoginIn",
      noticeList: [],
      noticeNum: 0,
      noticeTimer: null,
      serviseDetail: {
        project: "",
        serverId: "",
        serverLevel: "0",
        version: this.$t("h.tips207"),
      },
      url: window.$EXCEL_URL,
      systemName: window.$USER_NAME,
      language: localStorage.getItem("lang") || "ZH",
      languageOptions: [
        {
          value: "ZH",
          label: "简体中文",
        },
        {
          value: "EN",
          label: "English",
        },
      ],
    };
  },
  components: {
    LoginIn,
    Register,
    ForgetPassword,
    OffForgetPassword,
    TryRegister,
    TrialActivation,
  },
  computed: {
    loginOrRegister() {
      if (this.currentView != "LoginIn") return true;
      else return false;
    },
    protocol() {
      if (
        this.currentView == "OffForgetPassword" ||
        this.currentView == "ForgetPassword"
      ) {
        return false;
      }
      return true;
    },
  },
  methods: {
    // 请求服务详情，鉴别为线上还是线下
    getServiseDetail() {
      let lan = localStorage.getItem("locale") || "en";
      let lanStr = lan == "zh" ? "zh_CN" : "en_US";
      anonym({
        func: "A0005",
        language: lanStr,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(this.$t("h.tips208"));
          this.serviseDetail.project = data.data.project;
          this.serviseDetail.serverId = data.data.serverId;
          this.serviseDetail.serverLevel = data.data.serverLevel;
          this.serviseDetail.version = data.data.version;
          window.localStorage.setItem("refres", data.data.refres);
          window.localStorage.setItem("SERVER", this.serviseDetail.serverLevel);
          if (this.serviseDetail.serverLevel == 0) this.getSystemNotice();
        })
        .catch(() => {
          // "服务器网络异常,请求服务器详情失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 请求系统公告
    async getSystemNotice() {
      const { data: res } = await operation({
        func: "O0008",
        requstData: {
          type: "notice",
        },
      }).catch(() => {
        // "服务器网络错误，获取公告失败"
        this.$message.error(this.$t("h.tips18"));
      });
      if (res.code != 0) return this.$message.error(res.data);
      this.noticeList = res.data;
      this.autoPalyNotice();
    },
    toggleNotice(index) {
      this.noticeNum = index;
    },
    autoPalyNotice() {
      this.noticeTimer = setInterval(() => {
        if (this.noticeNum < this.noticeList.length - 1) {
          this.noticeNum++;
        } else {
          this.noticeNum = 0;
        }
      }, 2000);
    },
    boardMouseenter() {
      clearInterval(this.noticeTimer);
    },
    boardMouseLeave() {
      this.autoPalyNotice();
    },
    // 复制下载证书
    copyIdCard() {
      this.copyLoading = true;
      axios
        .post("http://127.0.0.1:20174/v1.1/select/certificate")
        .then(({ data }) => {
          this.copyLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          var input = document.createElement("input");
          input.value = data.data;
          document.body.appendChild(input);
          input.select();
          document.execCommand("Copy");
          document.body.removeChild(input);
          this.$message.success(this.$t("h.tips209"));
        })
        .catch(() => {
          this.copyLoading = false;
          this.$message.error(this.$t("h.tips210"));
        });
    },
    // 证书上次成功钩子
    uploadFileSuccess() {
      location.reload();
      this.$message.success(this.$t("h.tips211"));
    },
    // 证书上次失败钩子
    uploadFileError() {
      this.$message.error(this.$t("h.tips212"));
    },
    // 转忘记密码
    goForGetPassword() {
      if (this.serviseDetail.serverLevel != 0)
        this.currentView = "OffForgetPassword";
      else this.currentView = "ForgetPassword";
    },
    // 试用注册
    goTryRegister() {
      this.protocolChecked = false;
      this.currentView = "TryRegister";
    },
    goTrialActivation() {
      this.protocolChecked = false;
      this.currentView = "TrialActivation";
    },
    goRegister() {
      this.protocolChecked = false;
      this.currentView = "Register";
    },
    goLogin() {
      this.protocolChecked = false;
      this.currentView = "LoginIn";
    },
    goVersionEquity() {
      this.$router.push({ path: "/VersionEquity" });
    },
    changeLangEvent() {
      if (this.language == "ZH") {
        localStorage.setItem("locale", "zh");
        this.$i18n.locale = localStorage.getItem("locale");
        this.$message({
          message: "切换为中文！",
          type: "success",
        });
        localStorage.setItem("lang", "ZH");
        // this.language = "ZH";
      } else if (this.language == "EN") {
        localStorage.setItem("locale", "en");
        this.$i18n.locale = localStorage.getItem("locale");
        this.$message({
          message: "Switch to English!",
          type: "success",
        });
        localStorage.setItem("lang", "EN");
        // this.language = "EN";
      }
    },
  },
  created() {
    // console.log(navigator.userLanguage); //ie浏览器 首选语言
    // console.log(navigator.browserLanguage);
    // console.log(navigator.language); //谷歌浏览器 首选语言
    this.language = localStorage.getItem("lang") || "EN";
    if (this.language == "EN") {
      localStorage.setItem("lang", this.language);
      localStorage.setItem("locale", "en");
    } else {
      localStorage.setItem("lang", this.language);
      localStorage.setItem("locale", "zh");
    }
    this.$i18n.locale = localStorage.getItem("locale");
    // console.log(this.language);
    this.getServiseDetail();
    // this.changeLangEvent();
    sessionStorage.clear();
  },
  beforeDestroy() {
    clearInterval(this.noticeTimer);
  },
};
</script>
<style lang="scss" scoped>
.login {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-x: auto;
  .login-map {
    position: relative;
    flex: 1;
    min-width: 600px;
    background: url(../../assets/images/login-pic.png) no-repeat;
    background-size: cover;
    background-position: 50%;
    &.con {
      position: relative;
      flex: 1;
      min-width: 600px;
      background: url(../../assets/images/login-pic2.png) no-repeat;
      background-size: cover;
      background-position: 50%;
    }
    .board {
      position: absolute;
      top: 8%;
      right: 8%;
      min-width: 300px;
      width: 38%;
    }
    .board-bg {
      width: 100%;
    }
    .noNoticeNum {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 24px;
    }
    .borad-item {
      padding: 0 5% 15px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    .title {
      display: flex;
      justify-content: center;
      margin-top: 13%;
      margin-bottom: 6%;
      font-size: 18px;
    }
    .content {
      margin: 0 auto;
      margin-left: 5%;
      width: 90%;
      height: 56%;
      text-indent: 25px;
      font-size: 14px;
      overflow: auto;
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
    .time {
      font-size: 14px;
      text-align: right;
      margin-right: 5%;
    }
    .logo {
      position: absolute;
      top: 30px;
      left: 45px;
    }
    .logo-img {
      width: 40px;
      height: 40px;
      margin-right: 15px;
    }
  }
  .login-handle {
    position: relative;
    flex: 1;
    min-width: 600px;
    width: 100%;
    background: #fff;
    overflow: auto;
    .login-handle-contain {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      // width: 100%;
      padding: 50px 0 50px 0;
      width: 550px;
      height: 75%;
      overflow: auto;
      background-color: #fff;
      box-shadow: 4px 5px 13px 0px rgba(17, 38, 59, 0.1);
      border-radius: 10px;
      box-sizing: border-box;
    }
    .logo-color {
      position: absolute;
      top: 30px;
      left: 45px;
    }
    .full {
      position: fixed;
      top: 10px;
      right: 73px;
      ::v-deep .el-select {
        width: 110px;
      }
    }
  }
}
.equity {
  position: absolute;
  top: 4px;
  right: 5px;
  cursor: pointer;
  .equity-left {
    position: absolute;
    left: -80px;
    top: 50%;
    transform: translateY(-50%);
  }
  .equity-left2 {
    position: absolute;
    left: -130px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.certificate {
  display: flex;
  position: absolute;
  top: 20px;
  right: 120px;
  .upload-btn {
    margin-left: 22px;
  }
  .el-button {
    border-radius: 2px;
  }
}
.system-info {
  position: relative;
  width: 100%;
  text-align: center;
  h1 {
    padding-top: 50px;
    font-size: 24px;
    font-weight: bold;
    color: #352d7d;
    overflow: hidden;
  }
}
.login-form {
  margin: 25px auto 0;
  width: 350px;
  text-align: center;
  .trial-account {
    font-size: 12px;
    cursor: pointer;
    margin-top: 5px;
    color: #40388b;
  }
  .account {
    font-size: 12px;
    cursor: pointer;
    span {
      color: #40388b;
    }
  }
}
.clause {
  // margin-top: 50px;
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  .version-detail {
    margin-top: 5px;
    display: flex;
    justify-content: center;
    .web-version {
      position: relative;
      margin-left: 24px;
    }
    .web-version::before {
      position: absolute;
      top: 3px;
      left: -12px;
      content: "";
      display: block;
      width: 2px;
      height: 12px;
      background: #cccccc;
    }
  }
}
.circle {
  position: absolute;
  left: 50%;
  bottom: 6%;
  transform: translateX(-50%);
  display: flex;
  li {
    cursor: pointer;
    margin: 0 3px;
    width: 8px;
    height: 8px;
    // background: #757573;
    background: #ccc;
    border-radius: 50%;
  }
}
</style>
