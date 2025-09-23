<template>
  <div class="upload">
    <div v-show="!fileValue" class="upload-btn">
      <input
        type="file"
        id="upload-btn-input"
        accept="image/*"
        ref="uploadInputRef"
        @change="handlePhotoChange"
      />
      <i class="el-icon-plus"></i>
    </div>
    <div v-show="fileValue" class="upload-img">
      <button class="close-btn" @click="deletePhotpFile($event)">
        <i class="el-icon-close"></i>
      </button>
      <img :src="fileValue" alt="" id="img" />
    </div>
  </div>
</template>
<script>
import { fileToBase64 } from "@/utils/basic-methods";
export default {
  data() {
    return {};
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
    imgH: {
      get() {
        return this.imgHeight;
      },
      set(val) {
        this.$emit("update:imgHeight", val);
      },
    },
    imgW: {
      get() {
        return this.imgWidth;
      },
      set(val) {
        this.$emit("update:imgWidth", val);
      },
    },
    clickRecordValue: {
      get() {
        return this.clickRecord;
      },
      set(val) {
        this.$emit("update:clickRecord", val);
      },
    },
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    imgHeight: {
      type: Number,
      default: null,
    },
    imgWidth: {
      type: Number,
      default: null,
    },
  },
  methods: {
    handlePhotoChange(e) {
      let file = e.target.files[0];
      let formData = new FormData();
      formData.append("file1", file);
      if (file.type.indexOf("image") != 0) {
        return this.$message.error(this.$t("h.tips21"));
      } else if (file.size / 1024 > 500) {
        return this.$message.error(`${this.$t("h.tips37")}500kb`);
      }
      fileToBase64(file)
        .then((res) => {
          this.fileValue = res;
          setTimeout(() => {
            if (document.querySelector("#img").offsetHeight) {
              this.imgH = document.querySelector("#img").offsetHeight;
              this.imgW = document.querySelector("#img").offsetWidth;
            }
          }, 200);
        })
        .catch(() => {
          this.deletePhotpFile();
          this.$message.error(this.$t("h.tipstips2021"));
        });
    },
    deletePhotpFile(e) {
      e.preventDefault();
      this.fileValue = "";
      this.$refs.uploadInputRef.value = "";
      this.clickRecordValue = !this.clickRecordValue;
    },
  },
};
</script>
<style lang="scss" scoped>
.upload-btn {
  position: relative;
  width: 87px;
  height: 35px;
  transition: all 0.25s;
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
    font-size: 24px;
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
.upload-img {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 87px;
  height: 35px;
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
  .p {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background-color: #d84d4e;
  }
  img {
    width: 100%;
  }
  &:hover {
    .close-btn {
      top: 5px;
      right: 5px;
      opacity: 1;
    }
  }
}
</style>
