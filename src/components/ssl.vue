<template>
  <el-row v-loading.fullscreen.lock="loadingPage">
    <el-col :span="24">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="12">
          <h3>SSL证书管理</h3>
        </el-col>
        <el-col :span="12" class="text-align-right">

        </el-col>
      </el-row>
      <div class="margin-4x"></div>
      <el-row>
        <el-col :span="24">
          <el-row class="text-align-right">
            <div class="ssl-search-input">
              <el-input placeholder="请输入名称进行搜索" prefix-icon="el-icon-search" v-model="sslSearch"></el-input>
            </div>
            <el-button type="primary" @click="onClickCreateSSL()">添加SSL证书</el-button>
          </el-row>
          <div class="demo-block">
            <el-table :data="
          tableData.filter(
            (data) =>
              !sslSearch ||
              data.ssl.toLowerCase().includes(sslSearch.toLowerCase())
          )
        " style="width: 100%">
              <el-table-column prop="ssl_domain" label="SSL证书域名"></el-table-column>
              <el-table-column prop="" label="关联网站">
                <template #default="scope">
                  <p>
                    网站：{{ scope.row.waf_domain_count }}
                  </p>
                  <p>
                    网站分组：{{ scope.row.waf_group_domain_count }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column prop="update_time" label="更新时间"></el-table-column>

              <el-table-column label="操作" align="right">
                <template #default="scope">
                  <el-button size="mini" @click="handleEdit(scope.row)" class="button-block" type="text">编辑</el-button>
                  <el-popover placement="top" width="160" v-model="scope.row.isVisiblePopover">
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
      </el-row>
    </el-col>
    <el-dialog :title="sslTitle" v-model="dialogsslFormVisible" width="520px" :close-on-click-modal="false"
      @close="dialogClose">
      <el-form class="form-tag-dialog" :model="sslForm" size="mini" label-position="left" label-width="130px"
        :rules="rules" ref="sslForm">
        <el-form-item label="SSL证书域名" prop="ssl_domain" key="1">
          <el-input v-model="sslForm.ssl_domain" v-if="sslType == 'new'" placeholder="支持通配符，且为小写，例如 www.jxwaf.com">
          </el-input>
          <el-input v-model="sslForm.ssl_domain" v-if="sslType == 'edit'" disabled="disabled"></el-input>

        </el-form-item>


        <el-form-item label="公钥" prop="public_key" key="23">
          <el-input v-model="sslForm.public_key" placeholder="需包含证书链" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="私钥" prop="private_key" key="3">
          <el-input v-model="sslForm.private_key" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button @click="dialogsslFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onClicksslSubmit('sslForm')" :loading="loading">确定</el-button>
      </template>
    </el-dialog>
  </el-row>
</template>
<script>
import { mixin, JXAjax } from "../assets/scripts/common";
export default {
  mixins: [mixin],
  data() {
    return {
      sslTitle: "添加证书",
      sslType: "new",
      sslSearch: "",
      loadingPage: false,
      dialogsslFormVisible: false,
      loading: false,

      sslForm: {
        ssl_domain: "",
        private_key: "",
        public_key: ""
      },

      tableData: [],
      
    };
  },
  computed: {
    rules() {
      return {
        ssl_domain: [
          {
            required: true,
            message: '请输入证书名',
            trigger: ["blur", "change"],
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
    
    getData() {
      var t = this;
      JXAjax(
        "get",
        "/waf/waf_get_sys_ssl_manage_list",
        {},
        function (response) {
          t.loadingPage = false;
          t.tableData = response.data.message;
          t.tableData.forEach(item => {
            item.isVisiblePopover = false;
          })
        },
        function () {
          t.loadingPage = false;
        }
      );
    },
    
    dialogClose() {
      this.sslForm = {
        ssl_domain: "",
        public_key: "",
        private_key: ""
      };
      
      this.$refs["sslForm"].resetFields();
    },

    onClicksslSubmit(sslForm) {
      var t = this;
      var postUrl = "/waf/waf_create_sys_ssl_manage";
      if (t.sslType == "edit") {
        postUrl = "/waf/waf_edit_sys_ssl_manage";
      }
      this.$refs[sslForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.sslForm,
            function (response) {
              t.loading = false;
              t.dialogsslFormVisible = false;
              t.getData();
            },
            function () {
              t.loading = false;
            }
          );
        }
      });
    },

    onClickCreateSSL() {
      var t = this;
      t.sslTitle = "添加证书";
      t.sslType = "new";
      t.dialogsslFormVisible = true;
    },

    handleEdit(data) {
      
      var t = this;
      t.sslForm.ssl_domain = data.ssl_domain;
      t.sslForm.private_key = data.private_key;
      t.sslForm.public_key = data.public_key;
      
      t.sslForm.isVisiblePopover = false;

      t.sslTitle = '编辑证书';
      t.sslType = "edit";
      t.dialogsslFormVisible = true;
    },

    handleDelete(data) {
      var t = this;
      t.loading = true;
      JXAjax(
        "post",
        "/waf/waf_del_sys_ssl_manage",
        { ssl_domain: data.ssl_domain },
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
.ssl-setting {
  float: right;
}
.ssl-redirect {
  margin-top: 5px;
  margin-bottom: 0px !important;
}

.el-form-item.is-required .redirect-box .el-form-item__label:before {
  content: "";
}
.ssl-search-input {
  display: block;
  float: left;
  text-align: left;
}
.ssl-search-input .el-input {
  width: 100%;
}
.no-padding {
  padding: 0;
}
.node-detail span {
  font-size: 12px;
}
</style>
