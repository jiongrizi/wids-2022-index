<template>
  <div class="page-owasp-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>日志配置</h3>
          </el-col>

        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <div class="margin-4x"></div>
    <el-row v-loading.fullscreen.lock="loadingPage">
      <el-col :span="24">
        <el-form :model="logConfigForm" :rules="rules" ref="logConfigForm" label-width="160px">
          
          <el-form-item label="日志服务器IP" prop="log_ip" key="1">
            <el-input v-model="logConfigForm.log_ip" placeholder="请输入JXWAF账号TOKEN">
            </el-input>
          </el-form-item>
          <el-form-item label="日志服务器端口" prop="log_port" key="2">
            <el-input v-model="logConfigForm.log_port" placeholder="请输入JXWAF账号TOKEN">
            </el-input>
          </el-form-item>
        </el-form>
        <div class="margin-4x"></div>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="12">

              </el-col>
              <el-col :span="12" class="text-align-right">
                <el-button type="primary" @click="onClickLogConfigSubmit('logConfigForm')" :loading="loading">保存
                </el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mixin, JXAjax, validatePort, validateIP } from "../assets/scripts/common";
export default {
  mixins: [mixin],
  data() {
    return {
      loadingPage: false,
      loading: false,
      logConfigForm: {},
    };
  },
  computed: {
    rules() {
      return {
        log_ip: [
          {
            required: true,
            message: '请输入日志服务器IP',
            trigger: ["blur", "change"],
          },
          {
            validator: validateIP,
            trigger: ["blur", "change"],
          },
        ],
        log_port: [
          {
            required: true,
            message: '请输入日志服务器端口',
            trigger: ["blur", "change"],
          },
          {
            validator: validatePort,
            trigger: ["blur", "change"],
          },
        ],
      }
    }
  },

  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      var t = this;
      var getUrl = "/sys/waf_get_sys_log_conf";

      JXAjax(
        "post",
        getUrl,
        {},
        function (response) {
          t.loadingPage = false;
          t.logConfigForm = response.data.message;
        },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },

    onClickLogConfigSubmit(logConfigForm) {
      var t = this;
      var postUrl = "/sys/waf_edit_sys_log_conf";
      this.$refs[logConfigForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.logConfigForm,
            function (response) {
              t.loading = false;
              t.getData();
            },
            function () {
              t.loading = false;
            }
          );
        }
      });
    },
  },
};
</script>
<style>
.page-owasp-wrap {
  max-width: 800px;
  min-width: 400px;
}

.page-owasp-wrap .match-inline-block {
  width: 192px;
}

.engine-form .el-form-item__content {
  margin-left: 40px;
}
</style>
