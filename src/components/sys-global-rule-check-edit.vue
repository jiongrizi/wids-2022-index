<template>
  <div class="custom-edit-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>规则检测配置</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">
            <a class="el-button el-button--primary is-plain" :href="'/#/sys-global-rule-check/'">返回</a>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="margin-4x"></div>
    <el-row v-loading.fullscreen.lock="loadingPage">
      <el-col :span="24">
        <el-form class="custom-edit-form" :model="webRuleManageForm" :rules="rules" ref="webRuleManageForm"
          label-width="180px">
          <el-card class="box-card">
            <div>
              <el-form-item label="规则名称" prop="rule_name">
                <el-input v-if="uuid == 'new'" v-model="webRuleManageForm.rule_name"
                  placeholder="请输入字母开头，字母或数字组合，仅支持_-两种符号"> </el-input>
                <el-input v-else v-model="webRuleManageForm.rule_name" disabled> </el-input>
              </el-form-item>
              <el-form-item label="规则详情">
                <el-input v-model="webRuleManageForm.rule_detail"> </el-input>
              </el-form-item>
              <el-card class="box-card-rule" shadow="never">
                <div class="card-item" v-for="(bigItem, bigIndex) in ruleBigMatchs" :key="bigIndex">
                  <el-form-item label="匹配参数">
                    <div class="match-box" v-for="(item, index) in bigItem.ruleSmallMatchs" :key="index">
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
                    <el-button @click="addRuleMatchs(bigIndex)" plain type="primary">新增</el-button>
                  </el-form-item>

                  <el-form-item label="参数处理">
                    <div class="match-box" v-for="(item, index) in bigItem.argsPrepocessList" :key="index">
                      <div class="match-box-content">
                        <div class="match_key_cascader">
                          <el-select v-model="item.args_prepocess_value" placeholder="Select">
                            <el-option v-for="i in optionsArgs" :key="i.value" :label="i.label" :value="i.value" />
                          </el-select>
                        </div>
                      </div>
                      <el-button @click.prevent="removeArgsPrepocess(item, bigIndex)">删除</el-button>
                    </div>
                    <el-button @click="addArgsPrepocess(bigIndex)" plain type="primary">新增</el-button>
                  </el-form-item>



                  <el-form-item label="匹配方式">
                    <el-select v-model="bigItem.match_operator" placeholder="请选择">
                      <el-option v-for="item in optionsOperator" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="匹配内容">
                    <el-input v-model="bigItem.match_value"></el-input>
                  </el-form-item>

                  <div class="card-item-bottom">
                    <el-button type="danger" plain @click.prevent="removeRuleBigMatchs(bigItem)">删除</el-button>
                  </div>

                </div>
                <div class="card-footer">
                  <el-button class="button" type="primary" @click="addRuleBigMatchs(bigIndex)">新增</el-button>
                </div>
              </el-card>
            </div>
          </el-card>
        </el-form>
        <div class="margin-4x"></div>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="12">
                <a class="el-button el-button--primary is-plain" :href="'/#/sys-global-rule-check/'">返回</a>
              </el-col>
              <el-col :span="12" class="text-align-right">
                <el-button type="primary" @click="onClickWebRuleProSubmit('webRuleManageForm')" :loading="loading">保存
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
import { mixin, JXAjax, validateRuleName } from "../assets/scripts/common";
import { useRoute } from 'vue-router'
export default {
  mixins: [mixin],
  data() {
    return {
      loading: false,
      loadingPage: false,
      uuid: '',
      webRuleManageForm: {
        rule_detail: "",
        action_value: "",
        rule_log: "true",
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
          value: 'ctx',
          label: 'ctx',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
        {
          value: 'web_component_result',
          label: 'web_component_result',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
        {
          value: 'web_name_list_result',
          label: 'web_name_list_result',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
        {
          value: 'web_rule_result',
          label: 'web_rule_result',
          children: [
            { value: 'default', label: '自定义' }
          ]
        },
        {
          value: 'web_relate_rule_result',
          label: 'web_relate_rule_result',
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
        
      ],
      propsMatchKey: { expandTrigger: 'hover' },
      
      ruleBigMatchs: [{
        ruleSmallMatchs: [{
          rule_match_key_list: [],
          rule_match_key: '',
          showInput: false
        }],
        match_operator: "",
        match_value:"",
        checkboxPreprocess: [],
        argsPrepocessList: [
          { args_prepocess_value: '' }
        ]
      }],
      operator: '',
      optionsOperator: [
        { value: "rx", label: "正则匹配" },
        { value: "str_prefix", label: "前缀匹配" },
        { value: "str_suffix", label: "后缀匹配" },
        { value: "str_contain", label: "包含" },
        { value: "str_ncontain", label: "不包含" },
        { value: "str_eq", label: "等于" },
        { value: "str_neq", label: "不等于"},
        { value: "gt", label: "数字大于" },
        { value: "lt", label: "数字小于" },
        { value: "eq", label: "数字等于" },
        { value: "neq", label: "数字不等于" },
      ],
      optionsArgs: [
        { value: "none", label: "不处理", key: "none"},
        { value: "lowerCase", label: "小写处理", key: "lowerCase" },
        { value: "base64Decode", label: "BASE64解码", key: "base64Decode" },
        { value: "length", label: "长度计算", key: "length" },
        { value: "uriDecode", label: "URL解码", key: "uriDecode" },
        { value: "uniDecode", label: "UNICODE解码", key: "uniDecode" },
        { value: "hexDecode", label: "十六进制解码", key: "hexDecode" },       
        { value: "type", label: "获取数据类型", key: "type" },
      ],

    };
  },
  computed: {
    rules() {
      return {
        rule_name: [
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

        match_value: [
          {
            required: true,
            message: '请输入匹配内容',
            trigger: ["blur", "change"],
          },
        ],
        rule_action: [
          {
            required: true,
            message: '请选择执行动作',
            trigger: 'change' 
          },
        ],
        checkboxPreprocess: [
          { type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    var t = this;
    const route = useRoute()
    t.uuid = route.params.uuid;

    if (t.uuid == "new") { 
      t.loadingPage = false
    } else {
      t.loadingPage = false
      t.getData();
    }
  },
  methods: {
    getData() {
      var t = this;
      var postUrl = "/sys/waf_get_sys_global_rule_check";
      var oData = { rule_name: t.uuid };
      JXAjax(
        "post",
        postUrl,
        oData,
        function (response) {
          t.loadingPage = false;
          t.webRuleManageForm = response.data.message;
          var _rule_matchs = JSON.parse(t.webRuleManageForm.rule_matchs)
          var _ruleBigMatchs = [];
          for (var i in _rule_matchs) {
            var _match = [];
            var _prepocess = [];
            var _default = [
              "ctx",
              "web_component_result",
              "web_name_list_result",
              "web_rule_result",
              "web_relate_rule_result",
              "waf_description",
              "cookie",
              "post",
              "json_post",
              "query_string",
            ]

            for (var j in _rule_matchs[i].match_args) {
              var item = _rule_matchs[i].match_args[j]
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
            for (var m in _rule_matchs[i].args_prepocess) {
              _prepocess.push(
                {
                  "args_prepocess_value": _rule_matchs[i].args_prepocess[m]
                }
              )
            }

            _ruleBigMatchs.push({
              ruleSmallMatchs: _match,
              argsPrepocessList: _prepocess,
              match_operator: _rule_matchs[i].match_operator,
              match_value: _rule_matchs[i].match_value
            })
          }
          t.ruleBigMatchs = _ruleBigMatchs;
         },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },
    onClickWebRuleProSubmit(webRuleManageForm) {
      var t = this;      
      var _temp_matchs = [];
      if (t.ruleBigMatchs.length == 0) {
        t.$message({
          showClose: true,
          message: '请输入详细规则',
          type: "error",
        });
        return false;
      }
      for (var i in t.ruleBigMatchs) {
        var _match = [];
        var _prepocess = [];
        if (t.ruleBigMatchs[i].ruleSmallMatchs.length == 0) { 
          t.$message({
            showClose: true,
            message: '请选择匹配参数',
            type: "error",
          });
          return false;
        }
        
        for (var j in t.ruleBigMatchs[i].ruleSmallMatchs) {
          var item = t.ruleBigMatchs[i].ruleSmallMatchs[j]
          
          if (item.rule_match_key == "") { 
            t.$message({
              showClose: true,
              message: '请选择匹配参数',
              type: "error",
            });
            return false;
          } 
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
        if (t.ruleBigMatchs[i].argsPrepocessList.length == 0) {
          t.$message({
            showClose: true,
            message: '请选择参数处理',
            type: "error",
          });
          return false;
        }
        for (var m in t.ruleBigMatchs[i].argsPrepocessList) {
          if (t.ruleBigMatchs[i].argsPrepocessList[m].args_prepocess_value == "") { 
            t.$message({
              showClose: true,
              message: '请选择参数处理',
              type: "error",
            });
            return false;
          }
          _prepocess.push(t.ruleBigMatchs[i].argsPrepocessList[m].args_prepocess_value)
        }

        if (t.ruleBigMatchs[i].match_operator == "") { 
          t.$message({
            showClose: true,
            message: '请选择匹配方式',
            type: "error",
          });
          return false;
        }
        if (t.ruleBigMatchs[i].match_value == "") {
          t.$message({
            showClose: true,
            message: '请输入匹配内容',
            type: "error",
          });
          return false;
        }

        _temp_matchs.push({
          match_args: _match,
          args_prepocess: _prepocess,
          match_operator: t.ruleBigMatchs[i].match_operator,
          match_value: t.ruleBigMatchs[i].match_value
        })
      }
      t.webRuleManageForm.rule_matchs = JSON.stringify(_temp_matchs);
      var postUrl = "/sys/waf_edit_sys_global_rule_check";
      if (t.uuid == 'new') {
        postUrl = "/sys/waf_create_sys_global_rule_check";
      } 
      this.$refs[webRuleManageForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.webRuleManageForm,
            function (response) {
              t.loading = false;
              window.location.href = '/#/sys-global-rule-check/'
            },
            function () {
              t.loading = false;
            }
          );
        }
      });
    },
    removeArgsPrepocess(item, bigIndex) {
      var index = this.ruleBigMatchs[bigIndex].argsPrepocessList.indexOf(item);
      if (index != -1) {
        this.ruleBigMatchs[bigIndex].argsPrepocessList.splice(index, 1);
      }
    },
    addArgsPrepocess(bigIndex) {
      this.ruleBigMatchs[bigIndex].argsPrepocessList.push({ args_prepocess_value: '' })
    },
    addRuleMatchs(bigIndex) {
      this.ruleBigMatchs[bigIndex].ruleSmallMatchs.push({ rule_match_key: '', rule_match_key_list: [], showInput: false })
    },
    removeRuleMatchs(item, bigIndex) {
      var index = this.ruleBigMatchs[bigIndex].ruleSmallMatchs.indexOf(item);
      if (index != -1) {
        this.ruleBigMatchs[bigIndex].ruleSmallMatchs.splice(index, 1);
      }
    },
    removeRuleBigMatchs(bigItem) {
      var index = this.ruleBigMatchs.indexOf(bigItem);
      if (index != -1) {
        this.ruleBigMatchs.splice(index, 1);
      }
    },
    
    addRuleBigMatchs(bigIndex){
      this.ruleBigMatchs.push({
        ruleSmallMatchs: [{
          rule_match_key_list: [],
          rule_match_key: '',
          showInput: false
        }],
        match_operator: "",
        match_value:"",
        checkboxPreprocess: [],
        argsPrepocessList: [
          { args_prepocess_value: '' }
        ]
      })
    },
    
    onChangeRuleMatchs(event, item, bigIndex) {
      var index = this.ruleBigMatchs[bigIndex].ruleSmallMatchs.indexOf(item);
      if(event[1] == 'default') {
        this.ruleBigMatchs[bigIndex].ruleSmallMatchs[index].showInput = true;
        this.ruleBigMatchs[bigIndex].ruleSmallMatchs[index].rule_match_key = event[0] + ':';
      } else {
        this.ruleBigMatchs[bigIndex].ruleSmallMatchs[index].rule_match_key = event[0] + ':' + event[1];
      }
    },
    onChangeRuleInput(event, item, bigIndex) {
      var index = this.ruleBigMatchs[bigIndex].ruleSmallMatchs.indexOf(item);
      if(event == '') {
        this.ruleBigMatchs[bigIndex].ruleSmallMatchs[index].showInput = false;
        this.ruleBigMatchs[bigIndex].ruleSmallMatchs[index].rule_match_key = "";
        this.ruleBigMatchs[bigIndex].ruleSmallMatchs[index].rule_match_key_list = [];
      } else {
        this.ruleBigMatchs[bigIndex].ruleSmallMatchs[index].rule_match_key = event;
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
.custom-edit-form .match-box {
  
  display: inline-block;
  margin-bottom: 10px;
}
.custom-edit-form .el-button {
  margin-left: 10px;
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
