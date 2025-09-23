<template>
  <div class="screen-container" ref="screen-ref">
    <header class="screen-header">
      <div>
        <img src="@/assets/images/screen-header.png" alt="" />
        <span class="title">{{ $t("h.assetManagementSystem") }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top">
          <ul class="remind">
            <li class="remind-item" @click="goAudit">
              <img
                src="@/assets/images/remind-audit-icon.png"
                class="remind-img"
              />
              <span class="text">{{ $t("h.pendingApproval") }}</span>
              <span class="num">{{ waitAuditNum }}</span>
            </li>
            <li class="remind-item" @click="goList">
              <img
                src="@/assets/images/remind-repairs-icon.png"
                class="remind-img"
              />
              <span class="text">{{ $t("h.maintenanceExpiredAssets") }}</span>
              <span class="num">{{ repairNum }}</span>
            </li>
            <li class="remind-item" @click="goExpireAsset">
              <img
                src="@/assets/images/remind-due-icon.png"
                class="remind-img"
              />
              <span class="text">{{ $t("h.serviceLifeExpiredAssets") }}</span>
              <span class="num">{{ weibaoNum }}</span>
            </li>
            <li class="remind-item" @click="goError">
              <img
                src="@/assets/images/remind-safe-icon.png"
                class="remind-img"
              />
              <span class="text">{{
                $t("h.theMonthlyRepairExpiredAssets")
              }}</span>
              <span class="num">{{ wareNum }}</span>
            </li>
          </ul>
        </div>
        <div id="left-middle">
          <div class="state">
            <div class="text-icon">
              <img src="@/assets/images/state-icon.png" class="entrance-icon" />
              <h5 class="entrance-text">
                {{ $t("h.proportionOfAssetStatus") }}
              </h5>
            </div>
            <div class="statisticss">
              <state-pie :allData="statePieData"></state-pie>
            </div>
          </div>
          <div class="dept">
            <div class="text-icon">
              <img src="@/assets/images/dept-icon.png" class="entrance-icon" />
              <h5 class="entrance-text">
                {{ $t("h.proportionOfAssetDepartment") }}
              </h5>
            </div>
            <div class="statisticss">
              <dept-pie :allData="deptPieData"></dept-pie>
            </div>
          </div>
        </div>
        <div id="left-bottom">
          <div class="text-icon">
            <img
              src="@/assets/images/entrance-icon.png"
              class="entrance-icon"
            />
            <h5 class="entrance-text">{{ $t("h.quickAccess") }}</h5>
          </div>
          <ul class="entrance-list">
            <li class="entrance-item">
              <div class="title">
                <img src="@/assets/images/entrance-rect-1.png" alt="" />
                <span class="num num-one">1</span>
                <span class="text text-one">{{
                  $t("h.systemManagement")
                }}</span>
              </div>
              <ul class="link">
                <li class="link-item">
                  <router-link
                    :to="{ path: '/SystemSetting/Area' }"
                    class="around"
                    >{{ $t("h.Area") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/SystemSetting/Dept' }"
                    class="around"
                    >{{ $t("h.Dept") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/SystemSetting/Roles' }"
                    class="around"
                    >{{ $t("h.Roles") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/SystemSetting/Staff' }"
                    class="around"
                    >{{ $t("h.Staff") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/SystemSetting/Dict' }"
                    class="around"
                    >{{ $t("h.Dict") }}</router-link
                  >
                </li>
              </ul>
            </li>
            <li class="entrance-item retract">
              <div class="title">
                <img src="@/assets/images/entrance-rect-2.png" alt="" />
                <span class="num num-other">2</span>
                <span class="text text-other">{{ $t("h.assetSettings") }}</span>
              </div>
              <ul class="link">
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Set/DefinedCode' }"
                    class="around"
                    >{{ $t("h.DefinedCode") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Set/ExcelInfo' }"
                    class="around"
                    >{{ $t("h.ExcelInfo") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Set/Type' }"
                    class="around"
                    >{{ $t("h.Type") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Set/Label' }"
                    class="around"
                    >{{ $t("h.Label") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Set/ScrapReason' }"
                    class="around"
                    >{{ $t("h.ScrapReason") }}</router-link
                  >
                </li>
              </ul>
            </li>
            <li class="entrance-item retract">
              <div class="title">
                <img src="@/assets/images/entrance-rect-2.png" alt="" />
                <span class="num num-other">3</span>
                <span class="text text-other">{{ $t("h.AssetMange") }}</span>
              </div>
              <ul class="link">
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Received' }"
                    class="around"
                    >{{ $t("h.Received") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Using' }"
                    class="around"
                    >{{ $t("h.Using") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Revert' }"
                    class="around"
                    >{{ $t("h.Revert") }}
                  </router-link>
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Borrow' }"
                    class="around"
                    >{{ $t("h.Borrow") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Return' }"
                    class="around"
                    >{{ $t("h.Return") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Allocation' }"
                    class="around"
                    >{{ $t("h.Allocation") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Repair' }"
                    class="around"
                    >{{ $t("h.Repair") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Scrap' }"
                    class="around"
                    >{{ $t("h.Scrap") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Check' }"
                    class="around"
                    >{{ $t("h.Check") }}</router-link
                  >
                </li>
              </ul>
            </li>
            <li class="entrance-item retract">
              <div class="title">
                <img src="@/assets/images/entrance-rect-2.png" alt="" />
                <span class="num num-other">4</span>
                <span class="text text-other">{{ $t("h.ApprovalMange") }}</span>
              </div>
              <ul class="link">
                <li class="link-item">
                  <router-link
                    :to="{ path: '/ApprovalMange/Flow' }"
                    class="around"
                    >{{ $t("h.Flow") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/ApprovalMange/Mange' }"
                    class="around"
                    >{{ $t("h.Mange") }}</router-link
                  >
                </li>
              </ul>
            </li>
            <li class="entrance-item retract">
              <div class="title">
                <img src="@/assets/images/entrance-rect-2.png" alt="" />
                <span class="num num-other">5</span>
                <span class="text text-other">{{ $t("h.DataBackup") }}</span>
              </div>
              <ul class="link">
                <li class="link-item">
                  <router-link
                    :to="{ path: '/DataBackup/BackupAndRestore' }"
                    class="around"
                    >{{ $t("h.BackupAndRestore") }}</router-link
                  >
                </li>
              </ul>
            </li>
            <li class="entrance-item retract">
              <div class="title">
                <img src="@/assets/images/entrance-rect-3.png" alt="" />
                <span class="num num-other">6</span>
                <span class="text text-other">{{
                  $t("h.dataStatistics")
                }}</span>
              </div>
              <ul class="link">
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Report/AssetHistory' }"
                    class="around"
                    >{{ $t("h.AssetHistory") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Report/AssetStatement' }"
                    class="around"
                    >{{ $t("h.AssetStatement") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Report/AssetCategory' }"
                    class="around"
                    >{{ $t("h.AssetCategory") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Report/AssetCategoryUsed' }"
                    class="around"
                    >{{ $t("h.AssetCategoryUsed") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Report/AssetDept' }"
                    class="around"
                    >{{ $t("h.AssetDept") }}</router-link
                  >
                </li>
                <li class="link-item">
                  <router-link
                    :to="{ path: '/AssetMange/Report/ExpireAsset' }"
                    class="around"
                    >{{ $t("h.ExpireAsset") }}</router-link
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top">
          <div class="type">
            <div class="text-icon">
              <img src="@/assets/images/type-icon.png" class="entrance-icon" />
              <h5 class="entrance-text">
                {{ $t("h.assetCategoryStatistics") }}
              </h5>
            </div>
            <div class="statisticss">
              <type-bar :allData="barData"></type-bar>
            </div>
          </div>
        </div>
        <div id="right-bottom">
          <div class="new">
            <div class="text-icon">
              <img src="@/assets/images/new-icon.png" class="entrance-icon" />
              <h5 class="entrance-text">{{ $t("h.AdditionsToAssets") }}</h5>
              <div class="btns">
                <button
                  :class="isActive == false ? 'year-btn' : 'year-btn active'"
                  @click="onClickLastYear"
                >
                  {{ $t("h.title111") }}
                </button>
                <button
                  :class="isActive == true ? 'year-btn' : 'year-btn active'"
                  @click="onClickHalfYear"
                >
                  {{ $t("h.title112") }}
                </button>
              </div>
            </div>
            <div class="statisticss">
              <new-line :allData="newLineData"></new-line>
            </div>
          </div>
        </div>
      </section>
    </div>
    <button class="return-btn" @click="returnNextRouter">
      <img class="return-icon" src="@/assets/images/return-icon.png" alt="" />
      <span class="return-text">{{ $t("h.exit") }}</span>
    </button>
  </div>
</template>
<script>
import StatePie from "@/components/ScreenComponents/StatePie";
import DeptPie from "@/components/ScreenComponents/DeptPie";
import TypeBar from "@/components/ScreenComponents/TypeBar";
import NewLine from "@/components/ScreenComponents/NewLine";
import { select } from "@/assets/api";
import { mapState } from "vuex";
export default {
  components: {
    StatePie,
    DeptPie,
    TypeBar,
    NewLine,
  },
  data() {
    return {
      isActive: true,
      waitAuditNum: 0,
      repairNum: 0,
      weibaoNum: 0,
      wareNum: 0,
      lineData: [],
      barData: [],
      deptPieData: [],
      statePieData: [],
    };
  },
  computed: {
    ...mapState(["userInfo", "stateListData"]),
    newLineData() {
      if (this.isActive) return this.lineData;
      else return this.lineData.slice(-6);
    },
  },
  methods: {
    goAudit() {
      this.$router.push({ path: "/ApprovalMange/Task" });
    },
    goList() {
      this.$router.push({ path: "/AssetMange/List", query: { expired: true } });
    },
    goExpireAsset() {
      this.$router.push({ path: "/AssetMange/Report/ExpireAsset" });
    },
    goError() {
      this.$message.error(this.$t("h.tips186"));
    },
    // 设置全屏显示
    setFullScreen() {
      let element = this.$refs["screen-ref"]; // 或者其他 DOM 元素
      // 判断当前浏览器是否支持 Fullscreen API
      if (element.requestFullscreen) {
        element.requestFullscreen(); // W3C 标准语法
      } else if (element.mozRequestFullScreen) {
        // Firefox
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        // Chrome、Safari 和 Opera
        element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (element.msRequestFullscreen) {
        // IE/Edge
        element.msRequestFullscreen();
      }
    },
    returnNextRouter() {
      this.$router.go(-1);
    },
    onClickLastYear() {
      this.isActive = true;
    },
    onClickHalfYear() {
      this.isActive = false;
    },
    // 获取数据
    getEcharsData() {
      select({
        func: "S0027",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          console.log(data);
          if (data.code != 0) return this.$message.error(res.data);
          // 0 = 资产新增情况（折线图）
          this.lineData = data.data[0];
          // 1 = 资产状态占比（饼图）
          data.data[1].sort((a, b) => {
            return a.id - b.id;
          });
          data.data[1].forEach((e) => {
            this.stateListData.forEach((item) => {
              if (e.id == item._id) e.id = item.label;
            });
          });
          this.statePieData = data.data[1];
          // 2 = 资产分类统计（柱状图）
          this.barData = data.data[2];
          // 3 = 部门使用占比（饼图）
          this.deptPieData = data.data[3];
          // 4 = 个列项数据
          this.waitAuditNum = data.data[4][0];
          this.repairNum = data.data[4][1];
          this.weibaoNum = data.data[4][2];
          this.wareNum = data.data[4][3];
        })
        .catch(() => {
          // "服务器网络错误，请求首页数据失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
  },
  created() {
    this.getEcharsData();
  },
  mounted() {
    this.setFullScreen();
  },
};
</script>
<style lang="scss" scoped>
.screen-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #101624;
  color: #fff;
  box-sizing: border-box;
  .return-btn {
    position: absolute;
    right: 51px;
    top: 38px;
    color: #fff;
    cursor: pointer;
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 16px;
    color: #fff;
    .return-icon {
      vertical-align: middle;
    }
    .return-text {
      vertical-align: middle;
    }
  }
}
.screen-header {
  width: 100%;
  height: 54px;
  > div {
    position: relative;
    img {
      width: 100%;
    }
    .title {
      position: absolute;
      left: 50%;
      top: 42%;
      font-size: 1.2vw;
      font-weight: bold;
      letter-spacing: 5px;
      transform: translate(-50%, -50%);
    }
  }
}
.screen-body {
  margin-top: 10px;
  padding: 0px 24px 24px 24px;
  display: flex;
  width: 100%;
  height: calc(100% - 64px);
  box-sizing: border-box;
  .screen-left {
    margin-right: 1%;
    width: 48.5%;
    height: 100%;
    #left-top {
      width: 100%;
      height: 9.28%;
    }
    #left-middle {
      display: flex;
      width: 100%;
      height: 48.72%;
      margin: 2.3% 0px;
      background: url(../../assets/images/state-bg.png) no-repeat;
      background-size: 100% 100%;
      overflow: hidden;
    }
    #left-bottom {
      width: 100%;
      height: 37.4%;
      background: url(../../assets/images/entrance-bg.png) no-repeat;
      background-size: 100% 100%;
      overflow: hidden;
    }
  }
  .screen-right {
    width: 50.4%;
    height: 100%;
    #right-top {
      margin-bottom: 2.3%;
      width: 100%;
      height: 50%;
      background: url(../../assets/images/type-bg.png) no-repeat;
      background-size: 100% 100%;
      overflow: hidden;
    }
    #right-bottom {
      width: 100%;
      height: 47.7%;
      background: url(../../assets/images/new-bg.png) no-repeat;
      background-size: 100% 100%;
      overflow: hidden;
    }
  }
}
.remind {
  display: flex;
  height: 100%;
  .remind-item {
    cursor: pointer;
    flex: 1;
    background: url(../../assets/images/remind-bg.png) no-repeat;
    background-size: 100% 100%;
    position: relative;
    .remind-img {
      margin-top: 3.8%;
      height: 80%;
    }
    .text,
    .num {
      position: absolute;
      left: 35.5%;
      font-family: Microsoft YaHei;
    }
    .text {
      top: 26%;
      font-weight: 400;
      color: #fefefe;
      font-size: 14px;
    }
    .num {
      top: 47%;
      font-weight: bold;
      font-size: 24px;
      color: #1efbf8;
    }
  }
}
.remind .remind-item + .remind-item {
  margin-left: 20px;
}
.text-icon {
  position: relative;
  margin: 2.4%;
  .entrance-text {
    position: absolute;
    top: -1px;
    left: 29px;
    font-weight: bold;
    font-size: 15px;
    color: #ffffff;
  }
}
.entrance-list {
  padding: 0 4%;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  .entrance-item {
    .title {
      cursor: default;
      position: relative;
    }
    .title:hover {
      .num,
      .text {
        color: #8095fe;
      }
    }
    img {
      width: 100%;
    }
    .num,
    .text {
      position: absolute;
    }
    .num-one {
      bottom: 8%;
      left: 10%;
      font-weight: bold;
      font-size: 32px;
      color: #1efbf8;
      font-style: italic;
    }
    .text-one {
      top: 50%;
      left: 30%;
      transform: translate(0, -60%);
      font-weight: 400;
      font-size: 14px;
      color: #1efbf8;
    }
    .num-other {
      bottom: 8%;
      left: 20%;
      font-weight: bold;
      font-size: 32px;
      color: #1efbf8;
      font-style: italic;
    }
    .text-other {
      top: 50%;
      left: 40%;
      transform: translate(0, -60%);
      font-weight: 400;
      font-size: 14px;
      color: #1efbf8;
    }
    .link-item {
      margin-top: 8px;
    }
    .link-item:hover {
      .around {
        color: #8095fe !important;
      }
    }
    .around {
      font-weight: 400;
      font-size: 14px;
      color: #ffffff !important;
    }
  }
  .retract {
    margin-left: -1%;
  }
}
.state,
.dept {
  width: 50%;
  height: 100%;
  .text-icon {
    position: relative;
    margin: 4.8% 0 0 4.8%;
    .entrance-text {
      position: absolute;
      top: -1px;
      left: 29px;
      font-weight: bold;
      font-size: 15px;
      color: #ffffff;
    }
  }
  .statisticss {
    height: calc(100% - 25px - 9.6%);
  }
}
.type,
.new {
  width: 100%;
  height: 100%;
  .text-icon {
    position: relative;
    margin: 2.4% 0 0 2.4%;
    .entrance-text {
      position: absolute;
      top: -1px;
      left: 29px;
      font-weight: bold;
      font-size: 15px;
      color: #ffffff;
    }
    .btns {
      position: absolute;
      top: 2px;
      left: 220px;
    }
  }
  .statisticss {
    height: calc(100% - 25px - 4.8%);
  }
}
.year-btn {
  cursor: pointer;
  margin-left: 24px;
  border: none;
  outline: none;
  background-color: transparent;
  color: #6b6b6b;
}
.active {
  color: #fff;
}
</style>
