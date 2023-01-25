<template>
  <div class="protection-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>防护配置</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">
            <a class="el-button el-button--primary is-plain" href="/#/group/">返回</a>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="margin-4x"></div>
    <!-- <hr> -->
    <el-row v-loading.fullscreen.lock="loadingPage">
      <el-col>
        <!-- <el-card class="box-card"> -->

        <div>
          <el-collapse v-model="activeNames">
            <el-collapse-item title="基础安全防护" name="1">
              <div class="protection-block">
                <div class="protection-item-right">
                  <div class="protection-item-label">Web防护引擎</div>
                  <el-switch @change="onChangeProtect($event)" v-model="protectionData.web_engine_protection"
                    active-text="开启" inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
                </div>
                <a :href="'/#/web-engine-protection/' + groupId + '/' + ruleType" target="_self" class="el-button--text"
                  style="float: right">配置</a>
              </div>
              <div class="protection-block">
                <div class="protection-item-right">
                  <div class="protection-item-label">Web防护规则</div>
                  <el-switch @change="onChangeProtect($event)" v-model="protectionData.web_rule_protection"
                    active-text="开启" inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
                </div>
                <a :href="'/#/web-rule-protection/' + groupId + '/' + ruleType" target="_self" class="el-button--text"
                  style="float: right">配置</a>
              </div>
              <div class="protection-block">
                <div class="protection-item-right">
                  <div class="protection-item-label">Web白名单规则</div>
                  <el-switch @change="onChangeProtect($event)" v-model="protectionData.web_white_rule" active-text="开启"
                    inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
                </div>
                <a :href="'/#/web-white-rule/' + groupId + '/' + ruleType" target="_self" class="el-button--text"
                  style="float: right">配置</a>
              </div>

              <!-- <div class="protection-block">
                <div class="protection-item-right">
                  <div class="protection-item-label">Web攻击拦截页面</div>
                  <el-switch @change="onChangeProtect($event)" v-model="protectionData.web_deny_page" active-text="开启"
                    inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
                </div>
                <a :href="'/#/web-deny-page/' + groupId + '/' + ruleType" target="_self" class="el-button--text"
                  style="float: right">配置</a>
              </div> -->
            </el-collapse-item>
            <el-collapse-item title="流量安全防护" name="2">
              <div class="protection-block">
                <div class="protection-item-right">
                  <div class="protection-item-label">流量防护引擎</div>
                  <el-switch @change="onChangeProtect($event)" v-model="protectionData.flow_engine_protection"
                    active-text="开启" inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
                </div>
                <a :href="'/#/flow-engine-protection/' + groupId + '/' + ruleType" target="_self"
                  class="el-button--text" style="float: right">配置</a>
              </div>
              <div class="protection-block">
                <div class="protection-item-right">
                  <div class="protection-item-label">流量防护规则</div>
                  <el-switch @change="onChangeProtect($event)" v-model="protectionData.flow_rule_protection"
                    active-text="开启" inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
                </div>
                <a :href="'/#/flow-rule-protection/' + groupId + '/' + ruleType" target="_self" class="el-button--text"
                  style="float: right">配置</a>
              </div>
              <div class="protection-block">
                <div class="protection-item-right">
                  <div class="protection-item-label">流量白名单规则</div>
                  <el-switch @change="onChangeProtect($event)" v-model="protectionData.flow_white_rule" active-text="开启"
                    inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
                </div>
                <a :href="'/#/flow-white-protection/' + groupId + '/' + ruleType" target="_self" class="el-button--text"
                  style="float: right">配置</a>
              </div>
              <!-- <div class="protection-block">
                <div class="protection-item-right">
                  <div class="protection-item-label">流量攻击拦截页面</div>
                  <el-switch @change="onChangeProtect($event)" v-model="protectionData.flow_deny_page" active-text="开启"
                    inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
                </div>
                <a :href="'/#/flow-deny-page/' + groupId + '/' + ruleType" target="_self" class="el-button--text"
                  style="float: right">配置</a>
              </div> -->
            </el-collapse-item>
            <el-collapse-item title="名单防护" name="3">
              <div class="protection-block">
                <el-switch @change="onChangeProtect($event)" v-model="protectionData.name_list" active-text="开启"
                  inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
                <a :href="'/#/name-list/' + groupId + '/' + ruleType" target="_self" class="el-button--text"
                  style="float: right">配置</a>
              </div>
            </el-collapse-item>
            <el-collapse-item title="组件防护" name="4">
              <div class="protection-block">
                <el-switch @change="onChangeProtect($event)" v-model="protectionData.web_deny_page" active-text="开启"
                  inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
                <a :href="'/#/component-protection/' + groupId + '/' + ruleType" target="_self" class="el-button--text"
                  style="float: right">配置</a>
              </div>
            </el-collapse-item>

          </el-collapse>
        </div>
        <!-- </el-card> -->
      </el-col>
    </el-row>
    <div class="margin-4x"></div>
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <a class="el-button el-button--primary is-plain" href="/#/group">返回</a>
          </el-col>
          <el-col :span="12" class="text-align-right">
            <el-button type="primary" @click="onChangeProtect()" :loading="loading">保存</el-button>
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
      ruleType: 'group_rule',
      groupId: '',
      loading: false,
      loadingPage: false,
      activeNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      protectionData: {},
      firstFlag: false,
    };
  },
  mounted() {
    const route = useRoute()
    // this.ruleType = route.params.ruleType;
    //this.domain = route.params.domain;
    this.groupId = route.params.groupId;
    this.getData();
  },

  methods: {
    getData() {
      var t = this;
      JXAjax(
        "post",
        "/waf/waf_get_group_protection",
        { group_id: t.groupId },
        function (response) {
          t.loadingPage = false;
          t.protectionData = response.data.message;
          t.protectionData.group_id = t.groupId;
        },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },
    onChangeProtect(event) {
      var t = this;
      if (t.protectionData.group_id) {
        JXAjax(
          "post",
          "/waf/waf_edit_group_protection",
          t.protectionData,
          function (response) {
            t.getData();
          },
          function () {
            t.getData();
          }
        );
      }    
    },
  },
};
</script>
<style>






.protection-block {
  display: flex;
  margin: 10px 10px 10px 10px;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.protection-wrap {
  max-width: 800px;
  min-width: 400px;
}
.protection-attack {
  padding-top: 20px;
}
.protection-attack .el-form-item__label {
  text-align: left;
  width: 150px;
}
.protection-attack .el-input {
  width: 200px;
}
.protection-wrap .el-collapse-item__header{
      font-size: 16px;
        font-weight: 600;
}
.protection-item-right { 
  display: flex;
}
.protection-item-label{
  width: 200px;
  line-height: 20px;
  text-align: left;
  padding: 0 12px 0 0;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 14px;
}
</style>
