<template>
  <div class="flow-engine-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>流量防护引擎配置</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">
            <a class="el-button el-button--primary is-plain" v-if="ruleType == 'single_rule'"
              :href="'/#/protection/' + domain + '/' + ruleType">返回</a>
            <a class="el-button el-button--primary is-plain" v-if="ruleType == 'group_rule'"
              :href="'/#/group-protection/' + domain ">返回</a>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="margin-4x"></div>
    <el-row v-loading.fullscreen.lock="loadingPage">
      <el-col :span="24">
        <el-form :model="flowEngineForm" :rules="rules" ref="flowEngineForm" label-width="200px">
          <el-divider class="first-divider" />
          <div class="protection-block">
            <div class="protection-item-right">
              <div class="protection-item-label">高频CC攻击防护</div>
              <el-switch @change="onChangeProtection($event)" v-model="flowEngineForm.high_freq_cc_check"
                active-text="开启" inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
            </div>

            <div class="flow-engine-form" v-if="flowEngineForm.high_freq_cc_check == 'true'">
              <el-card class="box-card">
                <template #header>
                  <span>IP请求频率检测</span>
                </template>
                <div>
                  <el-form-item label="请求频率限制" prop="req_rate">
                    <el-input v-model="flowEngineForm.req_rate" placeholder="请输入"></el-input>
                  </el-form-item>

                  <el-form-item label="执行动作">
                    <el-select v-model="flowEngineForm.req_rate_block_mode" placeholder="请选择">
                      <el-option v-for="item in ruleAction" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="flowEngineForm.req_rate_block_mode == 'bot_check'">
                    <el-select v-model="flowEngineForm.req_rate_block_mode_extra_parameter" placeholder="请选择">
                      <el-option v-for="item in optionsBotCheck" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <p class="form-info-color">
                      说明：标准模式无需人机交互
                    </p>
                  </el-form-item>

                </div>
              </el-card>
              <div class="margin-4x"></div>
              <el-card class="box-card">
                <template #header>
                  <span>IP请求次数检测</span>
                </template>
                <div>
                  <el-form-item label="请求次数限制" prop="req_rate">
                    <el-input v-model="flowEngineForm.req_count" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="统计时间（秒）" prop="req_count_stat_time_period">
                    <el-input v-model="flowEngineForm.req_count_stat_time_period" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="执行动作">
                    <el-select v-model="flowEngineForm.req_count_block_mode" placeholder="请选择">
                      <el-option v-for="item in ruleAction" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="flowEngineForm.req_count_block_mode == 'bot_check'">
                    <el-select v-model="flowEngineForm.req_count_block_mode_extra_parameter" placeholder="请选择">
                      <el-option v-for="item in optionsBotCheck" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <p class="form-info-color">
                      说明：标准模式无需人机交互
                    </p>
                  </el-form-item>
                </div>
              </el-card>
              <!-- <div class="flow-engine-btn">
                <el-button type="primary" @click="onClickFlowEngineSubmit('flowEngineForm')" :loading="loading">保存
                </el-button>
              </div> -->
            </div>
          </div>
          <el-divider />

          <div class="protection-block">
            <div class="protection-item-right">
              <div class="protection-item-label">慢速CC攻击防护</div>
              <el-switch @change="onChangeProtection($event)" v-model="flowEngineForm.slow_cc_check" active-text="开启"
                inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
            </div>
            <div class="flow-engine-form" v-if="flowEngineForm.slow_cc_check == 'true'">
              <el-card class="box-card">
                <template #header>
                  <span>请求IP数量检测</span>
                </template>
                <div>
                  <el-form-item label="请求IP数量限制" prop="ip_count">
                    <el-input v-model="flowEngineForm.ip_count" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="统计时间（秒）" prop="ip_count_stat_time_period">
                    <el-input v-model="flowEngineForm.ip_count_stat_time_period" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="执行动作">
                    <el-select v-model="flowEngineForm.ip_count_block_mode" placeholder="请选择">
                      <el-option v-for="item in ruleAction" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="flowEngineForm.ip_count_block_mode == 'bot_check'">
                    <el-select v-model="flowEngineForm.ip_count_block_mode_extra_parameter" placeholder="请选择">
                      <el-option v-for="item in optionsBotCheck" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <p class="form-info-color">
                      说明：标准模式无需人机交互
                    </p>
                  </el-form-item>
                </div>
              </el-card>
              <div class="margin-4x"></div>
              <el-card class="box-card">
                <template #header>
                  <span>回源保护机制</span>
                </template>
                <div>
                  <el-form-item label="网站请求频率限制" prop="domain_rate">
                    <el-input v-model="flowEngineForm.domain_rate" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="执行动作">
                    <el-select v-model="flowEngineForm.slow_cc_block_mode" placeholder="请选择">
                      <el-option v-for="item in ruleAction" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="flowEngineForm.slow_cc_block_mode == 'bot_check'">
                    <el-select v-model="flowEngineForm.slow_cc_block_mode_extra_parameter" placeholder="请选择">
                      <el-option v-for="item in optionsBotCheck" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <p class="form-info-color">
                      说明：标准模式无需人机交互
                    </p>
                  </el-form-item>
                </div>
              </el-card>
              <!-- <div class="flow-engine-btn">
                <el-button type="primary" @click="onClickFlowEngineSubmit('flowEngineForm')" :loading="loading">保存
                </el-button>
              </div> -->
            </div>
          </div>
          <el-divider />
          <div class="protection-block">
            <div class="protection-item-right">
              <div class="protection-item-label">无差别紧急防护</div>
              <el-switch @change="onChangeProtection($event)" v-model="flowEngineForm.emergency_mode_check"
                active-text="开启" inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
            </div>
            <div class="flow-engine-form" v-if="flowEngineForm.emergency_mode_check == 'true'">
              <el-card class="box-card">
                <template #header>
                  <span>请求IP数量检测</span>
                </template>
                <div>
                  <el-form-item label="执行动作">
                    <el-select v-model="flowEngineForm.emergency_mode_block_mode" placeholder="请选择">
                      <el-option v-for="item in ruleAction" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="flowEngineForm.emergency_mode_block_mode == 'bot_check'">
                    <el-select v-model="flowEngineForm.emergency_mode_block_mode_extra_parameter" placeholder="请选择">
                      <el-option v-for="item in optionsBotCheck" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <p class="form-info-color">
                      说明：标准模式无需人机交互
                    </p>
                  </el-form-item>
                </div>
              </el-card>

            </div>

          </div>
          <div class="flow-engine-btn">
            <el-button type="primary" @click="onClickFlowEngineSubmit('flowEngineForm')" :loading="loading">保存
            </el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mixin, JXAjax, validatePositiveInt } from "../assets/scripts/common";
import { useRoute } from 'vue-router'
export default {
  mixins: [mixin],
  data() {
    return {
      loading: false,
      loadingPage: false,
      domain: "",
      ruleType: "",
      flowEngineForm: {
      },
      ruleAction: [
        { value: "block", label: "阻断请求" },
        { value: "reject_response", label: "拒绝响应" },
        { value: "bot_check", label: "人机识别" },
        { value: "watch", label: "观察模式" },
        
      ],
      optionsBotCheck: [
        { value: "standard", label: "标准" },
        { value: "slipper", label: "滑块" },
        { value: "image", label: "图片验证码" },
      ]
    };
  },
  computed: {
    rules() {
      return {
        eq_rate: [
          {required: true,message: '请输入',trigger: ["blur", "change"],},
          {validator: validatePositiveInt,trigger: ["blur", "change"],},
        ],
        req_count: [
          { required: true, message: '请输入', trigger: ["blur", "change"], },
          { validator: validatePositiveInt, trigger: ["blur", "change"], },
        ],
        req_count_stat_time_period: [
          { required: true, message: '请输入', trigger: ["blur", "change"], },
          { validator: validatePositiveInt, trigger: ["blur", "change"], },
        ],
        ip_count: [
          { required: true, message: '请输入', trigger: ["blur", "change"], },
          { validator: validatePositiveInt, trigger: ["blur", "change"], },
        ],
        ip_count_stat_time_period: [
          { required: true, message: '请输入', trigger: ["blur", "change"], },
          { validator: validatePositiveInt, trigger: ["blur", "change"], },
        ],
        domain_rate: [
          { required: true, message: '请输入', trigger: ["blur", "change"], },
          { validator: validatePositiveInt, trigger: ["blur", "change"], },
        ],

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
      var getUrl = "/waf/waf_get_flow_engine_protection";
      var oData = { domain: t.domain };
      if (t.ruleType == "group_rule") {
        getUrl = "/waf/waf_get_group_flow_engine_protection";
        oData = { group_id: t.domain }
      }
      JXAjax(
        "post",
        getUrl,
        oData,
        function (response) {
          t.loadingPage = false;
          t.flowEngineForm = response.data.message;
          t.flowEngineForm.domain = t.domain;
        },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },
    onChangeProtection(event) { 
      
    },
    onClickFlowEngineSubmit(flowEngineForm) { 
      var t = this;
      var postUrl = "/waf/waf_edit_flow_engine_protection";
      if (t.ruleType == "group_rule") {
        postUrl = "/waf/waf_edit_group_flow_engine_protection";
        this.flowEngineForm.group_id = t.domain;
      } else {
        this.flowEngineForm.domain = t.domain;
      }
      
      this.$refs[flowEngineForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.flowEngineForm,
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



.el-button.button-block {
  display: block;
  margin-left: 0px;
  text-align: right;
  width: 100%;
}
.flow-engine-wrap .protection-block {
  display: block;
  margin: 10px 10px 10px 10px;
  font-size: 14px;
}
.protection-item-right {
  display: flex;
}
.protection-item-label {
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

.flow-engine-wrap {
  max-width: 800px;
  min-width: 400px;
}
.flow-engine-wrap .first-divider{
  margin-top: 0px;
}
.flow-engine-form {
  margin: 25px 0;
}
.flow-engine-btn {
  text-align: right;
  padding: 25px 20px;
}
</style>
