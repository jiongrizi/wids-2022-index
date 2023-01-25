<template>
  <el-row v-loading.fullscreen.lock="loadingPage">
    <el-col :span="24">
      <el-row class="text-align-right">
        <div class="group-search-input">
          <el-input placeholder="输入分组名称进行搜索" prefix-icon="el-icon-search" v-model="groupSearch"></el-input>
        </div>
        <el-button type="primary" @click="onClickCreategroup()">新建网站分组</el-button>
      </el-row>
      <div class="demo-block">
        <el-table :data="
          tableData.filter(
            (data) =>
              !groupSearch ||
              data.group.toLowerCase().includes(groupSearch.toLowerCase())
          )
        " style="width: 100%">
          <el-table-column prop="group_name" label="分组名称"></el-table-column>
          <el-table-column prop="group_detail" label="描述"></el-table-column>
          <el-table-column prop="protection" label="防护配置">
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
                组件防护：
                <span v-if="scope.row.name_list == 'true'">
                  <i class="el-icon-circle-check icon-success"></i>已开启
                </span>
                <span v-if="scope.row.name_list == 'false'">
                  <i class="el-icon-circle-close icon-error"></i>未开启
                </span>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="domain_count" label="网站数量"></el-table-column>
          <el-table-column label="操作" align="right">
            <template #default="scope">
              <el-button size="mini" @click="handleDomain(scope.row)" class="button-block" type="text">网站管理</el-button>
              <el-button size="mini" @click="handleProtection(scope.row)" class="button-block" type="text">防护配置
              </el-button>
              <el-button size="mini" @click="handleEditGroup(scope.row)" class="button-block" type="text">编辑分组
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

    <el-dialog :title="groupTitle" v-model="dialogGroupFormVisible" width="520px" :close-on-click-modal="false"
      @close="dialogClose">
      <el-form :model="groupForm" size="mini" label-position="left" label-width="120px" :rules="rules" ref="groupForm"
        class="form-tag-dialog">
        <el-form-item label="分组名称" prop="group_name" key="1">
          <el-input v-model="groupForm.group_name" placeholder="请输入字母或数字，如group_1"></el-input>
          <p class="form-info-color">
            （请输入以字母开头，仅支持下划线“_”及中横线“-”两种特殊字符）
          </p>
        </el-form-item>
        <el-form-item label="分组描述" key="2">
          <el-input v-model="groupForm.group_detail" placeholder="请输入分组描述" :rows="2" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button @click="dialogGroupFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onClickgroupSubmit('groupForm')" :loading="loading">确定</el-button>
      </template>
    </el-dialog>
  </el-row>
</template>
<script>
import { validateRuleName, mixin, JXAjax } from "../assets/scripts/common";
export default {
  mixins: [mixin],
  data() {
    return {
      groupTitle: "新建分组",
      groupType: "new",
      groupSearch: "",
      loadingPage: false,
      dialogGroupFormVisible: false,
      loading: false,
      groupForm: {
        group_name: "",
        group_detail: "",
      },
      tableData: [],
    };
  },
  computed: {
    rules() {
      return {
        group_name: [
          {
            required: true,
            message: "请输入以字母开头的字符串，仅支持“_”及“-”两种特殊字符",
            trigger: ["blur", "change"],
          },
          {
            validator: validateRuleName,
            trigger: ["blur", "change"],
          },
        ],
      };
    },
  },

  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      var t = this;
      JXAjax(
        "get",
        "/waf/waf_get_group_list",
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
      this.groupForm = {
        group_name: "",
        group_detail: "",
      };
      this.$refs["groupForm"].resetFields();
    },

    onClickgroupSubmit(groupForm) {
      var t = this;
      var postUrl = "/waf/waf_create_group";
      if (t.groupType == "edit") {
        postUrl = "/waf/waf_edit_group";
      }

      this.$refs[groupForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.groupForm,
            function (response) {
              t.loading = false;
              t.dialogGroupFormVisible = false;
              t.getData();
            },
            function () {
              t.loading = false;
            }
          );
        }
      });
    },
    onClickCreategroup() {
      var t = this;
      t.groupTitle = "新建分组";
      t.groupType = "new";
      t.dialogGroupFormVisible = true;
    },

    handleProtection(data) {
      window.location.href = "/#/group-protection/" + data.group_id;
    },
    handleDomain(data) {
      window.location.href = "/#/group-domain/" + data.group_id;
    },
    handleEditGroup(data) { 
      var t = this;
      JXAjax(
        "post",
        "/waf/waf_get_group",
        { group_id: data.group_id },
        function (response) {
          data.loading = false;
          t.groupForm = response.data.message;
          t.groupTitle = "编辑分组";
          t.groupType = "edit";
          t.dialogGroupFormVisible = true;
        },
        function () {
          data.loading = false;
        },
        "no-message"
      );
      
    },
    handleDelete(data) {
      var t = this;
      t.loading = true;
      JXAjax(
        "post",
        "/waf/waf_del_group",
        { group_id: data.group_id, group_name: data.group_name },
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
.group-setting {
  float: right;
}
.group-redirect {
  margin-top: 5px;
  margin-bottom: 0px !important;
}

.el-form-item.is-required .redirect-box .el-form-item__label:before {
  content: "";
}
.group-search-input {
  display: block;
  float: left;
  text-align: left;
}
.group-search-input .el-input {
  width: 100%;
}
.no-padding {
  padding: 0;
}
.node-detail span {
  font-size: 12px;
}
</style>
