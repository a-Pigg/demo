<template>
  <div class="activation">
    <el-form
      ref="activationFormRef"
      :model="activationForm"
      :rules="activationFormRules"
    >
      <el-form-item prop="registrationNo">
        <el-input
          v-model.trim="activationForm.registrationNo"
          :placeholder="$t('h.tips3') + $t('h.registrationCode')"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="activationCode">
        <el-input
          v-model.trim="activationForm.activationCode"
          :placeholder="$t('h.tips3') + $t('h.tips194')"
        >
          <template slot="suffix"
            ><el-button @click="getActivationCode" type="text">{{
              $t("h.tips197")
            }}</el-button></template
          >
        </el-input>
      </el-form-item>
      <el-form-item prop="conpanyName">
        <el-input
          v-model.trim="activationForm.conpanyName"
          :placeholder="$t('h.tips3') + $t('h.company')"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="sumbit-btn"
          type="primary"
          @click="submitActivationForm"
          >{{ $t("h.confirmBtn") }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { activate } from "@/assets/api";
export default {
  name: "TrialActivation",
  data() {
    return {
      activationForm: {
        registrationNo: "",
        activationCode: "",
        conpanyName: "",
      },
      activationFormRules: {
        registrationNo: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.registrationCode"),
            trigger: "blur",
          },
        ],
        activationCode: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.tips194"),
            trigger: "blur",
          },
        ],
        conpanyName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.company"),
            trigger: "blur",
          },
        ],
      },
      loadingStyle: {
        lock: true,
        text: this.$t("h.tips205"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
    };
  },
  props: ["serverId", "serverLevel", "protocolChecked"],
  methods: {
    getActivationCode() {
      this.$refs.activationFormRef.validateField(
        "registrationNo",
        async (valie) => {
          if (valie) return false;
          let linkTag = document.createElement("a");
          linkTag.href =
            window.$CODE_URL +
            "?code=" +
            this.activationForm.registrationNo +
            "&serviceId=" +
            this.serverId;
          linkTag.target = "_blank";
          linkTag.click();
        }
      );
    },
    submitActivationForm() {
      this.$refs.activationFormRef.validate(async (valid) => {
        if (!valid) return false;
        if (!this.protocolChecked) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips192"),
          });
        }
        const ACTICATE_LOADING = this.$loading(this.loadingStyle);
        const { data: res } = await activate(this.activationForm).catch(() => {
          ACTICATE_LOADING.close();
          this.$message.error(this.$t("h.tips18"));
        });
        ACTICATE_LOADING.close();
        if (res.code != 0) return this.$message.error(res.data);
        this.$message.success(this.$t("h.tips206"));
        this.$refs.activationFormRef.resetFields();
      });
    },
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
