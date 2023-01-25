<template>
  <div class="custom-edit-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>名单</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">
            <a class="el-button el-button--primary is-plain" :href="'/#/sys-global-name-list'">返回</a>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="margin-4x"></div>
    <el-row v-loading.fullscreen.lock="loadingPage">
      <el-col :span="24">
        <el-form class="custom-edit-form name-and-dict" :model="sysNameListForm" :rules="rules" ref="sysNameListForm"
          label-width="180px">
          <el-card class="box-card">
            <div>
              <el-form-item label="名单名称" prop="name_list_name">
                <el-input v-if="type == 'new'" v-model="sysNameListForm.name_list_name"
                  placeholder="请输入字母开头，字母或数字组合，仅支持_-两种符号"> </el-input>
                <el-input v-else v-model="sysNameListForm.name_list_name" disabled> </el-input>
              </el-form-item>
              <el-form-item label="名单描述">
                <el-input v-model="sysNameListForm.name_list_detail"> </el-input>
              </el-form-item>
              <el-form-item label="数量上限" prop="name_list_limit">
                <el-radio v-model="limit" label="0">无限制</el-radio>
                <el-radio v-model="limit" label="1">自定义</el-radio>
                <el-input v-model="sysNameListForm.name_list_limit" placeholder="请输入大于0的数字" v-if="limit == '1'">
                </el-input>
              </el-form-item>
              <el-form-item label="过期时间（秒）" prop="name_list_expire_time">
                <el-radio v-model="expire_time" label="0">无限制</el-radio>
                <el-radio v-model="expire_time" label="1">自定义</el-radio>
                <el-input v-model="sysNameListForm.name_list_expire_time" placeholder="请输入大于0的数字"
                  v-if="expire_time == '1'">
                </el-input>
              </el-form-item>
              <el-form-item label="匹配数据类型" prop="name_list_type">
                <el-radio v-model="sysNameListForm.name_list_type" label="string">字符串</el-radio>
                <el-radio v-model="sysNameListForm.name_list_type" label="table">数组</el-radio>
              </el-form-item>
              <el-form-item label="匹配参数" v-show="sysNameListForm.name_list_type == 'string'">
                <div class="match-box" v-for="(item, index) in ruleSmallMatchs" :key="index">
                  <div class="match-box-content">
                    <div class="match_key_cascader">
                      <el-cascader separator=":" v-model="item.rule_match_key_list" :options="optionsMatchKey"
                        :props="propsMatchKey" @change="onChangeRuleMatchs($event, item, bigIndex)" clearable>
                      </el-cascader>
                    </div>
                    <div v-show="item.showInput" class="match_key_input">
                      <el-input v-model="item.rule_match_key" clearable
                        @change="onChangeRuleInput($event, item, bigIndex)"></el-input>
                    </div>
                  </div>

                  <el-button @click.prevent="removeRuleMatchs(item, bigIndex)">删除</el-button>
                </div>
                <el-button @click="addRuleMatchs(bigIndex)" plain type="primary" class="button-new">新增</el-button>
              </el-form-item>
              <el-form-item label="规则匹配" v-show="sysNameListForm.name_list_type == 'table'">
                <div class="match-box-content">
                  <div class="match_key_cascader">
                    <el-cascader separator=":" v-model="ruleSmallMatchsType.rule_match_key_list" :options="optionsMatchKeyType"
                      :props="propsMatchKeyType" @change="onChangeRuleMatchsType($event)" clearable>
                    </el-cascader>
                  </div>
                  <div v-show="ruleSmallMatchsType.showInput" class="match_key_input">
                    <el-input v-model="ruleSmallMatchsType.rule_match_key" clearable
                      @change="onChangeRuleInputType($event)"></el-input>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="重复写入抑制（秒）" prop="repeated_writing_suppression">
                <el-input v-model="sysNameListForm.repeated_writing_suppression" placeholder="请输入大于0的数字">
                </el-input>
              </el-form-item>
              
            </div>
          </el-card>
        </el-form>
        <div class="margin-4x"></div>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="12">
                <a class="el-button el-button--primary is-plain" :href="'/#/sys-global-name-list'">返回</a>
              </el-col>
              <el-col :span="12" class="text-align-right">
                <el-button type="primary" @click="onClickWebRuleProSubmit('sysNameListForm')" :loading="loading">保存
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
      sysNameListForm: { 
        name_list_type: "string",
        name_list_detail: "",
        action_value:"",
      },
      type: 'edit',
      optionsMatchKey: [
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
          value: 'query_string',
          label: 'query_string',
          children: [
            { value: 'default', label: '自定义' }
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
          value: 'json_post',
          label: 'json_post',
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
          value: 'cookie',
          label: 'cookie',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
        {
          value: 'web_check_result',
          label: 'web_check_result',
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
          value: 'string',
          label: 'string',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
      ],
      propsMatchKey: { expandTrigger: 'hover' },
      propsMatchKeyType: { expandTrigger: 'hover' },
      optionsMatchKeyType: [
        {
          value: 'ctx',
          label: 'ctx',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
      ],
      ruleSmallMatchs: [{
        rule_match_key_list: [],
        rule_match_key: '',
        showInput: false
      }],
      ruleSmallMatchsType: {
        rule_match_key_list: [],
        rule_match_key: '',
        showInput: false
      },

    };
  },
  computed: {
    rules() {
      return {
        name_list_name: [
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
        name_list_limit: [
          {
            required: true,
            message: '请输入大于等于0的数字，0代表无限数量',
            trigger: ["blur", "change"],
          },
          {
            validator: validatePositiveInt,
            trigger: ["blur", "change"],
          },
        ],
        name_list_expire_time: [
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
      var postUrl = "/sys/waf_get_sys_global_name_list";
      var oData = { name_list_name: t.uuid };
      
      JXAjax(
        "post",
        postUrl,
        oData,
        function (response) {
          t.loadingPage = false;
          t.sysNameListForm = response.data.message;
          var _rule_matchs = JSON.parse(t.sysNameListForm.name_list_rule)
          var _match = [];

          var _default = [
            "query_string",
              "ctx",
              "json_post",
              "post",
              "cookie",
              "web_check_result",
            "waf_description",
              "string",
          ]

          if (t.sysNameListForm.name_list_type == "string") {
            for (var j in _rule_matchs) {
              var item = _rule_matchs[j]
              var key = item.key
              var value = item.value
              var show = "false"
              if (_default.indexOf(key) > -1) {
                show = "true"
              }

              _match.push({
                "rule_match_key_list": [key, value],
                "rule_match_key": key + ':' + value,
                "showInput": show
              })
            }
            t.ruleSmallMatchs = _match;
          } else { 
            t.ruleSmallMatchsType.rule_match_key_list = [_rule_matchs.key, _rule_matchs.value];
            t.ruleSmallMatchsType.rule_match_key = _rule_matchs.key + ":" + _rule_matchs.value;
            t.ruleSmallMatchsType.showInput = "true";
          }

          if (t.sysNameListForm.name_list_limit != "100000000") { 
            t.limit = "1";
          }
          if (t.sysNameListForm.name_list_expire_time != "3155760000") { 
            t.expire_time = "1";
          }
         },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },
    onClickWebRuleProSubmit(sysNameListForm) {
      var t = this;      
      var _match = [];
      if (t.sysNameListForm.name_list_type == "string") { 
        if (t.ruleSmallMatchs.length == 0) {
          t.$message({
            message: '请选择匹配参数',
            type: "error",
          });
          return false;
        }
        if (t.ruleSmallMatchs[0].rule_match_key == "") { 
          t.$message({
            message: '请选择匹配参数',
            type: "error",
          });
          return false;
        }

        for (var j in t.ruleSmallMatchs) {
          var item = t.ruleSmallMatchs[j]
          var _str = "";
          var _arr = [];
          var _key = "";
          var _value = "";
        
            if (item.rule_match_key) {
              _arr = item.rule_match_key.split(":");
            }
            if (_arr.length > 0) {
              _key = _arr[0];
              _value = item.rule_match_key.replace(new RegExp(_key + ":"), "");
              _str = '{"key":"' + _key + '" , "value":"' + _value + '"}'
          }

          _match.push(JSON.parse(_str))
        }
      }
      
      if (t.sysNameListForm.name_list_type == "table") { 
        if (t.ruleSmallMatchsType.rule_match_key == "") { 
          t.$message({
            message: '请选择规则匹配参数',
            type: "error",
          });
          return false;
        }
        var _arr_type = [];
        var _key_type = "";
        var _value_type = "";

        if (t.ruleSmallMatchsType.rule_match_key) {
          _arr_type = t.ruleSmallMatchsType.rule_match_key.split(":");
        }
        if (_arr_type.length > 0) {
          _key_type = _arr_type[0];
          _value_type = t.ruleSmallMatchsType.rule_match_key.replace(new RegExp(_key_type + ":"), "");
          _match = {"key": _key_type , "value": _value_type }
        }
      }
      
      
 

      if (t.limit == "0") { 
        t.sysNameListForm.name_list_limit = 100000000;
      }
      if (t.expire_time == "0") { 
        t.sysNameListForm.name_list_expire_time = 3155760000;
      }

      var postUrl = "/sys/waf_edit_sys_global_name_list";
      if (t.type == 'new') {
        postUrl = "/sys/waf_create_sys_global_name_list";
      } else {
        t.sysNameListForm.name_list_name = t.uuid;
      }

      t.sysNameListForm.name_list_rule = JSON.stringify(_match);

      this.$refs[sysNameListForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.sysNameListForm,
            function (response) {
              t.loading = false;
              window.location.href = '/#/sys-global-name-list/'
            },
            function () {
              t.loading = false;
            }
          );
        }
      });
    },
    removeRuleMatchs(item) {
      var index = this.ruleSmallMatchs.indexOf(item);
      if (index !== -1) {
        this.ruleSmallMatchs.splice(index, 1);
      }
    },
    
    addRuleMatchs(){
      this.ruleSmallMatchs.push({rule_match_key: '', showInput: false})
    },

    onChangeRuleMatchs(event, item, bigIndex) {
      var index = this.ruleSmallMatchs.indexOf(item);
      if(event[1] == 'default') {
        this.ruleSmallMatchs[index].showInput = true;
        this.ruleSmallMatchs[index].rule_match_key = event[0] + ':';
      } else {
        this.ruleSmallMatchs[index].rule_match_key = event[0] + ':' + event[1];
      }
    },
    onChangeRuleInput(event, item, bigIndex) {
      var index = this.ruleSmallMatchs.indexOf(item);
      if(event == '') {
        this.ruleSmallMatchs[index].showInput = false;
        this.ruleSmallMatchs[index].rule_match_key = "";
        this.ruleSmallMatchs[index].rule_match_key_list = [];
      } else {
        this.ruleSmallMatchs[index].rule_match_key = event;
      }
    },

    onChangeRuleMatchsType(event) {
      if(event[1] == 'default') {
        this.ruleSmallMatchsType.showInput = true;
        this.ruleSmallMatchsType.rule_match_key = event[0] + ':';
      } else {
        this.ruleSmallMatchsType.rule_match_key = event[0] + ':' + event[1];
      }
    },
    onChangeRuleInputType(event) {
      if(event == '') {
        this.ruleSmallMatchsType.showInput = false;
        this.ruleSmallMatchsType.rule_match_key = "";
        this.ruleSmallMatchsType.rule_match_key_list = [];
      } else {
        this.ruleSmallMatchsType.rule_match_key = event;
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
</style>
