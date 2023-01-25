<template>
  <div class="custom-edit-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>流量防护规则</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">
            <a class="el-button el-button--primary is-plain"
              :href="'/#/group-rule/' + uuid + '/sys-flow-rule-protection'" v-if="ruleType == 'group_rule'">返回</a>
            <a class="el-button el-button--primary is-plain" :href="'/#/sys-flow-rule-protection/' + ruleType"
              v-else>返回</a>
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
                <el-input v-if="type == 'new'" v-model="webRuleManageForm.rule_name"
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

              <el-form-item label="执行动作" prop="rule_action">
                <el-select v-model="webRuleManageForm.rule_action" placeholder="请选择" @change="onChangeRuleAction()">
                  <el-option v-for="item in ruleAction" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-if="webRuleManageForm.rule_action == 'bot_check'">
                <el-select v-model="action_value" placeholder="请选择">
                  <el-option v-for="item in optionsBotCheck" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <p class="form-info-color">
                  说明：标准模式无需人机交互
                </p>
              </el-form-item>
              <el-form-item v-if="webRuleManageForm.rule_action == 'add_shared_dict_key'">
                <el-select v-model="action_value" placeholder="请选择">
                  <el-option v-for="item in optionsDict" :key="item.shared_dict_uuid" :label="item.shared_dict_name"
                    :value="item.shared_dict_uuid">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="webRuleManageForm.rule_action == 'add_name_list_item'">
                <el-select v-model="action_value" placeholder="请选择">
                  <el-option v-for="item in optionsNameList" :key="item.name_list_uuid" :label="item.name_list_name"
                    :value="item.name_list_uuid">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="日志记录">
                <el-switch v-model="webRuleManageForm.rule_log" active-value="true" inactive-value="false"></el-switch>
              </el-form-item>

            </div>
          </el-card>
        </el-form>
        <div class="margin-4x"></div>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="12">
                <a class="el-button el-button--primary is-plain"
                  :href="'/#/group-rule/' + uuid + '/sys-flow-rule-protection'" v-if="ruleType == 'group_rule'">返回</a>
                <a class="el-button el-button--primary is-plain" :href="'/#/sys-flow-rule-protection/' + ruleType"
                  v-else>返回</a>
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
      ruleType: 'single_rule',
      webRuleManageForm: {
        rule_detail: "",
        action_value: "",
        rule_log: "true",
      },
      type: 'edit',
      optionsMatchKey: [
        {
          value: 'http_args',
          label: 'http_args',
          children: [
            { value: 'path', label: 'path', leaf:true },
            { value: 'query_string', label: 'query_string', leaf:true },
            { value: 'method', label: 'method', leaf: true },
            { value: 'src_ip', label: 'src_ip', leaf: true },
            { value: 'raw_body', label: 'raw_body', leaf: true },
            { value: 'version', label: 'version', leaf: true },
            { value: 'scheme', label: 'scheme', leaf: true },
            { value: 'raw_header', label: 'raw_header', leaf: true },
          ]
        },
        {
          value: 'header_args',
          label: 'header_args',
          children: [
            { value: 'host', label: 'host', leaf: true },
            { value: 'cookie', label: 'cookie', leaf: true },
            { value: 'referer', label: 'referer', leaf: true },
            { value: 'user_agent', label: 'user_agent', leaf: true },
            { value: 'default', label: '自定义', leaf: true },
          ]
        },
        {
          value: 'cookie_args',
          label: 'cookie_args',
          children: [
            { value: 'default', label: '自定义', leaf: true }
          ]
        },
        {
          value: 'uri_args',
          label: 'uri_args',
          children: [
            { value: 'default', label: '自定义', leaf: true }
          ]
        },
        {
          value: 'post_args',
          label: 'post_args',
          children: [
            { value: 'default', label: '自定义', leaf: true }
          ]
        },
        {
          value: 'json_post_args',
          label: 'json_post_args',
          children: [
            { value: 'default', label: '自定义', leaf: true }
          ]
        },
        
        {
          value: 'shared_dict',
          label: 'shared_dict'
        },

      ],
      
      
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
      ruleAction: [
        { value: "block", label:"阻断请求" },
        { value: "reject_response", label: "拒绝响应" },
        { value: "watch", label: "观察模式" },
        { value: "bot_check", label: "人机识别" },
        { value: "add_shared_dict_key", label: "共享字典写入" },
        { value: "add_name_list_item", label: "名单写入" },
      ],
      optionsBotCheck: [
        { value: "standard", label: "标准" },
        { value: "slipper", label: "滑块" },
        { value: "image", label: "图片验证码" },
      ],
      optionsDict: [],
      optionsNameList: [],
      action_value: "",
      propsMatchKey: {
        expandTrigger: 'hover',
        lazy: true,
        lazyLoad(node, resolve) {
          if (node.label == "shared_dict") { 
            var nodes = [];
            JXAjax(
              "post",
              "/waf/waf_get_sys_shared_dict_list",
              {},
              function (response) {
                var _data = response.data.message;
                if (_data.length > 0) {
                  _data.forEach(item => {
                    nodes.push({
                      label: item.shared_dict_name,
                      value: item.shared_dict_uuid,
                      leaf: true
                    })
                  });
                } else { 
                  nodes.push({
                    label: "无",
                    value: "none",
                    leaf: true,
                    disabled: true
                  })
                }
                
                resolve(nodes)
              },
              function () {
      
              },
              "no-message"
            );
           
          }
        },
      }
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
        action_value: [
          { 
            required: true, message: '请选择匹配方式', trigger: 'change' 
          }
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
    t.ruleType = route.params.ruleType;
    t.type = route.params.type;

    if (t.type == "new") { 
      t.loadingPage = false
    } else {
      t.loadingPage = false
      JXAjax(
        "post",
        "/waf/waf_get_sys_shared_dict_list",
        {},
        function (response) {
          t.optionsDict = response.data.message;
      t.getData();
        },
        function () {

        },
        "no-message"
      );
    }
  },
  methods: {
    getData() {
      var t = this;
      var postUrl = "/waf/waf_get_sys_flow_rule_protection";
      var oData = { rule_uuid: t.uuid, rule_type: t.ruleType };
      if (t.ruleType == "group_rule") {
        oData = { rule_uuid: t.type, rule_type: t.ruleType };
      }
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
              "header_args",
              "cookie_args",
              "uri_args",
              "post_args",
              "json_post_args"
            ]

            for (var j in _rule_matchs[i].match_args) {
              var item = _rule_matchs[i].match_args[j]
              var key = item.key
              var value = item.value
              var show = "false"
              if (_default.indexOf(key) > -1) {
                show = "true"
              }
              if (key == "shared_dict") {
                t.optionsDict.forEach(s => {
                  if (s.shared_dict_uuid == value) {
                    _match.push({
                      "rule_match_key_list": [key, s.shared_dict_uuid],
                      "rule_match_key": key + ':' + s.shared_dict_name,
                      "showInput": show
                    })
                  }
                })
              } else { 
                _match.push({
                  "rule_match_key_list": [key, value],
                  "rule_match_key": key + ':' + value,
                  "showInput": show
                })
              }
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
          if (t.webRuleManageForm.rule_action == "add_name_list_item") { 
            t.onChangeRuleAction();
          }
          t.action_value = t.webRuleManageForm.action_value;
         },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },
    onChangeRuleAction() {
      var t = this;
      t.action_value = "";
      var oData = { };
      
      if (t.webRuleManageForm.rule_action == "add_name_list_item") {
        JXAjax(
          "post",
          "/waf/waf_get_sys_name_list_list",
          oData,
          function (response) {
            t.optionsNameList = response.data.message;
          },
          function () {

          },
          "no-message"
        );
      }
      if (t.optionsDict.length == 0 && t.webRuleManageForm.rule_action == "add_shared_dict_key") {
        JXAjax(
          "post",
          "/waf/waf_get_sys_shared_dict_list",
          oData,
          function (response) {
            t.optionsDict = response.data.message;
          },
          function () {

          },
          "no-message"
        );
      }
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
          if (_key == "shared_dict") { 
            _str = '{"key":"' + _key + '" , "value":"' + item.rule_match_key_list[1] + '"}'
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
      if (t.webRuleManageForm.rule_action == "bot_check" && t.action_value == "") {
        t.$message({
          message: '请选择人机识别方式',
          type: "error",
        });
        return false;
      }
      if (t.webRuleManageForm.rule_action == "add_shared_dict_key" && t.action_value == "") {
        t.$message({
          message: '请选择共享字典',
          type: "error",
        });
        return false;
      }
      if (t.webRuleManageForm.rule_action == "add_name_list_item" && t.action_value == "") {
        t.$message({
          message: '请选择名单',
          type: "error",
        });
        return false;
      }
      t.webRuleManageForm.action_value = t.action_value;
      var postUrl = "/waf/waf_edit_sys_flow_rule_protection";

      if (t.type == 'new') {
        postUrl = "/waf/waf_create_sys_flow_rule_protection";
        if (t.ruleType == "group_rule") { 
          t.webRuleManageForm.rule_group_uuid = t.uuid;
        }
      } else {
        t.webRuleManageForm.rule_uuid = t.uuid;
        if (t.ruleType == "group_rule") {
          t.webRuleManageForm.rule_uuid = t.type;
        }
      }

      t.webRuleManageForm.rule_type = t.ruleType;
      t.webRuleManageForm.rule_matchs = JSON.stringify(_temp_matchs);

      this.$refs[webRuleManageForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.webRuleManageForm,
            function (response) {
              t.loading = false;
              if (t.ruleType == 'group_rule') {
                window.location.href = '/#/group-rule/' + t.uuid + '/sys-flow-rule-protection';
              } else {
                window.location.href = '/#/sys-flow-rule-protection/' + t.ruleType;
              }
              
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
