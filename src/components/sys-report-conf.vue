<template>
  <div class="page-owasp-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>报表配置</h3>
          </el-col>

        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <div class="margin-4x"></div>
    <el-row v-loading.fullscreen.lock="loadingPage">
      <el-col :span="24">
        <el-form :model="sysReportConfForm" :rules="rules" ref="sysReportConfForm" label-width="160px">
          <el-form-item label="日志数据来源" key="1">
            <el-radio-group v-model="sysReportConfForm.log_source">
            <el-radio label="cls">腾讯云</el-radio>
              <el-radio label="sls">阿里云</el-radio>
              
            </el-radio-group>
          </el-form-item>

          <div v-if="sysReportConfForm.log_source == 'sls'">
            <el-form-item label="AccessKey ID" prop="sls_AccessKey_ID" key="2">
              <el-input v-model="sysReportConfForm.sls_AccessKey_ID" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="AccessKey Secret" prop="sls_AccessKey_Secret" key="3">
              <el-input v-model="sysReportConfForm.sls_AccessKey_Secret" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="endpoint" prop="sls_endpoint" key="4">
              <el-input v-model="sysReportConfForm.sls_endpoint" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="project" prop="sls_project" key="5">
              <el-input v-model="sysReportConfForm.sls_project" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="logstore" prop="sls_logstore" key="6">
              <el-input v-model="sysReportConfForm.sls_logstore" placeholder="请输入">
              </el-input>
            </el-form-item>
          </div>

          <div v-if="sysReportConfForm.log_source == 'cls'">
            
            <el-form-item label="SecretId" prop="cls_SecretId" key="8">
              <el-input v-model="sysReportConfForm.cls_SecretId" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="SecretKey" prop="cls_SecretKey" key="9">
              <el-input v-model="sysReportConfForm.cls_SecretKey" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="Region" prop="cls_Region" key="10">
              <el-input v-model="sysReportConfForm.cls_Region" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="TopicId" prop="cls_TopicId" key="7">
              <el-input v-model="sysReportConfForm.cls_TopicId" placeholder="请输入">
              </el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="margin-4x"></div>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="12">

              </el-col>
              <el-col :span="12" class="text-align-right">
                <el-button type="primary" @click="onClickLogConfigSubmit('sysReportConfForm')" :loading="loading">保存
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
import { mixin, JXAjax } from "../assets/scripts/common";
export default {
  mixins: [mixin],
  data() {
    return {
      loadingPage: false,
      loading: false,
      sysReportConfForm: {
        log_source: "cls"
      },
    };
  },
  computed: {
    rules() {
      return {
        sls_AccessKey_ID: [
          {
            required: true,
            message: '请输入日志服务器IP',
            trigger: ["blur", "change"],
          }
        ],
        sls_AccessKey_Secret: [
          {
            required: true,
            message: '请输入日志服务器端口',
            trigger: ["blur", "change"],
          }
        ],
        sls_endpoint: [
          {
            required: true,
            message: '请输入日志服务器端口',
            trigger: ["blur", "change"],
          }
        ],
        sls_project: [
          {
            required: true,
            message: '请输入日志服务器端口',
            trigger: ["blur", "change"],
          }
        ],
        sls_logstore: [
          {
            required: true,
            message: '请输入日志服务器端口',
            trigger: ["blur", "change"],
          }
        ],
        cls_TopicId: [
          {
            required: true,
            message: '请输入日志服务器端口',
            trigger: ["blur", "change"],
          }
        ],
        cls_SecretId: [
          {
            required: true,
            message: '请输入日志服务器端口',
            trigger: ["blur", "change"],
          }
        ],
        cls_SecretKey: [
          {
            required: true,
            message: '请输入日志服务器端口',
            trigger: ["blur", "change"],
          }
        ],
        cls_Region: [
          {
            required: true,
            message: '请输入日志服务器端口',
            trigger: ["blur", "change"],
          }
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
      var getUrl = "/waf/waf_get_sys_report_conf";

      JXAjax(
        "post",
        getUrl,
        {},
        function (response) {
          t.loadingPage = false;
          t.sysReportConfForm = response.data.message;
        },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },

    onClickLogConfigSubmit(sysReportConfForm) {
      var t = this;
      var postUrl = "/waf/waf_edit_sys_report_conf";
      this.$refs[sysReportConfForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.sysReportConfForm,
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
