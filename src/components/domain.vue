<template>
  <el-row>
    <el-col :span="24">
      <el-row class="text-align-right">
        <div class="domain-search-input">
          <el-input placeholder="请输入网站名进行搜索" prefix-icon="el-icon-search" v-model="domainSearch"></el-input>
        </div>
        <el-button type="primary" @click="onClickCreateDomain()">添加网站</el-button>
      </el-row>
      <div class="demo-block">
        <el-table :data="
          tableData.filter(
            (data) =>
              !domainSearch ||
              data.domain.toLowerCase().includes(domainSearch.toLowerCase())
          )
        " style="width: 100%">
          <el-table-column prop="domain" label="域名/IP"></el-table-column>
          <el-table-column prop="protocol" label="协议">
            <template #default="scope">
              <p v-if="scope.row.http == 'true'">http</p>
              <p v-if="scope.row.https == 'true'">https</p>
            </template>
          </el-table-column>
          <el-table-column prop="protection" label="防护设置">
            <template #default="scope">
              <p>
                Web防护引擎：
                <span v-if="scope.row.web_engine_protection == 'true'">
                  <i class="el-icon-circle-check icon-success"></i>已开启
                </span>
                <span v-if="scope.row.web_engine_protection == 'false'">
                  <i class="el-icon-circle-close icon-error"></i>未开启
                </span>
              </p>
              <p>
                Web规则防护：
                <span v-if="scope.row.web_rule_protection == 'true'">
                  <i class="el-icon-circle-check icon-success"></i>已开启
                </span>
                <span v-if="scope.row.web_rule_protection == 'false'">
                  <i class="el-icon-circle-close icon-error"></i>未开启
                </span>
              </p>
              <p>
                流量防护引擎：
                <span v-if="scope.row.flow_engine_protection == 'true'">
                  <i class="el-icon-circle-check icon-success"></i>已开启
                </span>
                <span v-if="scope.row.flow_engine_protection == 'false'">
                  <i class="el-icon-circle-close icon-error"></i>未开启
                </span>
              </p>
              <p>
                流量规则防护：
                <span v-if="scope.row.flow_rule_protection == 'true'">
                  <i class="el-icon-circle-check icon-success"></i>已开启
                </span>
                <span v-if="scope.row.flow_rule_protection == 'false'">
                  <i class="el-icon-circle-close icon-error"></i>未开启
                </span>
              </p>
              <p>
                名单防护：
                <span v-if="scope.row.name_list == 'true'">
                  <i class="el-icon-circle-check icon-success"></i>已开启
                </span>
                <span v-if="scope.row.name_list == 'false'">
                  <i class="el-icon-circle-close icon-error"></i>未开启
                </span>
              </p>
              <p>
                组件防护
                <span v-if="scope.row.name_list == 'true'">
                  <i class="el-icon-circle-check icon-success"></i>已开启
                </span>
                <span v-if="scope.row.name_list == 'false'">
                  <i class="el-icon-circle-close icon-error"></i>未开启
                </span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="right">
            <template #default="scope">
              <el-button size="mini" @click="handleEdit(scope.row)" class="button-block" type="text"
                :loading="scope.row.loading">网站配置</el-button>
              <el-button size="mini" @click="handleProtection(scope.row)" class="button-block" type="text">防护配置
              </el-button>
              <el-popover placement="top" width="160" v-model:visible="scope.row.isVisiblePopover">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.isVisiblePopover = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleDelete(scope.row)" :loading="loading">确定
                  </el-button>
                </div>
                <template #reference>
                  <el-button type="text" size="mini" @click="scope.row.isVisiblePopover = true">删除</el-button>
                </template>

              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>

    <el-dialog :title="domainTitle" v-model="dialogDomainFormVisible" width="520px" :close-on-click-modal="false"
      @closed="dialogClose">
      <el-form class="form-tag-dialog" :model="domainForm" size="mini" label-position="left" label-width="130px"
        :rules="rules" ref="domainForm">
        <el-form-item label="域名/IP" prop="domain" key="1">
          <el-input v-model="domainForm.domain" v-if="domainType == 'new'" placeholder="请输入IP或域名，域名支持通配符，例如*.jxwaf.com">
          </el-input>
          <el-input v-model="domainForm.domain" v-if="domainType == 'edit'" disabled="disabled"></el-input>
          <p class="form-info-color" v-if="domainType == 'new'">
            （请输入IP或域名，域名支持通配符，例如*.jxwaf.com）
          </p>
        </el-form-item>
        <el-form-item label="协议类型" prop="checkListProtocol" key="2">
          <el-checkbox-group v-model="domainForm.checkListProtocol">
            <el-checkbox label="HTTP" key="HTTP"></el-checkbox>
            <el-checkbox label="HTTPS" key="HTTPS"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <div v-if="domainForm.checkListProtocol.indexOf('HTTPS') > -1">
          <el-tabs type="border-card" class="domain-tabs" v-model="selectTabsValue">
            <el-tab-pane label="SSL证书管理" name="0">
              <el-form-item label="SSL证书" key="3">
                <el-select v-model="domainForm.ssl_domain" placeholder="请选择或输入模糊搜索" filterable>
                  <el-option v-for="item in sslOptions" :key="item.ssl_domain" :label="item.ssl_domain"
                    :value="item.ssl_domain">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="手动输入" name="1">

              <el-form-item label="公钥" prop="public_key" key="5" v-if="selectTabsValue=='1'">
                <el-input v-model="domainForm.public_key" placeholder="需包含证书链" type="textarea" :rows="4"></el-input>
              </el-form-item>
              <el-form-item label="私钥" prop="private_key" key="6" v-if="selectTabsValue=='1'">
                <el-input v-model="domainForm.private_key" type="textarea" :rows="4"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>

        </div>

        <el-form-item label="源站地址" key="7">
          <el-tag :key="index" v-for="(tag, index) in sourceIpList" closable :disable-transitions="false"
            @close="handleCloseSourceIpList(tag)">{{ tag }}</el-tag>
          <el-input class="input-new-tag node-ip-list" v-if="sourceIpListVisible" v-model="sourceIpListValue"
            ref="saveTagSourceIpList" size="mini" @keyup.enter="handleSourceIpListConfirm"
            @blur="handleSourceIpListConfirm"></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showSourceIpList">
            <i class="el-icon-plus"></i>
          </el-button>
          <p class="form-info-color">
            （支持IP和域名，域名需要省略https:// 或 http://）
          </p>
        </el-form-item>

        <el-form-item label="源站端口" prop="source_http_port" key="8">
          <el-input placeholder="仅支持http" v-model="domainForm.source_http_port"></el-input>
        </el-form-item>
        <el-form-item label="回源协议" prop="proxy_pass_https" key="9">
          <el-radio v-model="domainForm.proxy_pass_https" label="false">http</el-radio>
          <el-radio v-model="domainForm.proxy_pass_https" label="true">https</el-radio>
        </el-form-item>

      </el-form>
      <template #footer class="dialog-footer">
        <el-button @click="dialogDomainFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onClickDomainSubmit('domainForm')" :loading="loading">确定</el-button>
      </template>
    </el-dialog>
  </el-row>
</template>
<script>
import { validatePort, validateDomain, mixin, JXAjax } from "../assets/scripts/common";
export default {
  mixins: [mixin],
  data() {
    return {
      domainTitle: "添加网站",
      domainType: "new",
      domainSearch: "",

      dialogDomainFormVisible: false,

      loading: false,
      dialogSysInitVisible: false,
      domainForm: {
        source_http_port: "80",
        proxy_pass_https: "false",
        checkListProtocol: [],
      },

      tableData: [],
      sourceIpList: [],
      sourceIpListVisible: false,
      sourceIpListValue: "",
      flagTag: true,
      sslOptions: [],
      selectTabsValue: "0"
    };
  },
  computed: {
    rules() {
      return {
        domain: [
          {
            required: true,
            message: '请输入网站地址',
            trigger: ["blur", "change"],
          },
          {
            validator: validateDomain,
            trigger: ["blur", "change"],
          },
        ],
        source_http_port: [
          {
            required: true,
            message: '请输入后端服务器端口信息',
            trigger: ["blur", "change"],
          },
          {
            validator: validatePort,
            trigger: ["blur", "change"],
          },
        ],
        checkListProtocol: [
          {
            type: "array",
            required: true,
            message: '请至少选择一项协议类型',
            trigger: "change",
          },
        ],
        public_key: [
          { required: true, message: '请输入公钥', trigger: "blur" },
        ],
        private_key: [
          { required: true, message: '请输入私钥', trigger: "blur" },
        ],
      }
    }
  },
  
  mounted() {
    this.getData();
  },
  methods: {
    handleCloseSourceIpList(tag) {
      this.sourceIpList.splice(this.sourceIpList.indexOf(tag), 1);
    },
    showSourceIpList() {
      this.sourceIpListVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagSourceIpList.$refs.input.focus();
      });
    },
    handleSourceIpListConfirm() {
      let t = this;
      let sourceIpListValue = this.sourceIpListValue;
      let pattern = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      //let pattern = /^(((https|http)?:\/)?\/)/;
      if (t.flagTag) {
        t.flagTag = false;
        if (sourceIpListValue) {
          if (pattern.test(sourceIpListValue)) {
            JXAjax(
              "post",
              "/ip_check",
              { ip: sourceIpListValue },
              function (response) {
                if (response.data.result) {
                  t.sourceIpList.push(sourceIpListValue);
                  t.sourceIpListVisible = false;
                  t.sourceIpListValue = "";
                } else {
                  t.$message({
                    showClose: true,
                    message: "请输入正确的IP地址",
                    type: "error",
                  });
                }
              },
              function () {
                
              },
              "no-message"
            );
            
          } else {
            t.$message({
              showClose: true,
              message: "请输入源站IP地址",
              type: "error",
            });
          }
        } else {
          t.sourceIpListVisible = false;
          t.sourceIpListValue = "";
        }
        setTimeout(function () {
          t.flagTag = true;
        }, 50);
      }
    },

    getData() {
      var t = this;
      JXAjax(
        "get",
        "/waf/waf_get_domain_list",
        {},
        function (response) {

          t.tableData = response.data.message;
          t.tableData.forEach(item => {
            item.isVisiblePopover = false;
          })
        },
        function () {

        }
      );
    },

    getSSL(){
      var t = this;
      JXAjax(
        "get",
        "/waf/waf_get_sys_ssl_manage_list",
        {},
        function (response) {
          t.sslOptions = response.data.message;
        },
        function () {
          
        }
      );
    },

    dialogClose() {
      this.domainForm = {
        source_http_port: "80",
        proxy_pass_https: "false",
        checkListProtocol: [],
      };
      this.selectTabsValue = "0";
      this.sourceIpListVisible = false;
      this.sourceIpListValue = "";
      this.sourceIpList = [];

      this.$refs["domainForm"].resetFields();
    },


    onClickDomainSubmit(domainForm) {
      var t = this;
      var arrProtocol = t.domainForm.checkListProtocol;
      var postUrl = "/waf/waf_create_domain";
      if (t.domainType == "edit") {
        postUrl = "/waf/waf_edit_domain";
      }
      if (t.sourceIpList.length == 0) {
        t.$message({
          message: '后端服务器ip/域名不能为空',
          type: "error",
        });
        return false;
      }
      
      if (t.domainForm.checkListProtocol.indexOf('HTTPS') < 0) {
        t.domainForm.ssl_source = "ssl_manage";
        t.domainForm.ssl_domain = "";
      } else {
        if (t.selectTabsValue == "0") {
          if (t.domainForm.ssl_domain == "") {
            t.$message({
              message: '请选择SSL证书',
              type: "error",
            });
            return false;
          } else {
            t.domainForm.ssl_source = "ssl_manage";
            t.domainForm.public_key = "";
            t.domainForm.private_key = "";
          }

        } else {
          if (t.domainForm.public_key == "" || t.domainForm.private_key == "") {
            t.$message({
              message: '公钥/私钥不能为空',
              type: "error",
            });
            return false;
          } else {
            t.domainForm.ssl_source = "custom";
            t.domainForm.ssl_domain = "";
          }
        }
      }
      t.domainForm.source_ip = t.sourceIpList.join(",");
      t.domainForm.http = arrProtocol.indexOf("HTTP") > -1 ? "true" : "false";
      t.domainForm.https = arrProtocol.indexOf("HTTPS") > -1 ? "true" : "false";
      this.$refs[domainForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.domainForm,
            function (response) {
              t.loading = false;
              t.dialogDomainFormVisible = false;
              t.sourceIpListVisible = false;
              t.sourceIpListValue = "";
              t.sourceIpList = [];
              t.getData();
            },
            function () {
              t.loading = false;
            }
          );
        }
      });
    },
    
    onClickDefault(){
      window.location.href = "/#/default"
    },

    onClickCreateDomain() {
      var t = this;
      t.domainTitle = "添加网站";
      t.domainType = "new";
      t.dialogDomainFormVisible = true;
      t.getSSL();
    },

    handleEdit(data) {
      
      var t = this;

      data.loading = true;
      t.getSSL();
      JXAjax(
        "post",
        "/waf/waf_get_domain",
        { domain: data.domain },
        function (response) {
          
          data.loading = false;
          var oGetData = response.data.message;
          t.domainForm.domain = oGetData.domain;
          t.domainForm.private_key = oGetData.private_key;
          t.domainForm.public_key = oGetData.public_key;
          t.domainForm.ssl_domain = oGetData.ssl_domain;
          t.domainForm.proxy_pass_https = oGetData.proxy_pass_https;
          t.domainForm.source_http_port = oGetData.source_http_port;
          
          t.sourceIpList = oGetData.source_ip
            ? oGetData.source_ip.split(",")
            : [];
          t.domainForm.isVisiblePopover = false;

          if (oGetData.http == "true") {
            t.domainForm.checkListProtocol.push("HTTP");
          }
          if (oGetData.https == "true") {
            t.domainForm.checkListProtocol.push("HTTPS");
          }
          if (oGetData.ssl_domain == "") {
            t.selectTabsValue = "1"
          } else { 
            t.selectTabsValue = "0"
          }
          t.domainTitle = '编辑网站';
          t.domainType = "edit";
          t.dialogDomainFormVisible = true;
        },
        function () {
          data.loading = false;
        },
        "no-message"
      );
    },
    handleProtection(data) {
      window.location.href = "/#/protection/" + data.domain + '/single_rule';
    },

    handleDelete(data) {
      var t = this;
      t.loading = true;
      JXAjax(
        "post",
        "/waf/waf_del_domain",
        { domain: data.domain },
        function (response) {
          data.isVisiblePopover = false;
          t.loading = false;
          t.getData();
        },
        function () {
          t.loading = false;
        }
      );
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
.icon-success {
  color: #67c23a;
  margin-right: 5px;
}
.icon-error {
  color: #f56c6c;
  margin-right: 5px;
}
.icon-warning {
  color: #e6a23c;
  margin-right: 5px;
}
.domain-setting {
  float: right;
}
.domain-redirect {
  margin-top: 5px;
  margin-bottom: 0px !important;
}

.el-form-item.is-required .redirect-box .el-form-item__label:before {
  content: "";
}
.domain-search-input {
  display: block;
  float: left;
  text-align: left;
}
.domain-search-input .el-input {
  width: 100%;
}
.no-padding {
  padding: 0;
}
.node-detail span {
  font-size: 12px;
}
.domain-tabs {
  margin-bottom: 18px;
}
</style>
