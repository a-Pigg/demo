<template>
  <div class="upload" v-loading="loading">
    <div class="upload-btn" v-if="!fileValue.value">
      <input
        type="file"
        id="upload-btn-input"
        ref="uploadInputRef"
        accept=".xlsx, .xls"
        @change="handleFileChange"
      />
      <i class="el-icon-plus"></i>
    </div>
    <div class="upload-icon" v-else>
      <button class="close-btn" @click="cancalUploadFile">
        <i class="el-icon-close"></i>
      </button>
      <i class="el-icon-document"></i>
      <h5 class="file-name">{{ fileValue.name }}</h5>
    </div>
  </div>
</template>
<script>
import { fileToBase64 } from "@/utils/basic-methods";
export default {
  data() {
    return {};
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          value: "",
          name: "",
        };
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    fileValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      },
    },
  },
  methods: {
    handleFileChange(e) {
      const FILTTYPE = e.target.files[0].type;
      const TYPE1 =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const TYPE2 = "application/vnd.ms-excel";
      let typeCheck = true;
      if (FILTTYPE !== TYPE1 && FILTTYPE !== TYPE2) {
        typeCheck = false;
      }
      let nameCheck = true;
      let fileExtension = this.getFileExtension(e.target.files[0].name);
      if (fileExtension != "xls" && fileExtension != "xlsx") {
        nameCheck = false;
      }
      if (!typeCheck && !nameCheck) {
        return this.$notify.error({
          title: this.$t("h.title27"),
          message: this.$t("h.tips108"),
        });
      }
      fileToBase64(e.target.files[0])
        .then((res) => {
          this.fileValue.value = res;
          this.fileValue.name = e.target.files[0].name;
        })
        .catch(() => {
          this.cancalUploadFile();
          this.$message.error(this.$t("h.tips109"));
        });
    },
    cancalUploadFile(event) {
      event.preventDefault();
      this.fileValue.value = "";
      this.fileValue.name = "";
    },
    getFileExtension(fileName) {
      return fileName.split(".").pop();
    },
  },
};
</script>
<style lang="scss" scoped>
.upload-btn {
  position: relative;
  transition: all 0.25s;
  width: 150px;
  height: 150px;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-sizing: border-box;
  &:hover {
    color: #79a1c7;
    border-color: #79a1c7;
  }
  .el-icon-plus {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 32px;
    font-weight: bold;
  }
  #upload-btn-input {
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 100%;
    vertical-align: top;
    opacity: 0;
    z-index: 1;
  }
}
.upload-icon {
  position: relative;
  transition: all 0.25s;
  width: 150px;
  height: 150px;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-sizing: border-box;
  &:hover {
    color: #79a1c7;
    border-color: #79a1c7;
    .close-btn {
      top: 5px;
      right: 5px;
      opacity: 1;
    }
  }
  .el-icon-document {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 58px;
  }
  .file-name {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-align: center;
    font-size: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .close-btn {
    transition: all 0.25s;
    position: absolute;
    top: 0;
    right: 0;
    outline: none;
    background-color: transparent;
    border: none;
    border-radius: 5px;
    opacity: 0;
    .el-icon-close {
      transition: all 0.25s;
      padding: 4px;
      border-radius: 5px;
      font-size: 18px;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      text-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
    }
    .el-icon-close:hover {
      border-radius: 50%;
      background: #d84d4e;
    }
  }
}
</style>
