<template>
  <div class="custom-edit-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>全局关联规则配置</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">
            <a class="el-button el-button--primary is-plain" :href="'/#/global-group-rule/' + uuid + '/sys-global-relate-rule-check'"
              v-if="ruleType == 'group_rule'">返回</a>
            <a class="el-button el-button--primary is-plain" :href="'/#/sys-global-relate-rule-check/' + ruleType" v-else>返回</a>
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
                  <el-form-item label="匹配参数" class="longer-cascader">
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

                  <el-form-item label="参数处理"  class="longer-cascader">
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

              <el-form-item label="执行动作"  class="longer-cascader">
                <div class="match-box" v-for="(item, index) in ruleSmallMatchsAction" :key="index">
                  <div class="match-box-content">
                    <div class="match_key_cascader">
                      <el-cascader separator=":" v-model="item.rule_match_key_list" :options="optionsMatchKeyAction"
                        :props="propsMatchKeyAction" @change="onChangeRuleMatchsAction($event, item, bigIndex)" clearable>
                      </el-cascader>
                    </div>
                    <!-- <div v-show="item.showInput" class="match_key_input">
                      <el-input v-model="item.rule_match_key" clearable
                        @change="onChangeRuleInputAction($event, item, bigIndex)"></el-input>
                    </div> -->
                  </div>

                  <el-button @click.prevent="removeRuleMatchsAction(item, bigIndex)">删除</el-button>
                </div>
                <el-button @click="addRuleMatchsAction(bigIndex)" plain type="primary" class="button-new">新增</el-button>
              </el-form-item>

              <el-form-item label="全局分析">
                <el-switch v-model="webRuleManageForm.global_analysis" active-value="true" inactive-value="false"></el-switch>
              </el-form-item>
              <el-form-item label="情报记录">
                <el-switch v-model="webRuleManageForm.Intelligence_record" active-value="true" inactive-value="false"></el-switch>
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
                  :href="'/#/global-group-rule/' + uuid + '/sys-global-relate-rule-check'" v-if="ruleType == 'group_rule'">返回</a>
                <a class="el-button el-button--primary is-plain" :href="'/#/sys-global-relate-rule-check/' + ruleType"
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
        global_analysis: "false",
        Intelligence_record: "false",
      },
      type: 'edit',
      optionsMatchKey: [
         {
          value: 'waf_log',
          label: 'waf_log',
          children: [
            { value: 'cookie', label: 'cookie' , leaf:true},
            { value: 'post_data', label: 'post_data' , leaf:true},
            { value: 'query_string', label: 'query_string' , leaf:true},
            { value: 'host', label: 'host' , leaf:true},
            { value: 'uri', label: 'uri' , leaf:true},
            { value: 'src_ip', label: 'src_ip' , leaf:true},
            { value: 'req_raw_data', label: 'req_raw_data' , leaf:true},
            { value: 'res_raw_data', label: 'res_raw_data' , leaf:true},
            { value: 'waf_description', label: 'waf_description' , leaf:true},
            { value: 'content_length', label: 'content_length' , leaf:true},
            { value: 'ret_code', label: 'ret_code', leaf:true },
            { value: 'ssl_ciphers', label: 'ssl_ciphers' , leaf:true},
            { value: 'ssl_protocol', label: 'ssl_protocol' , leaf:true},
            { value: 'request_time', label: 'request_time' , leaf:true},
            { value: 'user_agent', label: 'user_agent' , leaf:true},
            { value: 'waf_action', label: 'waf_action' , leaf:true},
            { value: 'waf_app', label: 'waf_app' , leaf:true},
            { value: 'x5_action', label: 'x5_action' , leaf:true},
            { value: 'x5_policy_id', label: 'x5_policy_id' , leaf:true},
            { value: 'x5_test', label: 'x5_test' , leaf:true},
            { value: 'x_forward_for', label: 'x_forward_for' , leaf:true},
            { value: 'waf_service', label: 'waf_service' , leaf:true},
            { value: 'set_cookie', label: 'set_cookie' , leaf:true},
            { value: 'rqs_content_type', label: 'rqs_content_type' , leaf:true},
            { value: 'rsp_content_type', label: 'rsp_content_type' , leaf:true},
            { value: 'request_datetime', label: 'request_datetime' , leaf:true},
            { value: 'region', label: 'region' , leaf:true},
            { value: 'referer', label: 'referer' , leaf:true},
            { value: 'method', label: 'method' , leaf:true},
            { value: 'jump_location', label: 'jump_location' , leaf:true},
            { value: 'https', label: 'https' , leaf:true},
            { value: 'eagleeye_traceid', label: 'eagleeye_traceid' , leaf:true},
            { value: 'dst_ip', label: 'dst_ip' , leaf:true},     
          ]
        },
        
        {
          value: 'ctx',
          label: 'ctx',
          children: [
            { value: 'default', label: '自定义' , leaf:true}
          ] 
        }, 
        {
          value: 'waf_description',
          label: 'waf_description',
          children: [
            { value: 'default', label: '自定义' , leaf:true}
          ] 
        }, 
        {
          value: 'component_result',
          label: 'component_result',
          
        }, 
        {
          value: 'analysis_api_result',
          label: 'analysis_api_result',
        }, 
        {
          value: 'name_list_result',
          label: 'name_list_result',
          
        }, 
        {
          value: 'rule_result',
          label: 'rule_result',
          
        }, 
        {
          value: 'relate_rule_result',
          label: 'relate_rule_result',
          
        },
        {
          value: 'shared_dict',
          label: 'shared_dict',
          
        }, 

        {
          value: 'cookie',
          label: 'cookie',
          children: [
            { value: 'default', label: '自定义' , leaf:true}
          ]
        }, 
        {
          value: 'post',
          label: 'post',
          children: [
            { value: 'default', label: '自定义' , leaf:true}
          ]
        }, 
        {
          value: 'json_post',
          label: 'json_post',
          children: [
            { value: 'default', label: '自定义' , leaf:true}
          ]
        }, 
        {
          value: 'query_string',
          label: 'query_string',
          children: [
            { value: 'default', label: '自定义' , leaf:true}
          ]
        }, 

      ],
      propsMatchKey: {
        expandTrigger: 'hover',
        lazy: true,
        lazyLoad(node, resolve) {
          if (node.label == "shared_dict") { 
            var nodes = [];
            JXAjax(
              "post",
              "/sys/waf_get_sys_global_shared_dict_list",
              {},
              function (response) {
                var _data = response.data.message;
                if (_data.length > 0) {
                  _data.forEach(item => {
                    nodes.push({
                      label: item.shared_dict_name,
                      value: item.shared_dict_name,
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
          if (node.label == "component_result") { 
            var nodes_component = [];
            JXAjax(
              "post",
              "/sys/waf_get_sys_global_component_protection_list",
              {},
              function (response) {
                var _data = response.data.message;
                
                if (_data.length > 0) {
                  _data.forEach(item => {
                    nodes_component.push({
                      label: item.name,
                      value: item.name,
                      leaf: true
                    })
                  });

                } else { 
                  nodes_component.push({
                    label: "无",
                    value: "none",
                    leaf: true,
                    disabled: true
                  })
                }
                resolve(nodes_component)
              },
              function () {

              },
              "no-message"
            );
          }
          if (node.label == "name_list_result") { 
            var nodes_name_list = [];
            JXAjax(
              "post",
              "/sys/waf_get_wids_global_name_list_list",
              {},
              function (response) {
                var _data = response.data.message;
                if (_data.length > 0) { 
                  _data.forEach(item => {
                    nodes_name_list.push({
                      label: item.name_list_name,
                      value: item.name_list_name,
                      leaf: true
                    })
                  });
                } else { 
                  nodes_name_list.push({
                    label: "无",
                    value: "none",
                    leaf: true,
                    disabled: true
                  })
                }
                
                resolve(nodes_name_list)
              },
              function () {

              },
              "no-message"
            );
          }
          if (node.label == "rule_result") { 
            var nodes_rule = [];
            JXAjax(
              "post",
              "/sys/waf_get_sys_global_rule_check_list",
              {},
              function (response) {
                var _data = response.data.message;
                
                if (_data.length > 0) {
                  _data.forEach(item => {
                    nodes_rule.push({
                      label: item.rule_name,
                      value: item.rule_name,
                      leaf: true
                    })
                  });

                } else { 
                  nodes_rule.push({
                    label: "无",
                    value: "none",
                    leaf: true,
                    disabled: true
                  })
                }
                resolve(nodes_rule)
              },
              function () {

              },
              "no-message"
            );
          }
          if (node.label == "relate_rule_result") { 
            var nodes_relate_rule = [];
            var hash = window.location.hash
            var ruleType = "single_rule";
            if (hash.indexOf("/group_rule/") > -1) { 
              ruleType = "group_rule"
            }
            JXAjax(
              "post",
              "/sys/waf_get_sys_global_relate_rule_check_list",
              {rule_type: ruleType},
              function (response) {
                var _data = response.data.message;
                if (_data.length > 0) {
                  _data.forEach(item => {
                    nodes_relate_rule.push({
                      label: item.rule_name,
                      value: item.rule_name,
                      leaf: true
                    })
                  });

                } else { 
                  nodes_relate_rule.push({
                    label: "无",
                    value: "none",
                    leaf: true,
                    disabled: true
                  })
                }
                
                resolve(nodes_relate_rule)
              },
              function () {

              },
              "no-message"
            );
          }

          if (node.label == "analysis_api_result") { 
            var nodes_analysis_api = []; 
            JXAjax(
              "post",
              "/sys/waf_get_sys_global_analysis_api_list",
              {rule_type: ruleType},
              function (response) {
                var _data = response.data.message;
                if (_data.length > 0) {
                  _data.forEach(item => {
                    nodes_analysis_api.push({
                      label: item.api_name,
                      value: item.api_name,
                      leaf: true
                    })
                  });

                } else { 
                  nodes_analysis_api.push({
                    label: "无",
                    value: "none",
                    leaf: true,
                    disabled: true
                  })
                }
                
                resolve(nodes_analysis_api)
              },
              function () {

              },
              "no-message"
            );
          }
        },
      },
      
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

      optionsMatchKeyAction: [
        {
          value: 'action_api',
          label: '处置API',
          
        }, 
        {
          value: 'add_shared_dict_key',
          label: '共享字典写入',
          
        }, 
        {
          value: 'add_name_list_item',
          label: '名单写入',
          
        }, 
        {
          value: 'watch',
          label: '观察',
          leaf:true
        }, 
      ],
      propsMatchKeyAction: {
        expandTrigger: 'hover',
        lazy: true,
        lazyLoad(node, resolve) {
          if (node.value == "add_shared_dict_key") { 
            var nodes = [];
            JXAjax(
              "post",
              "/sys/waf_get_sys_web_shared_dict_list",
              {},
              function (response) {
                var _data = response.data.message;
                
                if (_data.length > 0) {
                  _data.forEach(item => {
                    nodes.push({
                      label: item.shared_dict_name,
                      value: item.shared_dict_name,
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
          if (node.value == "action_api") { 
            var nodes_component = [];
            JXAjax(
              "post",
              "/sys/waf_get_sys_action_api_list",
              {},
              function (response) {
                var _data = response.data.message;
                if (_data.length > 0) {
                  _data.forEach(item => {
                    nodes_component.push({
                      label: item.api_name,
                      value: item.api_name,
                      leaf: true
                    })
                  });
                } else { 
                  nodes_component.push({
                    label: "无",
                    value: "none",
                    leaf: true,
                    disabled: true
                  })
                }
                
                resolve(nodes_component)
              },
              function () {

              },
              "no-message"
            );
          }
          if (node.value == "add_name_list_item") { 
            var nodes_name_list = [];
            JXAjax(
              "post",
              "/sys/waf_get_sys_web_name_list_list",
              {},
              function (response) {
                var _data = response.data.message;
                if (_data.length > 0) {
                  _data.forEach(item => {
                    nodes_name_list.push({
                      label: item.name_list_name,
                      value: item.name_list_name,
                      leaf: true
                    })
                  });
                  
                } else { 
                  nodes_name_list.push({
                    label: "无",
                    value: "none",
                    leaf: true,
                    disabled: true
                  })
                }
                resolve(nodes_name_list)
              },
              function () {

              },
              "no-message"
            );
          }
          
        },
      },
      
      ruleSmallMatchsAction: [{
        rule_match_key_list: [],
        rule_match_key: '',
        showInput: false
      }],
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
    t.ruleType = route.params.ruleType;
    t.type = route.params.type;

    if (t.type == "new") { 
      t.loadingPage = false
    } else {
      t.loadingPage = false
      t.getData();
    }
  },
  methods: {
    getData() {
      var t = this;
      var postUrl = "/sys/waf_get_sys_global_relate_rule_check";
      var oData = { rule_name: t.uuid, rule_type: t.ruleType };
      if (t.ruleType == "group_rule") {
        oData = { rule_name: t.type, rule_type: t.ruleType };
      }
      JXAjax(
        "post",
        postUrl,
        oData,
        function (response) {
          t.loadingPage = false;
          t.webRuleManageForm = response.data.message;

          // 匹配参数开始
          var _rule_matchs = JSON.parse(t.webRuleManageForm.rule_matchs)

          var _ruleBigMatchs = [];


          for (var i in _rule_matchs) {
            var _match = [];
            var _prepocess = [];
            var _default = [
              "ctx",
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
          // 匹配参数结束

          // 执行动作开始
          var _rule_matchs_action = JSON.parse(t.webRuleManageForm.rule_action)
          var _match_action = [];
          var _default_action = [
            "action_api",
            "add_shared_dict_key",
            "add_name_list_item" 
          ]
          
          for (var j_action in _rule_matchs_action) {
            var item_action = _rule_matchs_action[j_action]
            var key_action = item_action.action
            var value_action = item_action.value
            var show_action = "false"
            if (_default_action.indexOf(key_action) > -1) {
              show_action = "true"
            }

            if (key_action == "watch") {
              _match_action.push({
                "rule_match_key_list": [key_action],
                "rule_match_key": key_action,
                "showInput": show_action
              })
            } else { 
              _match_action.push({
                "rule_match_key_list": [key_action, value_action],
                "rule_match_key": key_action + ':' + value_action,
                "showInput": show_action
              })
            }
            
          }
          t.ruleSmallMatchsAction = _match_action;
          console.log(t.ruleSmallMatchsAction)
          // 执行动作结束
         },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },

    onClickWebRuleProSubmit(webRuleManageForm) {
      var t = this;      

      // 匹配参数开始
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
      // 匹配参数结束
      
      // 执行动作开始
      var _match_action = [];
      var _json_action = {
        action_api: "处置API",
        add_shared_dict_key: "共享字典写入",
        add_name_list_item: "名单写入",
        watch: "观察"
      }
      if (t.ruleSmallMatchsAction.length == 0) {
        t.$message({
          message: '请选择执行动作',
          type: "error",
        });
        return false;
      }
      if (t.ruleSmallMatchsAction[0].rule_match_key == "") { 
        t.$message({
          message: '请选择执行动作',
          type: "error",
        });
        return false;
      }

      for (var j_action in t.ruleSmallMatchsAction) {
        var item_action = t.ruleSmallMatchsAction[j_action]
        var _str_action = "";
        var _arr_action = [];
        var _key_action = "";
        var _value_action = "";
      
        if (item_action.rule_match_key_list && item_action.rule_match_key_list.length > 0) {
          _arr_action = item_action.rule_match_key_list;
        }
        if (_arr_action.length > 0) {
          _key_action = _arr_action[0];

          if (_arr_action.length > 1) {
            _value_action = _arr_action[1];
          } else { 
            _value_action = "";
          }
          
          _str_action = '{"action":"' + _key_action + '" , "value":"' + _value_action + '"}'
        }

        _match_action.push(JSON.parse(_str_action))
      }
      // 执行动作结束
      

      var postUrl = "/sys/waf_edit_sys_global_relate_rule_check";
      if (t.type == 'new') {
        postUrl = "/sys/waf_create_sys_global_relate_rule_check";
        if (t.ruleType == "group_rule") { 
          t.webRuleManageForm.rule_group_name = t.uuid;
        }
      } else {
        t.webRuleManageForm.rule_name = t.uuid;
        if (t.ruleType == "group_rule") {
          t.webRuleManageForm.rule_name = t.type;
        }
      }

      t.webRuleManageForm.rule_type = t.ruleType;
      t.webRuleManageForm.rule_matchs = JSON.stringify(_temp_matchs);
      
      t.webRuleManageForm.rule_action = JSON.stringify(_match_action);
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
                window.location.href = '/#/global-group-rule/' + t.uuid + '/sys-global-relate-rule-check';
              } else {
                window.location.href = '/#/sys-global-relate-rule-check/' + t.ruleType;
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

    removeRuleMatchsAction(item) {
      var index = this.ruleSmallMatchsAction.indexOf(item);
      if (index !== -1) {
        this.ruleSmallMatchsAction.splice(index, 1);
      }
    },
    
    addRuleMatchsAction(){
      this.ruleSmallMatchsAction.push({rule_match_key: '', showInput: false})
    },

    onChangeRuleMatchsAction(event, item, bigIndex) {
      if (event && event.length > 0) { 
        var index = this.ruleSmallMatchsAction.indexOf(item);
        if (event[1] == 'default') {
          this.ruleSmallMatchsAction[index].showInput = true;
          this.ruleSmallMatchsAction[index].rule_match_key = event[0] + ':';
        } else {
          this.ruleSmallMatchsAction[index].rule_match_key = event[0] + ':' + event[1];
        }
      }
    },
    onChangeRuleInputAction(event, item, bigIndex) {
      var index = this.ruleSmallMatchsAction.indexOf(item);
      if(event == '') {
        this.ruleSmallMatchsAction[index].showInput = false;
        this.ruleSmallMatchsAction[index].rule_match_key = "";
        this.ruleSmallMatchsAction[index].rule_match_key_list = [];
      } else {
        this.ruleSmallMatchsAction[index].rule_match_key = event;
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
</style>
