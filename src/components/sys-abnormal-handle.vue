<template>
  <div class="sys-abnormal-handle-wrap">
    <el-row v-loading.fullscreen.lock="loadingPage">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>WAF异常处置配置</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">

          </el-col>
        </el-row>
        <div class="margin-4x"></div>
        <el-row>
          <el-col :span="24">
            <el-form :model="abnormalForm" :rules="rules" ref="abnormalForm" label-width="250px" label-position="left">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="WAF绕过对抗" name="1">
                  <el-form-item label="绕过对抗" key="1">
                    <el-switch v-model="abnormalForm.bypass_check"
                      active-text="开启" inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
                  </el-form-item>
                  <div v-if="abnormalForm.bypass_check == 'true'">
                    <el-form-item label="请求存在多个同名参数绕过" key="2">
                      <el-switch v-model="abnormalForm.same_name_args_check" active-text="开启" inactive-text="关闭"
                        active-value="true" inactive-value="false"></el-switch>
                      <p class="form-info-color">
                        说明：当请求中存在多个同名参数时，WAF默认会取第一个参数名的值，这种情况是常见的WAF绕过手法，开启防护可以阻断这种异常请求
                      </p>
                    </el-form-item>
                    <el-form-item label="参数数量超过默认设置值" key="3">
                      <el-switch v-model="abnormalForm.truncated_agrs_check" active-text="开启" inactive-text="关闭"
                        active-value="true" inactive-value="false"></el-switch>
                      <p class="form-info-color">
                        说明：默认情况下，WAF会解析200个参数，当超过默认值，后续参数将不会解析，开启防护可以阻断这种异常请求
                      </p>
                    </el-form-item>
                    <el-form-item label="请求body超过最大设置值" key="4">
                      <el-switch v-model="abnormalForm.client_body_size_check" active-text="开启" inactive-text="关闭"
                        active-value="true" inactive-value="false"></el-switch>
                      <p class="form-info-color">
                        说明：获取body的最大值为100m,超过将导致waf无法获取body进行检测，开启可以阻断这种异常请求
                      </p>
                    </el-form-item>
                  </div>
                  
                </el-collapse-item>
                <el-collapse-item title="SSL连接数耗尽" name="2">
                  <el-form-item label="SSL防护" key="5">
                    <el-switch @change="onClickDownloadRule($event)" v-model="abnormalForm.ssl_attack_check"
                      active-text="开启" inactive-text="关闭" active-value="true" inactive-value="false"></el-switch>
                  </el-form-item>
                  <div v-if="abnormalForm.ssl_attack_check == 'true'">
                    <el-form-item label="异常连接数量统计" key="6" prop="ssl_attack_count">
                      <el-input v-model="abnormalForm.ssl_attack_count" placeholder="请输入大于0的数字"></el-input>
                    </el-form-item>
                    <el-form-item label="统计时间（秒）" key="7" prop="ssl_attack_count_stat_time_period">
                      <el-input v-model="abnormalForm.ssl_attack_count_stat_time_period" placeholder="请输入大于0的数字">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="写入名单" key="8" prop="ssl_attack_block_name_list_uuid">
                      <el-select v-model="abnormalForm.ssl_attack_block_name_list_uuid" placeholder="请选择或输入模糊搜索"
                        filterable>
                        <el-option v-for="item in ruleOptions" :key="item.ssl_attack_block_name_list_uuid"
                          :label="item.name_list_name" :value="item.ssl_attack_block_name_list_uuid">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>

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
                    <el-button type="primary" @click="onClickAbnormalSubmit('abnormalForm')" :loading="loading">保存
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
import { mixin, JXAjax, validatePositiveInt } from "../assets/scripts/common";
export default {
  mixins: [mixin],
  data() {
    return {
      loading:false,
      loadingPage: false,
      activeNames: ["1", "2"],
      abnormalForm: {},
      ruleOptions: [],
    };
  },
  computed: {
    rules() {
      return {
        ssl_attack_count_stat_time_period: [
          { required: true, message: '请输入大于0的数字', trigger: ["blur", "change"], },
          { validator: validatePositiveInt, trigger: ["blur", "change"], },
        ],
        ssl_attack_count: [
          { required: true, message: '请输入大于0的数字', trigger: ["blur", "change"], },
          { validator: validatePositiveInt, trigger: ["blur", "change"], },
        ],
        
        ssl_attack_block_name_list_uuid: [
          {
            required: true,
            message: '请选择一个规则',
            trigger: 'change',
          },
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
        "/waf/waf_get_sys_abnormal_handle",
        {},
        function (response) {
          t.loadingPage = false;
          t.abnormalForm = response.data.message;
          if (t.abnormalForm.ssl_attack_block_name_list_uuid == "false") { 
            t.abnormalForm.ssl_attack_block_name_list_uuid = "";
          }
          if (t.abnormalForm.ssl_attack_check == "true") { 
            t.onClickDownloadRule();
          }
        },
        function () {
          t.loadingPage = false;
        }
      );
    },
    onClickDownloadRule() {
      var t = this;
      if (t.abnormalForm.ssl_attack_check == "true") { 
        JXAjax(
          "post",
          "/waf/waf_get_sys_name_list_list",
          {},
          function (response) {
            var _ruleOptions = response.data.message;
            _ruleOptions.forEach(item => {
              item.ssl_attack_block_name_list_uuid = item.name_list_uuid;
            });
            t.ruleOptions = _ruleOptions;
            
          },
          function () {
          },
          "no-message"
        );
      }
    },

    onClickAbnormalSubmit(abnormalForm) {
      var t = this;
      t.loading = true;
      var postUrl = "/waf/waf_edit_sys_abnormal_handle";
      this.$refs[abnormalForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.abnormalForm,
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
