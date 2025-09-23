<template>
  <div class="attc">
    <ul class="upload-files">
      <li class="upload-files-item" v-for="(item, index) in files" :key="index">
        <i class="el-icon-paperclip"></i>
        <span class="file-name">{{ item.name }}</span>
        <div class="icons">
          <i class="el-icon-download" @click="downloadFile(item)"></i>
          <i class="el-icon-delete" @click="deleteFile(index)"></i>
        </div>
      </li>
    </ul>
    <div class="upload-btn" v-show="files.length < 5">
      <i class="el-icon-upload"></i>
      <span class="tips">{{ $t("h.uploadAssetAttachments") }}</span>
      <input
        type="file"
        ref="uploadFileRef"
        id="upload-file"
        @change="handleFileChange"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { fileToBase64, clickDownloadLink } from "@/utils/basic-methods";
export default {
  data() {
    return {};
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["maxLimit"]),
    files: {
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
      const file = e.target.files[0];
      if (this.maxLimit.pictureSize) {
        if (file.size > this.maxLimit.pictureSize * 1024) {
          return this.$message.error(
            `${this.$t("h.tips19")}${this.maxLimit.pictureSize}kb`
          );
        }
      }
      fileToBase64(file)
        .then((res) => {
          this.$refs.uploadFileRef.value = "";
          this.files.push({
            name: file.name,
            type: file.name.slice(file.name.lastIndexOf(".")),
            base64: res,
          });
        })
        .catch(() => {
          this.$refs.uploadFileRef.value = "";
          this.$message.error(this.$t("h.tips20"));
        });
    },
    deleteFile(index) {
      this.files.splice(index, 1);
    },
    downloadFile(val) {
      clickDownloadLink(val.base64, "_blank", val.name);
    },
  },
};
</script>
<style lang="scss" scoped>
.attc,
.upload-files {
  display: flex;
}
.upload-btn {
  position: relative;
  width: 35px;
  height: 35px;
  transition: all 0.25s;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-sizing: border-box;
  &:hover {
    color: #79a1c7;
    border-color: #79a1c7;
  }
  .el-icon-upload {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    font-weight: bold;
  }
  .tips {
    position: absolute;
    top: 85px;
    left: 50%;
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    transform: translateX(-50%);
  }
  #upload-file {
    cursor: pointer;
    width: 100%;
    height: 100%;
    vertical-align: top;
    opacity: 0;
    z-index: 1;
  }
}
.upload-files-item {
  transition: all 0.25s;
  position: relative;
  margin-right: 10px;
  width: 35px;
  height: 35px;
  border: 1px solid #c0ccda;
  border-radius: 8px;
  box-sizing: border-box;
  &:hover {
    background: rgba(0, 0, 0, 0.4);
    .icons {
      opacity: 1;
    }
  }
  .el-icon-paperclip {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
  }
  .icons {
    transition: all 0.25s;
    position: absolute;
    top: 4px;
    left: 1px;
    opacity: 0;
    font-size: 14px;
    color: #fff;
    font-weight: bold;
    z-index: 1;
    .el-icon-download {
      transition: all 0.25s;
      cursor: pointer;
      margin-right: 2px;
    }
    .el-icon-delete {
      transition: all 0.25s;
      cursor: pointer;
    }
    .el-icon-download:hover,
    .el-icon-delete:hover {
      color: #d84d4e;
    }
  }
  .file-name {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-align: center;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
