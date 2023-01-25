<template>
  <div class="web-deny-page-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>流量攻击拦截页面</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">
            <a class="el-button el-button--primary is-plain" :href="'/#/group-protection/' + domain"
              v-if="ruleType=='group_rule'">返回</a>
            <a class="el-button el-button--primary is-plain" :href="'/#/protection/' + domain + '/' + ruleType"
              v-else>返回</a>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <el-row>
      <el-col :span="24">

        <el-card class="box-card">
          <div>
            <div class="margin-4x"></div>
            <el-form :model="flowDenyPageForm" label-width="120px" :rules="rules" ref="flowDenyPageForm">
              <el-form-item label="HTTP响应码" prop="owasp_code" key="1">
                <el-input v-model="flowDenyPageForm.owasp_code" placeholder="请输入100~600的响应码"></el-input>
              </el-form-item>
              <el-form-item label="响应内容">
                <el-radio-group v-model="radioContent">
                  <el-radio :label="0">无响应内容</el-radio>
                  <el-radio :label="1">HTML响应内容</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-show="radioContent == 1">
                <el-input v-model="flowDenyPageForm.owasp_html" type="textarea" :autosize="{ minRows: 10 }" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <div class="margin-4x"></div>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="12">
                <a class="el-button el-button--primary is-plain" :href="'/#/group-protection/' + domain"
                  v-if="ruleType=='group_rule'">返回</a>
                <a class="el-button el-button--primary is-plain" :href="'/#/protection/' + domain + '/' + ruleType"
                  v-else>返回</a>

              </el-col>
              <el-col :span="12" class="text-align-right">
                <el-button type="primary" @click="onClickFlowDenyPageSubmit('flowDenyPageForm')" :loading="loading">保存
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
      validateCode: (rule, value, callback) => {
        if (value < 100 || value > 600) {
          callback(new Error("请输入100~600的响应码"));
        } else {
          callback();
        }
      },
      loading: false,
      domain: "",
      ruleType: "single_rule",
      flowDenyPageForm: {
        owasp_code: 403,
        owasp_html:""
      },
      radioContent: 0
    };
  },
  computed: {
    rules() {
      return {
        owasp_code: [
          {
            required: true,
            message: "请输入100~600的响应码",
            trigger: ["blur", "change"],
          },
          { validator: this.validateCode, trigger: "blur" },
        ]
      }
    }
  },
  mounted() {
    const route = useRoute()
    this.ruleType = route.params.ruleType;
    this.domain = route.params.domain;
    this.getData();
  },
  methods: {
    getData() {
      var t = this;
      var postUrl = "/waf/waf_get_flow_deny_page";
      var oData = { domain: t.domain };
      if (t.ruleType == "group_rule") {
        postUrl = "/waf/waf_get_group_flow_deny_page"
        oData = { group_id: t.domain }
      }
      JXAjax(
        "post",
        postUrl,
        oData,
        function (response) {

          t.flowDenyPageForm = response.data.message;
          if (t.flowDenyPageForm.owasp_html) {
            t.radioContent = 1;
          } else { 
            t.radioContent = 0;
          }
        },
        function () {
  
        },
        "no-message"
      );
    },

    onClickFlowDenyPageSubmit(flowDenyPageForm) {
      var t = this;
      var postUrl = "/waf/waf_edit_flow_deny_page";
      if (t.ruleType == "group_rule") {
        postUrl = "/waf/waf_edit_group_flow_deny_page"
        t.webDenyPageForm.group_id = t.domain;
      } else {
        t.webDenyPageForm.domain = t.domain;
      }
      this.$refs[flowDenyPageForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.flowDenyPageForm,
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
.web-deny-page-wrap {
  max-width: 800px;
  min-width: 400px;
}

.template-img-box img {
  display: block;
  width: 100%;
}

.template-img-box {
  border: 1px solid #ccc;
  width: 200px;
}

.template-radio {
  position: relative;
  margin: 0 20px 40px 0 !important;
}

.template-radio .el-radio__input {
  position: absolute;
  bottom: -25px;
  left: 45%;

}

#template-show {
  border: 1px solid #ccc;
  width: 100%;
  height: 300px;
  font-size: 12px;
}
</style>
