<template>
  <div class="home">
    <div class="left-box">
      <el-row :gutter="24" class="remind" v-loading="loading">
        <el-col :xs="12" :sm="12" :lg="12">
          <div class="remind-item" @click="goAudit">
            <div class="text">
              <!-- <h3>待审批任务</h3> -->
              <h3>{{ $t("h.pendingApproval") }}</h3>
              <span class="audit-color">{{ waitAuditNum }}</span>
            </div>
            <div class="remind-img audit-bg">
              <img src="@/assets/images/icon-analyse-audit.png" alt="" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12">
          <div class="remind-item" @click="goList">
            <div class="text">
              <!-- <h3>维保到期资产</h3> -->
              <h3>{{ $t("h.maintenanceExpiredAssets") }}</h3>
              <span class="num-color">{{ repairNum }}</span>
            </div>
            <div class="remind-img num-bg">
              <img src="@/assets/images/icon-analyse-num.png" alt="" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12">
          <div class="remind-item" @click="goExpireAsset">
            <div class="text">
              <!-- <h3>使用年限到期资产</h3> -->
              <h3>{{ $t("h.serviceLifeExpiredAssets") }}</h3>
              <span class="repair-color">{{ weibaoNum }}</span>
            </div>
            <div class="remind-img repair-bg">
              <img src="@/assets/images/icon-analyse-maintain.png" alt="" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12">
          <div class="remind-item" @click="goError">
            <div class="text">
              <!-- <h3>当月报修到期资产</h3> -->
              <h3>{{ $t("h.theMonthlyRepairExpiredAssets") }}</h3>
              <span class="warning-color">{{ wareNum }}</span>
            </div>
            <div class="remind-img warning-bg">
              <img src="@/assets/images/icon-analyse-repairs.png" alt="" />
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="bar" v-loading="loading">
        <assets-type-bar
          :userInfo="userInfo"
          :assetBarData.sync="allData[2]"
          :allData="allData[2]"
        ></assets-type-bar>
      </div>
    </div>
    <div class="right-box">
      <div class="pie">
        <div class="state-pie" v-loading="loading">
          <assets-state-pie
            :userInfo="userInfo"
            :allData="allData[1]"
          ></assets-state-pie>
        </div>
        <div class="dept-pie" v-loading="loading">
          <assets-dept-pie
            :userInfo="userInfo"
            :allData="allData[3]"
          ></assets-dept-pie>
        </div>
      </div>
      <div class="line" v-loading="loading">
        <assets-newly-line
          :userInfo="userInfo"
          :allData="allData[0]"
        ></assets-newly-line>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { select } from "@/assets/api";
import AssetsTypeBar from "@/components/ECharts/AssetsTypeBar";
import AssetsStatePie from "@/components/ECharts/AssetsStatePie";
import AssetsDeptPie from "@/components/ECharts/AssetsDeptPie";
import AssetsNewlyLine from "@/components/ECharts/AssetsNewlyLine";
export default {
  data() {
    return {
      loading: false,
      waitAuditNum: 0,
      repairNum: 0,
      weibaoNum: 0,
      wareNum: 0,
      allData: [],
    };
  },
  components: {
    AssetsTypeBar,
    AssetsStatePie,
    AssetsDeptPie,
    AssetsNewlyLine,
  },
  computed: {
    ...mapState(["userInfo", "stateListData"]),
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
      this.$message.error($t("h.tips186"));
    },
    async getEChartsData() {
      this.loading = true;
      const { data: res } = await select({
        func: "S0027",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      }).catch(() => {
        this.loading = false;
        // 服务器网络错误，请求首页数据失败
        this.$message.error($t("h.tips18"));
      });
      this.loading = false;
      if (res.code != 0) return this.$message.error(res.data);
      this.allData = res.data;
      // this.allData[2].sort((a, b) => {
      //   return a.count - b.count;
      // });
      this.allData[1].sort((a, b) => {
        return a.id - b.id;
      });
      this.allData[1].forEach((e) => {
        this.stateListData.forEach((item) => {
          if (e.id == item._id) e.id = item.label;
        });
      });
      this.waitAuditNum = res.data[4][0];
      this.repairNum = res.data[4][1];
      this.weibaoNum = res.data[4][2];
      this.wareNum = res.data[4][3];
    },
  },
  created() {
    this.getEChartsData();
  },
};
</script>
<style lang="scss" scoped>
.home {
  display: flex;
  padding: 15px;
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  .left-box {
    padding: 0 24px;
    width: 584px;
    height: 100%;
    box-sizing: border-box;
    background: #fff;
    margin-right: 16px;
    .remind {
      padding: 24px 0;
      height: 295px;
      box-sizing: border-box;
    }
    .bar {
      width: 100%;
      height: calc(100% - 295px);
      border-top: 2px dashed #eee;
    }
  }
  .right-box {
    width: calc(100% - 600px);
    height: 100%;
    box-sizing: border-box;
    background: #f3f3f7;
    .pie {
      padding: 15px 0;
      margin-bottom: 15px;
      width: 100%;
      height: 408px;
      background: #fff;
      box-sizing: border-box;
      .state-pie {
        float: left;
        width: 53%;
        height: 100%;
        border-right: 2px dashed #dadada;
        box-sizing: border-box;
      }
      .dept-pie {
        float: left;
        width: 47%;
        height: 100%;
      }
    }
    .line {
      padding: 0px 24px;
      box-sizing: border-box;
      width: 100%;
      height: calc(100% - 423px);
      background: #fff;
    }
  }
  @media screen and (min-width: 1200px) and (max-width: 1919px) {
    .left-box {
      width: 488px;
      height: 100%;
      box-sizing: border-box;
      background: #fff;
      margin-right: 24px;
    }
    .right-box {
      width: calc(100% - 512px);
      height: 100%;
      box-sizing: border-box;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 1199px) {
    .left-box {
      width: 42%;
      height: 100%;
      box-sizing: border-box;
      background: #fff;
      margin-right: 24px;
    }
    .right-box {
      width: calc(58% - 24px);
      height: 100%;
      box-sizing: border-box;
    }
  }
  @media screen and (max-width: 767px) {
    .left-box {
      margin-right: 0px;
      margin-bottom: 15px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      background: #fff;
      .remind {
        padding: 24px 0;
        height: 295px;
        box-sizing: border-box;
      }
    }
    .right-box {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      .pie {
        padding: 0;
        width: 100%;
        height: 812px;
        background: #fff;
        margin-bottom: 15px;
        box-sizing: border-box;
        .state-pie {
          padding-top: 15px;
          float: none;
          width: 100%;
          height: 419px;
          border-right: none;
          border-bottom: 2px dashed #dadada;
          box-sizing: border-box;
        }
        .dept-pie {
          padding-top: 15px;
          float: none;
          width: 100%;
          height: 391px;
          box-sizing: border-box;
        }
      }
      .line {
        width: 100%;
        height: 393px;
        background: #fff;
        box-sizing: border-box;
      }
    }
  }
}
.remind-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  margin-bottom: 24px;
  height: 112px;
  border: 2px solid #f1f6ff;
  border-radius: 2px;
  box-sizing: border-box;
  .text {
    display: flex;
    height: 64px;
    flex-direction: column;
    justify-content: space-between;
    h3 {
      font-size: 15px;
      font-weight: bold;
      color: #3a3a3a;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }
    span {
      font-size: 32px;
      font-weight: 400;
      text-shadow: 1px 1px 2px rgba(31, 50, 81, 0.4);
    }
    .audit-color {
      color: #298293;
    }
    .num-color {
      color: #296596;
    }
    .repair-color {
      color: #317caa;
    }
    .warning-color {
      color: #fe9d36;
    }
  }
  .remind-img {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    box-shadow: 0px 0px 10px 0px rgba(16, 20, 54, 0.2);
    img {
      width: 38px;
      height: 38px;
    }
  }
  .audit-bg {
    background: linear-gradient(-45deg, #5ca8b5 0%, #298293 100%);
  }
  .num-bg {
    background: linear-gradient(-45deg, #296596 0%, #6884b2 100%);
  }
  .repair-bg {
    background: linear-gradient(-45deg, #317caa 0%, #89b0c7 100%);
  }
  .warning-bg {
    background: linear-gradient(-45deg, #f1a451 0%, #ffb05f 100%);
  }
  &:hover {
    border: 2px solid #acbddb;
    box-shadow: 0px 0px 10px 0px rgba(16, 20, 54, 0.2);
  }
}
@media screen and (max-width: 767px) {
  .home {
    flex-wrap: wrap;
  }
}
</style>
