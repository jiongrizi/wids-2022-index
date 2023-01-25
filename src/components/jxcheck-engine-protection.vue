<template>
  <div class="page-owasp-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>Web自定义规则</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">
            <a class="el-button el-button--primary is-plain" :href="'/#/protection/' + domain + '/' + sourceType">返回</a>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <div class="margin-4x"></div>
    <el-row v-loading.fullscreen.lock="loadingPage">
      <el-col :span="24">
        <el-form :model="jxwafEngineForm" :rules="rules" ref="jxwafEngineForm" label-width="160px">

          <el-form-item label="sql注入攻击防护">
            <el-radio-group v-model="jxwafEngineForm.sql_check">
              <el-radio label="block">阻断</el-radio>
              <el-radio label="close">关闭</el-radio>
              <el-radio label="observe">观察</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="xss攻击防护">
            <el-radio-group v-model="jxwafEngineForm.xss_check">
              <el-radio label="block">阻断</el-radio>
              <el-radio label="close">关闭</el-radio>
              <el-radio label="observe">观察</el-radio>

            </el-radio-group>
          </el-form-item>
          <el-form-item label="命令注入防护">
            <el-radio-group v-model="jxwafEngineForm.command_inject_check">
              <el-radio label="block">阻断</el-radio>
              <el-radio label="close">关闭</el-radio>
              <el-radio label="observe">观察</el-radio>

            </el-radio-group>
          </el-form-item>
          <el-form-item label="代码执行防护">
            <el-radio-group v-model="jxwafEngineForm.code_exec_check">
              <el-radio label="block">阻断</el-radio>
              <el-radio label="close">关闭</el-radio>
              <el-radio label="observe">观察</el-radio>

            </el-radio-group>
          </el-form-item>
          <el-form-item label="目录穿越防护">
            <el-radio-group v-model="jxwafEngineForm.directory_traversal_check">
              <el-radio label="block">阻断</el-radio>
              <el-radio label="close">关闭</el-radio>
              <el-radio label="observe">观察</el-radio>

            </el-radio-group>
          </el-form-item>
          <el-form-item label="scan_uri_check">
            <el-radio-group v-model="jxwafEngineForm.scan_uri_check">
              <el-radio label="block">阻断</el-radio>
              <el-radio label="close">关闭</el-radio>
              <el-radio label="observe">观察</el-radio>

            </el-radio-group>
          </el-form-item>
          <el-form-item label="fastjson_check">
            <el-radio-group v-model="jxwafEngineForm.fastjson_check">
              <el-radio label="block">阻断</el-radio>
              <el-radio label="close">关闭</el-radio>
              <el-radio label="observe">观察</el-radio>

            </el-radio-group>
          </el-form-item>
          <el-form-item label="webshell_check">
            <el-radio-group v-model="jxwafEngineForm.webshell_check">
              <el-radio label="block">阻断</el-radio>
              <el-radio label="close">关闭</el-radio>
              <el-radio label="observe">观察</el-radio>

            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="margin-4x"></div>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="12">
                <a class="el-button el-button--primary is-plain"
                  :href="'/#/protection/' + domain + '/' + sourceType">返回</a>
              </el-col>
              <el-col :span="12" class="text-align-right">
                <el-button type="primary" @click="onClickPageOwaspSubmit('jxwafEngineForm')" :loading="loading">保存
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
import { useRoute } from 'vue-router'
export default {
  mixins: [mixin],
  data() {
    return {
      loadingPage: false,
      loading: false,
      sourceType: this.$route.params.sourceType,
      domain: this.$route.params.domainUrl,
      jxwafEngineForm: {},

      fileList: [],
      fileListVisible: false,
      fileListValue: "",
      flagTag: true,
    };
  },
  computed: {
    rules() {
      return {
        
      }
    }
  },

  mounted() {
    const route = useRoute()
    this.sourceType = route.params.sourceType;
    this.domain = route.params.domain;
    this.getData();
  },
  methods: {

    getData() {
      var t = this;
      JXAjax(
        "post",
        "/waf/waf_get_jxcheck_engine_protection",
        { domain: t.domain, source_type: t.sourceType },
        function (response) {
          t.loadingPage = false;
          t.jxwafEngineForm = response.data.message;
        },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },

    onClickPageOwaspSubmit(jxwafEngineForm) {
      var t = this;
      var postUrl = "/waf/waf_edit_jxcheck_engine_protection";

      this.jxwafEngineForm.domain = t.domain;
      this.jxwafEngineForm.source_type = t.sourceType;
      this.$refs[jxwafEngineForm].validate((valid) => {
        if (valid) {
          t.loading = true;

          JXAjax(
            "post",
            postUrl,
            t.jxwafEngineForm,
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
</style>
