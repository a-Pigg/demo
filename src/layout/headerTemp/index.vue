<template>
  <div class="header-container">
    <!-- 切换账号 -->
    <!-- <div class="switch-account"></div> -->
    <!-- 系统名称 -->
    <div class="system-name">
      <!-- <span>{{ navName }}</span> -->
      <span>{{ $t("h.system") }}</span>
    </div>
    <!-- 系统工具 -->
    <div class="system-tool">
      <el-button type="text" class="echart-btn" @click="goScreen">
        <i class="el-icon-data-analysis"></i>
        <!-- <span>可视化大屏</span> -->
        <span>{{ $t("h.full") }}</span>
      </el-button>
      <el-dropdown :hide-on-click="false" @command="downloadDropdownCommand">
        <div class="system-tool-download">
          <img src="@/assets/images/download-center-icon.png" />
          <!-- <span>下载中心</span> -->
          <span>{{ $t("h.downloadCenter") }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="下载驱动">
            <img :src="'userConfig/logo-color.png'" alt="" />
            <!-- <span>下载驱动</span> -->
            <span>{{ $t("h.downloadDrive") }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown :hide-on-click="false" @command="helpDropdowmCommand">
        <div class="system-tool-help">
          <img src="@/assets/images/help-center-icon.png" />
          <!-- <span>帮助中心</span> -->
          <span>{{ $t("h.helpCenter") }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="使用手册">
            <img src="@/assets/images/use-manual-icon.png" alt="" />
            <!-- <span>使用手册</span> -->
            <span>{{ $t("h.userGuide") }}</span>
          </el-dropdown-item>
          <!-- <el-dropdown-item command="视频教程">
            <img src="@/assets/images/video-course-icon.png" alt="" />
            <span>视频教程</span>
          </el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { clickDownloadLink } from "@/utils/basic-methods";
export default {
  data() {
    return {
      navName: window.$NAV_NAME,
    };
  },
  methods: {
    helpDropdowmCommand(command) {
      let lang = localStorage.getItem("lang");
      if (command == "使用手册") {
        if (lang == "EN") {
          return this.$message(
            "There is currently no English version of the manual available"
          );
        } else {
          // 跳转pdf
          let URL = window.$EXCEL_URL + "RFID固定资产管理系统操作手册.pdf";
          clickDownloadLink(URL, "_blank");
        }
      } else {
        return;
      }
    },
    downloadDropdownCommand(command) {
      if (command == "下载驱动") {
        let URL = window.$EXCEL_URL + `${this.$t("h.assetTemplate6")}.msi`;
        clickDownloadLink(URL);
      } else {
        return;
      }
    },
    goScreen() {
      this.$router.push({ path: "/Screen" });
    },
  },
};
</script>
<style lang="scss" scoped>
.header-container {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 60px;
  background: #fcfcff;
  .system-name {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    span {
      font-size: 26px;
      font-weight: bold;
      color: #352d7d;
      text-shadow: 2px 2px #c2c2d7;
    }
  }
  .system-tool {
    display: flex;
    align-items: center;
    margin-right: 30px;
    .el-dropdown {
      margin-left: 28px;
    }
  }
}
.system-tool-help,
.system-tool-download {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  span {
    margin-left: 3px;
    font-size: 14px;
    color: #352d7d;
  }
}
.el-dropdown-menu__item {
  img {
    width: 14px;
    margin-right: 5px;
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
  }
}
.echart-btn {
  color: #352d7d;
  i {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
