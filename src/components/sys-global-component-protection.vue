<template>
  <el-row v-loading.fullscreen.lock="loadingPage">
    <el-col :span="24">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="12">
          <h3>组件检测配置</h3>
        </el-col>
        <el-col :span="12" class="text-align-right">
          
        </el-col>
      </el-row>
      <div class="margin-4x"></div>
      <el-row>
        <el-col :span="24">
          <el-row class="text-align-right">
            <div class="ssl-search-input">
              <el-input placeholder="请输入名称进行搜索" prefix-icon="el-icon-search" v-model="dataSearch"></el-input>
            </div>
            <el-button type="primary" @click="onClickCreate()">新建组件</el-button>
          </el-row>
          <div class="demo-block">
            <el-table
              :data="tableData.filter((data) => !dataSearch || data.ssl.toLowerCase().includes(dataSearch.toLowerCase()))"
              style="width: 100%">
              <el-table-column prop="name" label="组件名称"></el-table-column>
              <el-table-column prop="detail" label="组件描述"></el-table-column>
              <el-table-column prop="conf" label="配置"></el-table-column>
              <el-table-column label="加载状态">
                <template #default="scope">
                  <p v-if="scope.row.status == 'true'">已加载</p>
                  <p v-if="scope.row.status == 'false'">未加载</p>
                </template>
              </el-table-column>
              

              <el-table-column label="操作" align="right">
                
                <template #default="scope">
                  <el-button size="mini" @click="handleEdit(scope.row)" class="button-block" type="text">编辑</el-button>

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
        </el-row>
      </el-col>

      <el-dialog v-model="dialogCreateFormVisible" :title="title" :close-on-click-modal="false" width="520px"
        @closed="dialogCloseCreate">
        <el-form class="form-download-rule-dialog" :model="createForm" label-position="left" label-width="130px"
          :rules="rules" ref="createForm">
          <el-form-item label="组件名称" key="1"  prop="name">
            <el-input v-model="createForm.name" placeholder="Please input"  v-if="type == 'new'"/>
            <el-input v-model="createForm.name" placeholder="Please input"  disabled v-else/>
          </el-form-item>
          <el-form-item label="组件描述" key="2">
            <el-input v-model="createForm.detail" placeholder="Please input" />
          </el-form-item>
          <el-form-item label="CODE" key="4"  prop="code">
            <el-input v-model="createForm.code" :rows="5" type="textarea" placeholder="Please input" />
          </el-form-item>
          <el-form-item label="默认配置" key="3">
            <el-input v-model="create_conf" :rows="5" type="textarea" placeholder="Please input" />
          </el-form-item>
        </el-form>
        
        <template #footer class="dialog-footer">
          <el-button @click="dialogCreateFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onClickCreateSubmit('createForm')" :loading="loading">确定
          </el-button>
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
      dataSearch: "",
      loadingPage: false,
      loading: false,
      tableData: [],
      createForm: {
        detail:""
      },
      conf: {},
      create_conf: "",
      title: "新建组件",
      type: "new",
      dialogCreateFormVisible:false,
    };
  },
  computed: {
    rules() {
      return {
         name: [
          { required: true, message: '请输入组件名称', trigger: "blur" },
        ],
        
         code: [
          { required: true, message: '请输入code', trigger: "blur" },
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
        "/sys/waf_get_sys_global_component_protection_list",
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
  
    handleDelete(data) {
      var t = this;
      
      if (data.status == 'true') { 
        t.$message({
          showClose: true,
          message: '该项是加载状态，无法删除',
          type: "error",
        });
        return false;
      }
      t.loading = true;
      JXAjax(
        "post",
        "/sys/waf_delete_sys_global_component_protection",
        { name: data.name },
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
    handleEdit(data) { 
      this.dialogCreateFormVisible = true;
      this.type = "edit";
      this.title = "编辑组件";
      this.createForm = data;
      var jsonObj = JSON.parse(data.conf) 
      this.create_conf = JSON.stringify(jsonObj, null, 4);
    },
    onClickCreate(){
      this.dialogCreateFormVisible = true;
      this.type = "new";
      this.title = "新建组件";
      this.create_conf="";
    },
    dialogCloseCreate() { 
      this.createForm = {
        detail:""
      };
      this.create_conf="";
      this.$refs["createForm"].resetFields();
    },
    onClickCreateSubmit(createForm) {
      var t = this;
      var o = "";
      var jsonObj = {};
      var postUrl = "/sys/waf_edit_sys_web_component_protection";
      if (t.type == "new") { 
        postUrl = "/sys/waf_create_sys_global_component_protection";
      }
      try  {
        o = JSON.stringify(JSON.parse(t.create_conf));
        jsonObj = JSON.parse(t.create_conf); 
        t.create_conf = JSON.stringify(jsonObj, null, 4);
      } catch(error) {
        t.$message({
          showClose: true,
          message: '请输入正确JSON格式',
          type: "error",
        });
        return false;
      }
      
      t.createForm.conf = o;
      this.$refs[createForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.createForm,
            function (response) {
              t.loading = false;
              t.dialogCreateFormVisible = false;
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
