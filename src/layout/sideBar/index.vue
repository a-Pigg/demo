<template>
  <div class="menu-content">
    <!-- toggle按钮 -->
    <div
      :class="'toggle-btn ' + isToggleClass"
      @click="isCollapse = !isCollapse"
    >
      <i class="el-icon-arrow-left arrow"></i>
    </div>
    <!-- 个人信息栏 -->
    <div class="user-info">
      <div
        :class="'user-info-portrait ' + isToggleClass"
        @click.stop="isShowCard = !isShowCard"
      >
        <img class="user-img" src="@/assets/images/head-portrait.png" />
        <span class="company">{{ company }}</span>
      </div>
    </div>
    <!-- 动画展示个人信息栏 -->
    <el-collapse-transition>
      <div
        v-show="isShowCard"
        @click.stop="isShowCard = true"
        class="user-card"
      >
        <div class="user-card-header">
          <div class="bg"></div>
          <div class="card-id">
            <img class="card-id-img" src="@/assets/images/head-portrait.png" />
            <h3 class="card-id-name">{{ userInfo.staffName }}</h3>
            <h6 class="card-id-roles">{{ userInfo.roleName }}</h6>
          </div>
        </div>
        <div class="user-card-main">
          <ul class="func-list" v-show="userCardShow == 'list'">
            <li
              v-if="isSuperUser"
              class="func-list-item"
              @click="userCardShow = 'open'"
            >
              <i class="ds-icon el-icon-lock"></i>
              <span>{{ $t("h.tips213") }}</span>
            </li>
          </ul>
          <div class="open-api-password" v-show="userCardShow == 'open'">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('h.tips214')"
              placement="top"
            >
              <i class="old-password-icon el-icon-question"></i>
            </el-tooltip>
            <el-form
              ref="openApiFormRef"
              size="small"
              :model="openApiForm"
              :rules="openApiRules"
              label-position="top"
              label-width="70px"
            >
              <el-form-item :label="$t('h.oldPassword')" prop="oldPassword">
                <el-input
                  :placeholder="$t('h.tips3') + $t('h.oldPassword')"
                  show-password
                  v-model="openApiForm.oldPassword"
                >
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('h.newPassword')" prop="newPassword">
                <el-input
                  :placeholder="$t('h.tips3') + $t('h.newPassword')"
                  show-password
                  v-model="openApiForm.newPassword"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <ul class="system-maxlimit" v-show="userCardShow == 'list'">
            <li class="system-maxlimit-item">
              <span class="title">{{ $t("h.tips215") }}</span>
              <span class="text">{{ maxLimit.assetExcelSize }}</span>
              {{ $t("h.tips45") }}
            </li>
            <li class="system-maxlimit-item">
              <span class="title">{{ $t("h.tips216") }}</span>
              <span class="text">{{ maxLimit.assetLabelPrint }}</span>
              {{ $t("h.tips217") }}
            </li>
            <li class="system-maxlimit-item">
              <span class="title">{{ $t("h.tips218") }}</span>
              <span class="text">{{ maxLimit.pictureSize }}</span> kb
            </li>
            <li class="system-maxlimit-item" v-if="SERVER == 0">
              <span class="title">{{ $t("h.tips219") }}</span>
              <span class="text">{{ maxLimit.useDate }}</span>
              {{ $t("h.tips220") }}
            </li>
            <li class="system-maxlimit-item" v-if="SERVER == 0">
              <span class="title">{{ $t("h.tips221") }}</span>
              <span class="text">{{ maxLimit.date }}</span>
            </li>
          </ul>
        </div>
        <div class="user-card-footer">
          <div class="exit-btn" v-show="userCardShow == 'list'">
            <el-button
              class="exit-login"
              type="primary"
              size="small"
              @click="exitLogin"
              >{{ $t("h.tips222") }}</el-button
            >
          </div>
          <div class="open-btn" v-show="userCardShow == 'open'">
            <el-button @click="openApiCancal" size="small">{{
              $t("h.cancelBtn")
            }}</el-button>
            <el-button
              @click="editOpenApiPassword"
              size="small"
              type="primary"
              >{{ $t("h.confirmBtn") }}</el-button
            >
          </div>
        </div>
      </div>
    </el-collapse-transition>
    <!-- 菜单 -->
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#131A5C"
      active-text-color="#3C3BCD"
      text-color="#fff"
      unique-opened
      router
      :collapse="isCollapse"
      :default-active="$route.path"
      @select="menuSelect"
    >
      <sidebar-item :subMenuList="sidebarMenu"></sidebar-item>
    </el-menu>
  </div>
</template>
<script>
import sidebarItem from "./sidebarItem";
import { mapState, mapMutations } from "vuex";
// import { debounce } from "@/utils/basic-methods";
import { update } from "@/assets/api";
import { getCookie, clearCookie } from "@/utils/Cookie";
export default {
  components: { sidebarItem },
  data() {
    return {
      isCollapse: false,
      isShowCard: false,
      userCardShow: "list",
      openApiForm: {
        oldPassword: "",
        newPassword: "",
      },
      openApiRules: {
        oldPassword: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.oldPassword"),
            trigger: "blur",
          },
          { min: 4, max: 6, message: this.$t("h.tips223"), trigger: "blur" },
        ],
        newPassword: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.newPassword"),
            trigger: "blur",
          },
          { min: 4, max: 6, message: this.$t("h.tips223"), trigger: "blur" },
        ],
      },
      company: "",
      SERVER: "",
    };
  },
  computed: {
    ...mapState(["sidebarMenu", "maxLimit", "userInfo"]),
    isToggleClass() {
      if (this.isCollapse) return "toggle";
      else return "";
    },
    isSuperUser() {
      if (this.userInfo.roleId == 1 && this.maxLimit.openService) return true;
      return false;
    },
  },
  methods: {
    ...mapMutations(["LOGINOUT"]),
    // 监听什么时候缩小menu
    screenAdapter() {
      // 兼容所有浏览器
      const browserWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (browserWidth <= 1200) this.isCollapse = true;
      else this.isCollapse = false;
    },
    hideUserCard(e) {
      if (e.target.className != "user-card") {
        this.$refs.openApiFormRef.resetFields();
        this.userCardShow = "list";
        this.isShowCard = false;
      }
    },
    // 退出登录
    exitLogin() {
      this.$confirm(this.$t("h.tips224"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          clearCookie(
            encodeURIComponent(
              window.sessionStorage.getItem("loginCompanyName") +
                this.userInfo.phone
            )
          );
          window.sessionStorage.clear();
          this.LOGINOUT();
          location.reload();
          this.$message({
            type: "success",
            message: this.$t("h.tips225"),
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("h.tips226"),
          });
        });
    },
    // 取消修改开放接口密码
    openApiCancal() {
      this.$refs.openApiFormRef.resetFields();
      this.userCardShow = "list";
    },
    // 修改开放接口密码
    editOpenApiPassword() {
      this.$refs.openApiFormRef.validate(async (valid) => {
        if (!valid) return false;
        const { data: res } = await update({
          func: "U0063",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            openPasswordNew: this.openApiForm.newPassword,
            openPasswordOld: this.openApiForm.oldPassword,
            permissonId: 23,
          },
        }).catch(() => {
          // "服务器网络错误，修改接口密码失败"
          this.$message.error(this.$t("h.tips18"));
        });
        if (res.code != 0) return this.$message.error(res.data);
        this.$message.success(res.data);
        this.$refs.openApiFormRef.resetFields();
      });
    },
    menuSelect() {
      if (
        !getCookie(
          encodeURIComponent(
            window.sessionStorage.getItem("loginCompanyName") +
              this.userInfo.phone
          )
        )
      ) {
        this.$alert(this.$t("h.tips227"), this.$t("h.title18"), {
          confirmButtonText: this.$t("h.confirmBtn"),
          callback: () => {
            window.location.reload();
          },
        });
      }
    },
  },
  created() {
    this.company = window.sessionStorage.getItem("loginCompanyName");
    this.SERVER = window.localStorage.getItem("SERVER");
  },
  mounted() {
    document.addEventListener("click", this.hideUserCard, 300);
    window.addEventListener("resize", this.screenAdapter);
    // window.addEventListener("resize", debounce(this.screenAdapter, 50));
  },
  beforeDestroy() {
    document.removeEventListener("click", this.hideUserCard, 300);
    window.removeEventListener("resize", this.screenAdapter);
    // window.removeEventListener("resize", debounce(this.screenAdapter, 50));
  },
};
</script>
<style lang="scss" scoped>
.menu-content {
  position: relative;
  height: 100%;
  background-color: #131a5c;
  z-index: 3001;
  .el-menu {
    height: calc(100% - 200px);
    overflow: hidden;
    border-right: none;
    &:hover {
      overflow: auto;
    }
    /*滚动条样式*/
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #545f88;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: #131a5c;
    }
  }
  .toggle-btn {
    position: absolute;
    top: 25px;
    right: -12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    background-color: #fff;
    box-shadow: 0px 0px 20px 0px rgba(3, 14, 110, 0.3);
    .arrow {
      transition: all 0.3s;
      font-size: 16px;
      font-weight: bold;
      color: #131a5c;
    }
  }
  .user-card {
    position: absolute;
    top: 70px;
    right: -260px;
    width: 252px;
    overflow: hidden;
    border: 1px solid #eeeeef;
    border-radius: 15px;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.95);
  }
}
.user-card-header {
  width: 250px;
  height: 150px;
  .bg {
    height: 60px;
    background-color: rgba($color: #131a5c, $alpha: 0.9);
  }
  .card-id {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30px;
    height: 90px;
    box-sizing: border-box;
    .card-id-img {
      position: absolute;
      top: -30px;
      left: 95px;
      width: 60px;
      height: 60px;
      overflow: hidden;
    }
    .card-id-name {
      line-height: 32px;
      color: #588ab9;
      font-size: 18px;
      font-weight: 500;
    }
    .card-id-roles {
      font-size: 12px;
      font-weight: 400;
      color: #b9b9c3;
    }
  }
}
.user-card-main {
  padding: 10px 15px;
  .func-list {
    display: flex;
    flex-wrap: wrap;
    .func-list-item {
      padding: 8px 10px;
      flex: 0 0 33.33%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      height: 75px;
      cursor: pointer;
      color: #626262;
      text-align: center;
      border-radius: 4px;
    }
    .func-list-item:hover {
      color: #ffffff;
      background-color: #6891fc;
    }
    .ds-icon {
      font-size: 21px;
    }
  }
  .system-maxlimit {
    .system-maxlimit-item {
      text-align: left;
      font-size: 14px;
      color: #b9b9c3;
    }
    .text {
      color: #588ab9;
      font-weight: bold;
    }
  }
  ::v-deep .open-api-password {
    text-align: left;
    .el-form-item__label {
      line-height: 20px;
      padding: 0;
      font-size: 12px;
    }
    .old-password-icon {
      margin-left: 8px;
      color: #473bb4;
      font-size: 18px;
    }
  }
}
.user-card-footer {
  margin: 10px 0;
  padding: 0 20px;
  height: 32px;
  .exit-login {
    width: 100%;
  }
  .open-btn {
    text-align: center;
  }
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 200px;
  box-sizing: border-box;
  color: #fff;
  .user-info-portrait {
    position: relative;
    cursor: pointer;
    .user-img {
      transition: all 0.3s;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
    }
    .company {
      transition: all 0.3s;
      position: absolute;
      left: 50%;
      bottom: -25px;
      transform: translateX(-50%);
      width: 220px;
      text-align: center;
      font-size: 16px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.toggle {
  .user-img {
    width: 40px !important;
    height: 40px !important;
  }
  .company {
    width: 44px !important;
    opacity: 0 !important;
  }
  .arrow {
    transform: rotate(180deg);
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
}
</style>
