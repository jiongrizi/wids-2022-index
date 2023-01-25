<template>
  <div class="sys-abnormal-handle-wrap">
    <el-row v-loading.fullscreen.lock="loadingPage">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>WAF处置页面配置</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">

          </el-col>
        </el-row>
        <div class="margin-4x"></div>
        <el-row>
          <el-col :span="24">
            <el-form :model="defaultPageForm" :rules="rules" ref="defaultPageForm" label-width="250px"
              label-position="left">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="域名未配置页面" name="1">
                  <el-form-item label="HTTP响应码" key="1" prop="domain_404_code">
                    <el-input v-model="defaultPageForm.domain_404_code" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="响应内容" key="2">
                    <el-radio-group v-model="domain_404_html">
                      <el-radio :label="0">无响应内容</el-radio>
                      <el-radio :label="1">HTML响应内容</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-show="domain_404_html == 1">
                    <el-input v-model="defaultPageForm.domain_404_html" type="textarea" :autosize="{ minRows: 10 }" />
                  </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="Web攻击拦截页面" name="2">
                  <el-form-item label="HTTP响应码" key="3" prop="web_deny_code">
                    <el-input v-model="defaultPageForm.web_deny_code" placeholder="请输入">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="响应内容" key="4">
                    <el-radio-group v-model="web_deny_html">
                      <el-radio :label="0">无响应内容</el-radio>
                      <el-radio :label="1">HTML响应内容</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-show="web_deny_html == 1">
                    <el-input v-model="defaultPageForm.web_deny_html" type="textarea" :autosize="{ minRows: 10 }" />
                  </el-form-item>

                </el-collapse-item>
                <el-collapse-item title="流量攻击拦截页面" name="3">
                  <el-form-item label="HTTP响应码" key="5" prop="flow_deny_code">
                    <el-input v-model="defaultPageForm.flow_deny_code" placeholder="请输入"></el-input>
                  </el-form-item>

                  <el-form-item label="响应内容" key="6">
                    <el-radio-group v-model="flow_deny_html">
                      <el-radio :label="0">无响应内容</el-radio>
                      <el-radio :label="1">HTML响应内容</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-show="flow_deny_html == 1">
                    <el-input v-model="defaultPageForm.flow_deny_html" type="textarea" :autosize="{ minRows: 10 }" />
                  </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="名单防护拦截页面" name="4">
                  <el-form-item label="HTTP响应码" key="7" prop="name_list_deny_code">
                    <el-input v-model="defaultPageForm.name_list_deny_code" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="响应内容" key="8">
                    <el-radio-group v-model="name_list_deny_html">
                      <el-radio :label="0">无响应内容</el-radio>
                      <el-radio :label="1">HTML响应内容</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-show="name_list_deny_html == 1">
                    <el-input v-model="defaultPageForm.name_list_deny_html" type="textarea"
                      :autosize="{ minRows: 10 }" />
                  </el-form-item>
                </el-collapse-item>

              </el-collapse>
            </el-form>
            <div class="margin-4x"></div>
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="24">
                <el-row type="flex" class="row-bg" justify="space-between">
                  <el-col :span="12">

                  </el-col>
                  <el-col :span="12" class="text-align-right">
                    <el-button type="primary" @click="onClickDefaultPageSubmit('defaultPageForm')" :loading="loading">保存
                    </el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>

    </el-row>
  </div>
</template>
<script>
import { mixin, JXAjax, validatePort } from "../assets/scripts/common";
export default {
  mixins: [mixin],
  data() {
    return {
      loading:false,
      loadingPage: false,
      activeNames: ["1", "2", "3", "4"],
      defaultPageForm: {},
      ruleOptions: [],
      domain_404_html: 0,
      web_deny_html: 0,
      flow_deny_html: 0,
      name_list_deny_html: 0,
    };
  },
  computed: {
    rules() {
      return {
        domain_404_code: [
          { required: true, message: '请输入', trigger: ["blur", "change"], },
        ],
        flow_deny_code: [
          { required: true, message: '请输入', trigger: ["blur", "change"], },
        ],
        name_list_deny_code: [
          { required: true, message: '请输入', trigger: ["blur", "change"], },
        ],
        web_deny_code: [
          { required: true, message: '请输入', trigger: ["blur", "change"], },
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
      JXAjax(
        "get",
        "/waf/waf_get_sys_global_default_page",
        {},
        function (response) {
          t.loadingPage = false;
          t.defaultPageForm = response.data.message;
          if (t.defaultPageForm.domain_404_html == "") {
            t.domain_404_html = 0
          } else { 
            t.domain_404_html = 1
          }
          if (t.defaultPageForm.flow_deny_html == "") {
            t.flow_deny_html = 0
          } else {
            t.flow_deny_html = 1
          }
          if (t.defaultPageForm.name_list_deny_html == "") {
            t.name_list_deny_html = 0
          } else {
            t.name_list_deny_html = 1
          }
          if (t.defaultPageForm.web_deny_html == "") {
            t.web_deny_html = 0
          } else {
            t.web_deny_html = 1
          }
        },
        function () {
          t.loadingPage = false;
        }
      );
    },

    onClickDefaultPageSubmit(defaultPageForm) {
      var t = this;
      t.loading = true;
      var postUrl = "/waf/waf_edit_sys_global_default_page";
      if (t.domain_404_html ==  0) {
        t.defaultPageForm.domain_404_html = ""
      }
      if (t.flow_deny_html ==  0) {
        t.defaultPageForm.flow_deny_html = ""
      }
      if (t.name_list_deny_html ==  0) {
        t.defaultPageForm.name_list_deny_html = ""
      }
      if (t.web_deny_html ==  0) {
        t.defaultPageForm.web_deny_html = ""
      }
          
      this.$refs[defaultPageForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.defaultPageForm,
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

.sys-abnormal-handle-wrap {
  max-width: 800px;
  min-width: 400px;
}
.sys-abnormal-handle-wrap .el-collapse-item__header {
  font-size: 16px;
  font-weight: 600;
}

</style>
