<template>
  <div class="custom-edit-wrap sys-analysis-api-edit">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>处置API配置</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">
            <a class="el-button el-button--primary is-plain" :href="'/#/sys-action-api'">返回</a>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="margin-4x"></div>
    <el-row v-loading.fullscreen.lock="loadingPage">
      <el-col :span="24">
        <el-form class="custom-edit-form name-and-dict" :model="sysGlobalAnalysisApiForm" :rules="rules" ref="sysGlobalAnalysisApiForm"
          label-width="180px">
          <el-card class="box-card">
            <div>
              <el-form-item label="API名称" prop="api_name">
                <el-input v-if="type == 'new'" v-model="sysGlobalAnalysisApiForm.api_name"
                  placeholder="请输入字母开头，字母或数字组合，仅支持_-两种符号"> </el-input>
                <el-input v-else v-model="sysGlobalAnalysisApiForm.api_name" disabled> </el-input>
              </el-form-item>
              <el-form-item label="API描述">
                <el-input v-model="sysGlobalAnalysisApiForm.api_detail"> </el-input>
              </el-form-item>           

              <el-form-item label="API地址" prop="api_website">
                <el-input v-model="sysGlobalAnalysisApiForm.api_website"> </el-input>
              </el-form-item>
              <el-form-item label="API参数配置"  class="longer-cascader">
                <div class="match-box" v-for="(item, index) in ruleConfigMatchs" :key="index">
                  <div class="match_key_title">
                    <el-input v-model="item.key" placeholder="key"> </el-input>
                  </div>
                  <div class="match-box-content">
                    <div class="match_key_cascader">
                      <el-cascader separator=":" v-model="item.rule_match_key_list" :options="optionsConfigKey"
                        :props="propsConfigKey" @change="onChangeConfigMatchs($event, item, bigIndex)" clearable>
                      </el-cascader>
                    </div>
                    <div v-show="item.showInput" class="match_key_input">
                      <el-input v-model="item.rule_match_key" clearable
                        @change="onChangeConfigInput($event, item, bigIndex)"></el-input>
                    </div>
                  </div>

                  <el-button @click.prevent="removeConfigMatchs(item, bigIndex)">删除</el-button>
                </div>
                <el-button @click="addConfigMatchs(bigIndex)" plain type="primary" class="button-new">新增</el-button>
              </el-form-item>
              <el-form-item label="抑制参数配置" class="longer-cascader">
                <div class="match-box match-box-longer" v-for="(item, index) in supprConfigMatchs" :key="index">
                  <div class="match-box-content">
                    <div class="match_key_cascader">
                      <el-cascader separator=":" v-model="item.rule_match_key_list" :options="optionsConfigKey"
                        :props="propsConfigKey" @change="onChangeSupperConfigMatchs($event, item, bigIndex)" clearable>
                      </el-cascader>
                    </div>
                    <div v-show="item.showInput" class="match_key_input">
                      <el-input v-model="item.rule_match_key" clearable @change="onChangeSupperConfigInput($event, item, bigIndex)">
                      </el-input>
                    </div>
                  </div>
              
                  <el-button @click.prevent="removeSupperConfigMatchs(item, bigIndex)">删除</el-button>
                </div>
                <el-button @click="addSupperConfigMatchs(bigIndex)" plain type="primary" class="button-new">新增</el-button>
              </el-form-item>
              <el-form-item label="重复写入抑制（秒）" prop="repeated_writing_suppression">
                <el-input v-model="sysGlobalAnalysisApiForm.repeated_writing_suppression"> </el-input>
              </el-form-item>     
            </div>
          </el-card>
        </el-form>
        <div class="margin-4x"></div>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="12">
                <a class="el-button el-button--primary is-plain" :href="'/#/sys-action-api'">返回</a>
              </el-col>
              <el-col :span="12" class="text-align-right">
                <el-button type="primary" @click="onClickWebRuleProSubmit('sysGlobalAnalysisApiForm')" :loading="loading">保存
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
import { mixin, JXAjax, validateRuleName,  validatePositiveInt } from "../assets/scripts/common";
import { useRoute } from 'vue-router'
export default {
  mixins: [mixin],
  data() {
    return {
      loading: false,
      loadingPage: false,
      uuid: '',
      limit: '0',
      expire_time: '0',
      sysGlobalAnalysisApiForm: { 
        api_detail: "",
      },
      type: 'edit',

      propsConfigKey: { expandTrigger: 'hover' },
      optionsConfigKey: [
        {
          value: 'waf_log',
          label: 'waf_log',
          children: [
            { value: 'cookie', label: 'cookie' },
            { value: 'post_data', label: 'post_data' },
            { value: 'query_string', label: 'query_string' },
            { value: 'host', label: 'host' },
            { value: 'uri', label: 'uri' },
            { value: 'src_ip', label: 'src_ip' },
            { value: 'req_raw_data', label: 'req_raw_data' },
            { value: 'res_raw_data', label: 'res_raw_data' },
            { value: 'waf_description', label: 'waf_description' },
            { value: 'content_length', label: 'content_length' },
            { value: 'ret_code', label: 'ret_code' },
            { value: 'ssl_ciphers', label: 'ssl_ciphers' },
            { value: 'ssl_protocol', label: 'ssl_protocol' },
            { value: 'request_time', label: 'request_time' },
            { value: 'user_agent', label: 'user_agent' },
            { value: 'waf_action', label: 'waf_action' },
            { value: 'waf_app', label: 'waf_app' },
            { value: 'x5_action', label: 'x5_action' },
            { value: 'x5_policy_id', label: 'x5_policy_id' },
            { value: 'x5_test', label: 'x5_test' },
            { value: 'x_forward_for', label: 'x_forward_for' },
            { value: 'waf_service', label: 'waf_service' },
            { value: 'set_cookie', label: 'set_cookie' },
            { value: 'rqs_content_type', label: 'rqs_content_type' },
            { value: 'rsp_content_type', label: 'rsp_content_type' },
            { value: 'request_datetime', label: 'request_datetime' },
            { value: 'region', label: 'region' },
            { value: 'referer', label: 'referer' },
            { value: 'method', label: 'method' },
            { value: 'jump_location', label: 'jump_location' },
            { value: 'https', label: 'https' },
            { value: 'eagleeye_traceid', label: 'eagleeye_traceid' },
            { value: 'dst_ip', label: 'dst_ip' },     
          ]
        },
       {
          value: 'ctx',
          label: 'ctx',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
        {
          value: 'waf_description',
          label: 'waf_description',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
        {
          value: 'cookie',
          label: 'cookie',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
        {
          value: 'post',
          label: 'post',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
        {
          value: 'json_post',
          label: 'json_post',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
        {
          value: 'query_string',
          label: 'query_string',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
        {
          value: 'string',
          label: 'string',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
      ],

      ruleConfigMatchs: [{
        key: "",
        rule_match_key_list: [],
        rule_match_key: '',
        showInput: false
      }],
      supprConfigMatchs: [{
        rule_match_key_list: [],
        rule_match_key: '',
        showInput: false
      }],

    };
  },
  computed: {
    rules() {
      return {
        api_name: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: ["blur", "change"],
          },
          {
            validator: validateRuleName,
            trigger: ["blur", "change"],
          },
        ],
        api_website: [
          {
            required: true,
            message: '请输入',
            trigger: ["blur", "change"],
          },
          
        ],
        
        repeated_writing_suppression: [
          {
            required: true,
            message: '请输入大于0的数字',
            trigger: ["blur", "change"],
          },
          {
            validator: validatePositiveInt,
            trigger: ["blur", "change"],
          },
        ],
        
      }
    }
  },
  mounted() {
    var t = this;
    const route = useRoute()
    t.uuid = route.params.uuid;
    if (t.uuid == "new") { 
      t.type = "new";
      t.loadingPage = false
    } else {
      t.type = "edit"
      t.loadingPage = false
      t.getData();
    }
  },
  methods: {
    getData() {
      var t = this;
      var postUrl = "/sys/waf_get_sys_action_api";
      var oData = { api_name: t.uuid };
      
      JXAjax(
        "post",
        postUrl,
        oData,
        function (response) {
          t.loadingPage = false;
          t.sysGlobalAnalysisApiForm = response.data.message;


          var _rule_matchs_config = JSON.parse(t.sysGlobalAnalysisApiForm.api_conf)
          var _match_config = [];
          var _default_config = [
              "ctx",
              "web_check_result",
              "waf_description",
              "cookie",
              "post",
              "json_post",
            "query_string",
            "string"
              
          ]

          for (var j_config in _rule_matchs_config) {
            var item_config = _rule_matchs_config[j_config]
            var big_key = Object.keys(item_config)[0]
            var small_json = item_config[big_key]
            
            var key_config = small_json.key
            var value_config = small_json.value
            var show_config = "false"
            if (_default_config.indexOf(key_config) > -1) {
              show_config = "true"
            }

            _match_config.push({
              "key": big_key,
              "rule_match_key_list": [key_config, value_config],
              "rule_match_key": key_config + ':' + value_config,
              "showInput": show_config
            })
          }
          t.ruleConfigMatchs = _match_config;



          var _rule_matchs_config_suppr = JSON.parse(t.sysGlobalAnalysisApiForm.suppression_conf)
          var _match_config_suppr = [];
          var _default_config_suppr = [
            "ctx",
            "web_check_result",
            "waf_description",
            "cookie",
            "post",
            "json_post",
            "query_string",
            "string"

          ]

          for (var j_config_suppr in _rule_matchs_config_suppr) {
            var item_config_suppr = _rule_matchs_config_suppr[j_config_suppr]
            var key_config_suppr = item_config_suppr.key
            var value_config_suppr = item_config_suppr.value
            var show_config_suppr = "false"
            if (_default_config_suppr.indexOf(key_config_suppr) > -1) {
              show_config_suppr = "true"
            }

            _match_config_suppr.push({
              "rule_match_key_list": [key_config_suppr, value_config_suppr],
              "rule_match_key": key_config_suppr + ':' + value_config_suppr,
              "showInput": show_config_suppr
            })
          }
          t.supprConfigMatchs = _match_config_suppr;
          
         },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },
    onClickWebRuleProSubmit(sysGlobalAnalysisApiForm) {
      var t = this;      
      

      var _match_config = [];
      if (t.ruleConfigMatchs.length == 0) {
        t.$message({
          message: '请选择API参数配置',
          type: "error",
        });
        return false;
      }
      if (t.ruleConfigMatchs[0].rule_match_key == "") { 
        t.$message({
          message: '请选择API参数配置',
          type: "error",
        });
        return false;
      }
      
      for (var j_config in t.ruleConfigMatchs) {
        var item_config = t.ruleConfigMatchs[j_config]
        var _str_config = "";
        var _arr_config = [];
        var _key_config = "";
        var _value_config = "";

        if (item_config.key == "") { 
          t.$message({
            message: '请输入key值',
            type: "error",
          });
          return false;
        }
        
        if (item_config.rule_match_key) {
          _arr_config = item_config.rule_match_key.split(":");
        }
        if (_arr_config.length > 0) {
          _key_config = _arr_config[0];
          _value_config = item_config.rule_match_key.replace(new RegExp(_key_config + ":"), "");
          _str_config = '{"' + item_config.key + '": {"key":"' + _key_config + '", "value": "' + _value_config + '"}}'
        }

        _match_config.push(JSON.parse(_str_config))
      }

      
      var _match_config_suppr = [];
      if (t.supprConfigMatchs.length == 0) {
        t.$message({
          message: '请选择抑制参数配置',
          type: "error",
        });
        return false;
      }
      if (t.supprConfigMatchs[0].rule_match_key == "") {
        t.$message({
          message: '请选择抑制参数配置',
          type: "error",
        });
        return false;
      }

      for (var j_config_suppr in t.supprConfigMatchs) {
        var item_config_suppr = t.supprConfigMatchs[j_config_suppr]
        var _str_config_suppr = "";
        var _arr_config_suppr = [];
        var _key_config_suppr = "";
        var _value_config_suppr = "";

        if (item_config_suppr.rule_match_key) {
          _arr_config_suppr = item_config_suppr.rule_match_key.split(":");
        }
        if (_arr_config_suppr.length > 0) {
          _key_config_suppr = _arr_config_suppr[0];
          _value_config_suppr = item_config_suppr.rule_match_key.replace(new RegExp(_key_config_suppr + ":"), "");
          _str_config_suppr = '{"key":"' + _key_config_suppr + '" , "value":"' + _value_config_suppr + '"}'
        }

        _match_config_suppr.push(JSON.parse(_str_config_suppr))
      }

      var postUrl = "/sys/waf_edit_sys_action_api";
      if (t.type == 'new') {
        postUrl = "/sys/waf_create_sys_action_api";
      } else {
        t.sysGlobalAnalysisApiForm.api_name = t.uuid;
      }
      t.sysGlobalAnalysisApiForm.api_conf = JSON.stringify(_match_config);
      t.sysGlobalAnalysisApiForm.suppression_conf = JSON.stringify(_match_config_suppr);

      this.$refs[sysGlobalAnalysisApiForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.sysGlobalAnalysisApiForm,
            function (response) {
              t.loading = false;
              window.location.href = '/#/sys-action-api/'
            },
            function () {
              t.loading = false;
            }
          );
        }
      });
    }, 

    removeConfigMatchs(item) {
      var index = this.ruleConfigMatchs.indexOf(item);
      if (index !== -1) {
        this.ruleConfigMatchs.splice(index, 1);
      }
    },
    
    addConfigMatchs(){
      this.ruleConfigMatchs.push({rule_match_key: '', showInput: false})
    },

    onChangeConfigMatchs(event, item, bigIndex) {
      var index = this.ruleConfigMatchs.indexOf(item);
      if(event[1] == 'default') {
        this.ruleConfigMatchs[index].showInput = true;
        this.ruleConfigMatchs[index].rule_match_key = event[0] + ':';
      } else {
        this.ruleConfigMatchs[index].rule_match_key = event[0] + ':' + event[1];
      }
    },
    onChangeConfigInput(event, item, bigIndex) {
      var index = this.ruleConfigMatchs.indexOf(item);
      if(event == '') {
        this.ruleConfigMatchs[index].showInput = false;
        this.ruleConfigMatchs[index].rule_match_key = "";
        this.ruleConfigMatchs[index].rule_match_key_list = [];
      } else {
        this.ruleConfigMatchs[index].rule_match_key = event;
      }
    },
    removeSupperConfigMatchs(item) {
      var index = this.supprConfigMatchs.indexOf(item);
      if (index !== -1) {
        this.supprConfigMatchs.splice(index, 1);
      }
    },

    addSupperConfigMatchs() {
      this.supprConfigMatchs.push({ rule_match_key: '', showInput: false })
    },

    onChangeSupperConfigMatchs(event, item, bigIndex) {
      var index = this.supprConfigMatchs.indexOf(item);
      if (event[1] == 'default') {
        this.supprConfigMatchs[index].showInput = true;
        this.supprConfigMatchs[index].rule_match_key = event[0] + ':';
      } else {
        this.supprConfigMatchs[index].rule_match_key = event[0] + ':' + event[1];
      }
    },
    onChangeSupperConfigInput(event, item, bigIndex) {
      var index = this.supprConfigMatchs.indexOf(item);
      if (event == '') {
        this.supprConfigMatchs[index].showInput = false;
        this.supprConfigMatchs[index].rule_match_key = "";
        this.supprConfigMatchs[index].rule_match_key_list = [];
      } else {
        this.supprConfigMatchs[index].rule_match_key = event;
      }
    },
    
  },
};
</script>
<style>





.custom-edit-wrap {
  max-width: 800px;
  min-width: 400px;
}
.custom-edit-wrap .match-inline-block {
  width: 192px;
}
.custom-edit-form .el-checkbox + .el-checkbox {
  margin-left: 0px;
  margin-right: 30px;
}
.custom-edit-form .el-checkbox {
  margin-left: 0px;
  margin-right: 30px;
}
.custom-edit-form .el-select {
  width: 100%;
}
.custom-edit-form.name-and-dict .match-box {
  display: inline-block;
  margin-bottom: 10px;
  margin-right: 10px;
}

.custom-edit-form .el-button {
  margin-left: 10px;
}
.custom-edit-form .button-new {
  margin-left: 0px;
}

.custom-edit-form .match-box-content {
  position: relative;
  display: inline-block;
}
.custom-edit-form .match_key_cascader {
  position: relative;
  display: inline-block;
}
.custom-edit-form .match_key_input {
  position: absolute;
  display: inline-block;
  top: 0;
  left: 0;
  width: 100%;
}
.custom-edit-form .match_key_title {
  width: 100px;
  display: inline-block;
  margin-right: 10px;
}
.custom-edit-form .rule-level-box .el-form-item__content {
  margin-left: 10px;
}
.box-card-rule {
  margin-bottom: 22px;
  border: 1px solid #409eff;
}
.box-card-rule .card-item {
  border-bottom: 1px solid #e0e3e9;
  margin-bottom: 20px;
}
.box-card-rule .card-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.box-card-rule .card-item-bottom {
  text-align: right;
  margin-bottom: 20px;
}
.longer-cascader .match-box {
  width: calc(100% - 100px);
}
.longer-cascader .match-box-content {
  width: calc(100% - 82px);
}
.longer-cascader .match_key_cascader{
  width: 100%;
}
.longer-cascader .el-cascader{
  width: 100%;
}
.sys-analysis-api-edit .longer-cascader .match-box-content {
  width: calc(100% - 190px);
}

.sys-analysis-api-edit .longer-cascader .match-box-longer .match-box-content {
  width: calc(100% - 80px);
}
</style>
