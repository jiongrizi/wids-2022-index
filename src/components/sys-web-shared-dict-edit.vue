<template>
  <div class="custom-edit-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>请求共享字典配置</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">
            <a class="el-button el-button--primary is-plain" :href="'/#/sys-web-shared-dict/'">返回</a>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="margin-4x"></div>
    <el-row v-loading.fullscreen.lock="loadingPage">
      <el-col :span="24">
        <el-form class="custom-edit-form name-and-dict" :model="sysSharedDictForm" :rules="rules"
          ref="sysSharedDictForm" label-width="180px">
          <el-card class="box-card">
            <div>
              <el-form-item label="共享字典名称" prop="shared_dict_name">
                <el-input v-if="uuid == 'new'" v-model="sysSharedDictForm.shared_dict_name"
                  placeholder="请输入字母开头，字母或数字组合，仅支持_-两种符号"> </el-input>
                <el-input v-else v-model="sysSharedDictForm.shared_dict_name" disabled> </el-input>
              </el-form-item>
              <el-form-item label="共享字典详情">
                <el-input v-model="sysSharedDictForm.shared_dict_detail"> </el-input>
              </el-form-item>
              <el-form-item label="字典键参数">
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

              <el-form-item label="字典值类型" prop="shared_dict_type">
                <el-radio-group v-model="sysSharedDictForm.shared_dict_type">
                  <el-radio label="number">数字</el-radio>
                  <el-radio label="string">字符串</el-radio>
                  <el-radio label="custom_string">自定义字符串</el-radio>
                </el-radio-group>
                <p class="form-info-color" v-show="sysSharedDictForm.shared_dict_type=='number'">
                   数字初使值固定为0，每次写入增加1
                </p>
                <p class="form-info-color" v-show="sysSharedDictForm.shared_dict_type=='string'">
                   字符串初使值为字符串 true
                </p>
              </el-form-item>
              <el-form-item label="字典值参数" prop="shared_dict_value" v-show="sysSharedDictForm.shared_dict_type =='custom_string'">
                <div class="match-box" v-for="(item, index) in dictValueMatchs" :key="index">
                  <div class="match-box-content">
                    <div class="match_key_cascader">
                      <el-cascader separator=":" v-model="item.rule_match_key_list" :options="optionsMatchKey" :props="propsMatchKey"
                        @change="onChangeDictMatchs($event, item, bigIndex)" clearable>
                      </el-cascader>
                    </div>
                    <div v-show="item.showInput" class="match_key_input">
                      <el-input v-model="item.rule_match_key" clearable @change="onChangeDictInput($event, item, bigIndex)"></el-input>
                    </div>
                  </div>
                
                  <el-button @click.prevent="removeDictMatchs(item, bigIndex)">删除</el-button>
                </div>
                <el-button @click="addDictMatchs(bigIndex)" plain type="primary" class="button-new">新增</el-button>
              </el-form-item>
              <el-form-item label="过期时间（秒）" prop="shared_dict_expire_time">
                <el-input v-model="sysSharedDictForm.shared_dict_expire_time" placeholder="请输入大于等于0的数字，0代表无限制">
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
                <a class="el-button el-button--primary is-plain" :href="'/#/sys-web-shared-dict/'">返回</a>
              </el-col>
              <el-col :span="12" class="text-align-right">
                <el-button type="primary" @click="onClicksysSharedDictSubmit('sysSharedDictForm')" :loading="loading">保存
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
      uuid: 'new',
      sysSharedDictForm: {
        shared_dict_detail: "",
        shared_dict_type: "number",
        shared_dict_value: "0",
      },
      optionsMatchKey: [
        {
          value: 'waf_log',
          label: 'waf_log',
          children: [
            { value: 'cookie', label: 'cookie', leaf: true },
            { value: 'post_data', label: 'post_data', leaf: true },
            { value: 'query_string', label: 'query_string', leaf: true },
            { value: 'host', label: 'host', leaf: true },
            { value: 'uri', label: 'uri', leaf: true },
            { value: 'src_ip', label: 'src_ip', leaf: true },
            { value: 'req_raw_data', label: 'req_raw_data', leaf: true },
            { value: 'res_raw_data', label: 'res_raw_data', leaf: true },
            { value: 'waf_description', label: 'waf_description', leaf: true },
            { value: 'content_length', label: 'content_length', leaf: true },
            { value: 'ret_code', label: 'ret_code', leaf: true },
            { value: 'ssl_ciphers', label: 'ssl_ciphers', leaf: true },
            { value: 'ssl_protocol', label: 'ssl_protocol', leaf: true },
            { value: 'request_time', label: 'request_time', leaf: true },
            { value: 'user_agent', label: 'user_agent', leaf: true },
            { value: 'waf_action', label: 'waf_action', leaf: true },
            { value: 'waf_app', label: 'waf_app', leaf: true },
            { value: 'x5_action', label: 'x5_action', leaf: true },
            { value: 'x5_policy_id', label: 'x5_policy_id', leaf: true },
            { value: 'x5_test', label: 'x5_test', leaf: true },
            { value: 'x_forward_for', label: 'x_forward_for', leaf: true },
            { value: 'waf_service', label: 'waf_service', leaf: true },
            { value: 'set_cookie', label: 'set_cookie', leaf: true },
            { value: 'rqs_content_type', label: 'rqs_content_type', leaf: true },
            { value: 'rsp_content_type', label: 'rsp_content_type', leaf: true },
            { value: 'request_datetime', label: 'request_datetime', leaf: true },
            { value: 'region', label: 'region', leaf: true },
            { value: 'referer', label: 'referer', leaf: true },
            { value: 'method', label: 'method', leaf: true },
            { value: 'jump_location', label: 'jump_location', leaf: true },
            { value: 'https', label: 'https', leaf: true },
            { value: 'eagleeye_traceid', label: 'eagleeye_traceid', leaf: true },
            { value: 'dst_ip', label: 'dst_ip', leaf: true },

          ]
        },
        {
          value: 'query_string',
          label: 'query_string',
          children: [
            { value: 'default', label: '自定义', leaf: true }
          ]
        },
        {
          value: 'json_post',
          label: 'json_post',
          children: [
            { value: 'default', label: '自定义', leaf: true }
          ]
        },
        {
          value: 'post',
          label: 'post',
          children: [
            { value: 'default', label: '自定义', leaf: true }
          ]
        },
        {
          value: 'cookie',
          label: 'cookie',
          children: [
            { value: 'default', label: '自定义', leaf: true }
          ]
        },
        {
          value: 'waf_description',
          label: 'waf_description',
          children: [
            { value: 'default', label: '自定义', leaf: true }
          ]
        },
        {
          value: 'ctx',
          label: 'ctx',
          children: [
            { value: 'default', label: '自定义', leaf: true }
          ]
        },
        {
          value: 'string',
          label: 'string',
          children: [
            { value: 'default', label: '自定义', leaf: true }
          ]
        },
      ],
      propsMatchKey: { expandTrigger: 'hover' },
      
      ruleSmallMatchs: [{
        rule_match_key_list: [],
        rule_match_key: '',
        showInput: false
      }],
      dictValueMatchs: [{
        rule_match_key_list: [],
        rule_match_key: '',
        showInput: false
      }],
    };
  },
  computed: {
    rules() {
      return {
        shared_dict_name: [
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

        // shared_dict_value: [
        //   {
        //     required: true,
        //     message: '请输入匹配内容',
        //     trigger: ["blur", "change"],
        //   },
        // ],
        shared_dict_expire_time: [
          {
            required: true,
            message: '请输入匹配内容',
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
      t.loadingPage = false
    } else {
      t.loadingPage = false
      t.getData();
    }
  },
  methods: {
    getData() {
      var t = this;
      var postUrl = "/sys/waf_get_sys_web_shared_dict";
      var oData = { shared_dict_name: t.uuid };
      
      JXAjax(
        "post",
        postUrl,
        oData,
        function (response) {
          t.loadingPage = false;
          t.sysSharedDictForm = response.data.message;
          var _rule_matchs = JSON.parse(t.sysSharedDictForm.shared_dict_key)
          var _match = [];
          var _default = [
              "ctx",
              "waf_description",
              "cookie",
              "post",
              "json_post",
              "query_string",
          ]

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


          if (t.sysSharedDictForm.shared_dict_type == "custom_string") { 
            var _rule_matchs_dict = JSON.parse(t.sysSharedDictForm.shared_dict_value)
            var _match_dict = [];
            var _default_dict = [
              "ctx",
              "waf_description",
              "cookie",
              "post",
              "json_post",
              "query_string",
            ]

            for (var j_dict in _rule_matchs_dict) {
              var item_dict = _rule_matchs_dict[j_dict]
              var key_dict = item_dict.key
              var value_dict = item_dict.value
              var show_dict = "false"
              if (_default.indexOf(key_dict) > -1) {
                show_dict = "true"
              }

              _match_dict.push({
                "rule_match_key_list": [key_dict, value_dict],
                "rule_match_key": key_dict + ':' + value_dict,
                "showInput": show_dict
              })
            }
            t.dictValueMatchs = _match_dict;
          }
          
         },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },
    onChangeType() { 
      var t = this;
      if (t.sysSharedDictForm.shared_dict_type == "number") {
        t.sysSharedDictForm.shared_dict_value = "0";
      } else { 
        t.sysSharedDictForm.shared_dict_value = "true";
      }
    },
    onClicksysSharedDictSubmit(sysSharedDictForm) {
      var t = this;
      var _match = [];
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


      if (t.sysSharedDictForm.shared_dict_type == "custom_string") {
        var _match_dict = [];
        if (t.dictValueMatchs.length == 0) {
          t.$message({
            message: '请选择匹配参数',
            type: "error",
          });
          return false;
        }
        if (t.dictValueMatchs[0].rule_match_key == "") {
          t.$message({
            message: '请选择匹配参数',
            type: "error",
          });
          return false;
        }
        for (var j_dict in t.dictValueMatchs) {
          var item_dict = t.dictValueMatchs[j_dict]
          var _str_dict = "";
          var _arr_dict = [];
          var _key_dict = "";
          var _value_dict = "";

          if (item_dict.rule_match_key) {
            _arr_dict = item_dict.rule_match_key.split(":");
          }
          if (_arr_dict.length > 0) {
            _key_dict = _arr_dict[0];
            _value_dict = item_dict.rule_match_key.replace(new RegExp(_key_dict + ":"), "");
            _str_dict = '{"key":"' + _key_dict + '" , "value":"' + _value_dict + '"}'
          }

          _match_dict.push(JSON.parse(_str_dict))
        }
        t.sysSharedDictForm.shared_dict_value = JSON.stringify(_match_dict);
      } else { 
        t.sysSharedDictForm.shared_dict_value = "";
      }

      var postUrl = "/sys/waf_edit_sys_web_shared_dict";
      if (t.uuid == 'new') {
        postUrl = "/sys/waf_create_sys_web_shared_dict";
      } else {
        t.sysSharedDictForm.shared_dict_name = t.uuid;
      }
      t.sysSharedDictForm.shared_dict_key = JSON.stringify(_match);
      this.$refs[sysSharedDictForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.sysSharedDictForm,
            function (response) {
              t.loading = false;
              window.location.href = '/#/sys-web-shared-dict/'

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
      if (index != -1) {
        this.ruleSmallMatchs.splice(index, 1);
      }
    },

    addRuleMatchs() {
      this.ruleSmallMatchs.push({ rule_match_key: '', showInput: false })
    },

    onChangeRuleMatchs(event, item, bigIndex) {
      var index = this.ruleSmallMatchs.indexOf(item);
      if (event[1] == 'default') {
        this.ruleSmallMatchs[index].showInput = true;
        this.ruleSmallMatchs[index].rule_match_key = event[0] + ':';
      } else {
        this.ruleSmallMatchs[index].rule_match_key = event[0] + ':' + event[1];
      }
    },
    onChangeRuleInput(event, item, bigIndex) {
      var index = this.ruleSmallMatchs.indexOf(item);
      if (event == '') {
        this.ruleSmallMatchs[index].showInput = false;
        this.ruleSmallMatchs[index].rule_match_key = "";
        this.ruleSmallMatchs[index].rule_match_key_list = [];
      } else {
        this.ruleSmallMatchs[index].rule_match_key = event;
      }
    },

    removeDictMatchs(item) {
      var index = this.dictValueMatchs.indexOf(item);
      if (index != -1) {
        this.dictValueMatchs.splice(index, 1);
      }
    },

    addDictMatchs() {
      this.dictValueMatchs.push({ rule_match_key: '', showInput: false })
    },

    onChangeDictMatchs(event, item, bigIndex) {
      var index = this.dictValueMatchs.indexOf(item);
      if (event[1] == 'default') {
        this.dictValueMatchs[index].showInput = true;
        this.dictValueMatchs[index].rule_match_key = event[0] + ':';
      } else {
        this.dictValueMatchs[index].rule_match_key = event[0] + ':' + event[1];
      }
    },
    onChangeDictInput(event, item, bigIndex) {
      var index = this.dictValueMatchs.indexOf(item);
      if (event == '') {
        this.dictValueMatchs[index].showInput = false;
        this.dictValueMatchs[index].rule_match_key = "";
        this.dictValueMatchs[index].rule_match_key_list = [];
      } else {
        this.dictValueMatchs[index].rule_match_key = event;
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
  margin-right: 10px;
  display: inline-block;
  margin-bottom: 10px;
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
